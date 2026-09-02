import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const COLLECTIONS = new Set(["mods", "references"]);
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
  output.kind = collection === "mods" ? "mod" : "reference";
  output.name = String(output.name || "").trim().slice(0, 180);
  if (!output.name) throw new ValidationError("O nome é obrigatório.");

  for (const key of ["divisions", "tags", "supportedVersions", "loaders", "candidateMods"]) {
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

  async function findByName(collection, name) {
    const target = String(name || "").trim().toLocaleLowerCase("pt-BR");
    if (!target) return null;
    return (await list(collection)).find((record) =>
      String(record.name || "").trim().toLocaleLowerCase("pt-BR") === target
    ) || null;
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
    importRecords,
    listDocuments,
    getDocument,
    saveDocument
  };
}
