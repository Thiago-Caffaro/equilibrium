import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

const COLLECTIONS = new Set(["mods", "references", "staging"]);
const DOCUMENT_NAME = /^[a-z0-9][a-z0-9._-]*\.(md|json)$/i;
const RECORD_ID = /^[a-z0-9][a-z0-9-]{7,80}$/i;

export class ConflictError extends Error {
  constructor(current) {
    super("Este registro foi alterado por outra pessoa.");
    this.name = "ConflictError";
    this.current = current;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function ensureCollection(collection) {
  if (!COLLECTIONS.has(collection)) throw new ValidationError("Coleção inválida.");
  return collection;
}

function cleanAuthor(value) {
  return String(value || "Anônimo").trim().slice(0, 80) || "Anônimo";
}

function storageVersionOf(record) {
  const storageVersion = Number(record?.storageVersion);
  if (Number.isInteger(storageVersion) && storageVersion > 0) return storageVersion;

  // Compatibilidade com fichas criadas antes da separação entre salvamento e revisão.
  const legacyRevision = Number(record?.revision);
  return Number.isInteger(legacyRevision) && legacyRevision > 0 ? legacyRevision : 1;
}

function normaliseRecord(input, collection) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("A ficha precisa ser um objeto JSON.");
  }

  const output = structuredClone(input);
  output.kind = collection === "mods" ? "mod" : collection === "staging" ? "staging" : "reference";
  output.name = String(output.name || "").trim().slice(0, 180);
  if (!output.name) throw new ValidationError("O nome é obrigatório.");

  for (const key of ["divisions", "tags", "supportedVersions", "loaders", "candidateMods", "notApplicableFields", "officialAuthors", "officialCategories", "officialEnvironment"]) {
    if (output[key] === undefined) continue;
    const separator = key === "supportedVersions" ? /[\s|;,]+/ : /[|;,]/;
    output[key] = Array.isArray(output[key])
      ? output[key].map((item) => String(item).trim()).filter(Boolean).slice(0, 80)
      : String(output[key]).split(separator).map((item) => item.trim()).filter(Boolean).slice(0, 80);
  }

  delete output.__proto__;
  delete output.constructor;
  delete output.prototype;
  return output;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function atomicWrite(path, value) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, path);
}

export function createStore({ dataRoot }) {
  const queue = new Map();
  const collectionPath = (collection) => join(dataRoot, ensureCollection(collection));
  const recordPath = (collection, id) => join(collectionPath(collection), `${id}.json`);

  async function initialise() {
    await Promise.all([
      mkdir(collectionPath("mods"), { recursive: true }),
      mkdir(collectionPath("references"), { recursive: true }),
      mkdir(collectionPath("staging"), { recursive: true }),
      mkdir(join(dataRoot, "library"), { recursive: true })
    ]);
  }

  function serialise(key, operation) {
    const previous = queue.get(key) || Promise.resolve();
    const next = previous.then(operation);
    const tracked = next.then(() => undefined, () => undefined);
    queue.set(key, tracked);
    void tracked.then(() => {
      if (queue.get(key) === tracked) queue.delete(key);
    });
    return next;
  }

  async function list(collection) {
    await initialise();
    const entries = await readdir(collectionPath(collection), { withFileTypes: true });
    const records = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      try {
        records.push(await readJson(join(collectionPath(collection), entry.name)));
      } catch (error) {
        records.push({
          id: entry.name.replace(/\.json$/, ""),
          name: `[JSON inválido: ${entry.name}]`,
          status: "Erro de arquivo",
          fileError: error.message,
          updatedAt: ""
        });
      }
    }
    return records.sort((left, right) =>
      String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")) ||
      String(left.name || "").localeCompare(String(right.name || ""), "pt-BR")
    );
  }

  async function get(collection, id) {
    await initialise();
    ensureCollection(collection);
    if (!RECORD_ID.test(id)) throw new ValidationError("Identificador inválido.");
    try {
      return await readJson(recordPath(collection, id));
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }

  async function create(collection, input, author = "Anônimo", preferredId) {
    await initialise();
    const normalised = normaliseRecord(input, collection);
    const id = preferredId && RECORD_ID.test(preferredId) ? preferredId : randomUUID();
    const key = `${collection}:${id}`;
    return serialise(key, async () => {
      if (await get(collection, id)) throw new ConflictError(await get(collection, id));
      const now = new Date().toISOString();
      const importedRevision = Number(normalised.revision);
      const record = {
        ...normalised,
        id,
        revision: Number.isInteger(importedRevision) && importedRevision > 0 ? importedRevision : 0,
        storageVersion: 1,
        createdAt: now,
        updatedAt: now,
        updatedBy: cleanAuthor(author)
      };
      await atomicWrite(recordPath(collection, id), record);
      return record;
    });
  }

  async function save(collection, id, input, options = {}) {
    await initialise();
    const key = `${collection}:${id}`;
    return serialise(key, async () => {
      const current = await get(collection, id);
      if (!current) return null;
      const currentStorageVersion = storageVersionOf(current);
      const expected = Number(options.expectedStorageVersion);
      if (!options.force && Number.isFinite(expected) && expected !== currentStorageVersion) {
        throw new ConflictError(current);
      }
      const normalised = normaliseRecord(input, collection);
      const record = {
        ...current,
        ...normalised,
        id: current.id,
        kind: current.kind,
        revision: Number(current.revision || 0),
        storageVersion: currentStorageVersion + 1,
        reviewedAt: current.reviewedAt,
        reviewedBy: current.reviewedBy,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
        updatedBy: cleanAuthor(options.author)
      };
      await atomicWrite(recordPath(collection, id), record);
      return record;
    });
  }

  async function review(collection, id, options = {}) {
    await initialise();
    const key = `${collection}:${id}`;
    return serialise(key, async () => {
      const current = await get(collection, id);
      if (!current) return null;
      const currentStorageVersion = storageVersionOf(current);
      const expected = Number(options.expectedStorageVersion);
      if (Number.isFinite(expected) && expected !== currentStorageVersion) {
        throw new ConflictError(current);
      }
      const now = new Date().toISOString();
      const author = cleanAuthor(options.author);
      const record = {
        ...current,
        revision: Number(current.revision || 0) + 1,
        storageVersion: currentStorageVersion + 1,
        reviewedAt: now,
        reviewedBy: author,
        updatedAt: now,
        updatedBy: author
      };
      await atomicWrite(recordPath(collection, id), record);
      return record;
    });
  }

  async function remove(collection, id, options = {}) {
    await initialise();
    const key = `${collection}:${id}`;
    return serialise(key, async () => {
      const current = await get(collection, id);
      if (!current) return null;
      const expected = Number(options.expectedStorageVersion);
      if (!options.force && Number.isFinite(expected) && expected !== storageVersionOf(current)) {
        throw new ConflictError(current);
      }
      await unlink(recordPath(collection, id));
      return current;
    });
  }

  async function removeMany(collection, requested = []) {
    await initialise();
    ensureCollection(collection);
    if (!Array.isArray(requested) || requested.length === 0 || requested.length > 1500) {
      throw new ValidationError("Selecione entre 1 e 1500 fichas para excluir.");
    }
    const items = [];
    const ids = new Set();
    for (const input of requested) {
      const id = String(input?.id || "");
      if (!RECORD_ID.test(id)) throw new ValidationError("Identificador inválido na seleção.");
      if (ids.has(id)) continue;
      ids.add(id);
      items.push({ id, expectedStorageVersion: Number(input?.expectedStorageVersion) });
    }
    return serialise(`bulk-remove:${collection}`, async () => {
      const current = await Promise.all(items.map(({ id }) => get(collection, id)));
      const conflicts = current.flatMap((record, index) => {
        if (!record) return [{ id: items[index].id, reason: "missing" }];
        const expected = items[index].expectedStorageVersion;
        if (Number.isFinite(expected) && expected !== storageVersionOf(record)) {
          return [{ id: record.id, name: record.name, reason: "changed", record }];
        }
        return [];
      });
      // The batch is intentionally all-or-nothing: a changed record must not
      // cause the other selected records to disappear without reconfirmation.
      if (conflicts.length > 0) return { deleted: [], conflicts };
      await Promise.all(items.map(({ id }) => unlink(recordPath(collection, id))));
      return { deleted: current.map((record) => ({ id: record.id, name: record.name })), conflicts: [] };
    });
  }

  async function findByName(collection, name) {
    const target = String(name || "").trim().toLocaleLowerCase("pt-BR");
    if (!target) return null;
    return (await list(collection)).find((record) =>
      String(record.name || "").trim().toLocaleLowerCase("pt-BR") === target
    ) || null;
  }

  function normalisedUrl(value) {
    try {
      const url = new URL(String(value || "").trim());
      url.hash = "";
      url.search = "";
      return url.toString().replace(/\/$/, "").toLocaleLowerCase("pt-BR");
    } catch {
      return "";
    }
  }

  function externalKeys(record) {
    const keys = new Set();
    for (const value of [record?.sourceUrl, record?.metadataSourceUrl]) {
      const url = normalisedUrl(value);
      if (url) keys.add(`url:${url}`);
    }
    const provider = String(record?.officialProvider || "").trim().toLocaleLowerCase("pt-BR");
    const projectId = String(record?.officialProjectId || "").trim();
    if (provider && projectId) keys.add(`project:${provider}:${projectId}`);
    for (const source of Object.values(record?.stagingSources || {})) {
      if (!source || typeof source !== "object") continue;
      const sourceProvider = String(source.provider || "").trim().toLocaleLowerCase("pt-BR");
      const sourceProject = String(source.projectId || "").trim();
      if (sourceProvider && sourceProject) keys.add(`project:${sourceProvider}:${sourceProject}`);
      const sourceUrl = normalisedUrl(source.sourceUrl);
      if (sourceUrl) keys.add(`url:${sourceUrl}`);
    }
    return keys;
  }

  async function findEquivalentMod(record) {
    const target = externalKeys(record);
    if (target.size === 0) return null;
    return (await list("mods")).find((candidate) => [...externalKeys(candidate)].some((key) => target.has(key))) || null;
  }

  async function promoteStage(id, options = {}) {
    await initialise();
    return serialise("promotion:mods", () => serialise(`staging:${id}`, async () => {
      const stage = await get("staging", id);
      if (!stage) return { stage: null, record: null, duplicate: null };
      const expected = Number(options.expectedStorageVersion);
      if (!options.force && Number.isFinite(expected) && expected !== storageVersionOf(stage)) {
        throw new ConflictError(stage);
      }
      const duplicate = await findEquivalentMod(stage);
      if (duplicate) return { stage, record: null, duplicate };

      const source = structuredClone(stage);
      delete source.id;
      delete source.storageVersion;
      delete source.createdAt;
      delete source.updatedAt;
      delete source.updatedBy;
      delete source.reviewedAt;
      delete source.reviewedBy;
      delete source.revision;
      source.kind = "mod";
      source.status = source.status || "Não avaliado";
      source.stagedAt = stage.createdAt;
      source.stagedFiles = source.stagingFiles || [];
      delete source.stagingFiles;
      const record = await create("mods", source, options.author);
      await unlink(recordPath("staging", id));
      return { stage, record, duplicate: null };
    }));
  }

  async function importRecords(collection, records, { mode = "skip", author = "Importação" } = {}) {
    if (!Array.isArray(records)) throw new ValidationError("A importação precisa conter uma lista de fichas.");
    if (!new Set(["skip", "upsert", "copy"]).has(mode)) throw new ValidationError("Modo de importação inválido.");
    const result = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (let index = 0; index < records.length; index += 1) {
      const source = records[index];
      try {
        const existing = (source?.id && await get(collection, String(source.id))) || await findByName(collection, source?.name);
        if (existing && mode === "skip") {
          result.skipped += 1;
          continue;
        }
        if (existing && mode === "upsert") {
          await save(collection, existing.id, source, { force: true, author });
          result.updated += 1;
          continue;
        }
        await create(collection, source, author, mode === "copy" ? undefined : source?.id);
        result.created += 1;
      } catch (error) {
        result.errors.push({ index, name: source?.name || "", error: error.message });
      }
    }
    return result;
  }

  async function listDocuments() {
    await initialise();
    const entries = await readdir(join(dataRoot, "library"), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && DOCUMENT_NAME.test(entry.name))
      .map((entry) => ({ name: entry.name, type: entry.name.endsWith(".md") ? "markdown" : "json" }))
      .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
  }

  async function getDocument(name) {
    if (!DOCUMENT_NAME.test(name)) throw new ValidationError("Nome de documento inválido.");
    try {
      return await readFile(join(dataRoot, "library", name), "utf8");
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }

  async function saveDocument(name, content) {
    await initialise();
    if (!DOCUMENT_NAME.test(name)) throw new ValidationError("Use um nome simples terminado em .md ou .json.");
    const text = String(content ?? "");
    if (name.endsWith(".json")) JSON.parse(text);
    const path = join(dataRoot, "library", name);
    const temporary = `${path}.${randomUUID()}.tmp`;
    await writeFile(temporary, text.endsWith("\n") ? text : `${text}\n`, "utf8");
    await rename(temporary, path);
    return { name, type: name.endsWith(".md") ? "markdown" : "json" };
  }

  return {
    initialise,
    list,
    get,
    create,
    save,
    review,
    remove,
    removeMany,
    promoteStage,
    importRecords,
    listDocuments,
    getDocument,
    saveDocument
  };
}
