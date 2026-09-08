import { createServer } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { MOD_CSV_FIELDS, REFERENCE_CSV_FIELDS, parseCsv, stringifyCsv } from "./lib/csv.js";
import { MetadataLookupError, resolveProjectMetadata } from "./lib/project-metadata.js";
import { resolveJarDescriptors } from "./lib/staging-resolution.js";
import { ConflictError, ValidationError, createStore } from "./lib/store.js";

const APP_ROOT = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_ROOT = join(APP_ROOT, "public");
const ANALYSES_ROOT = existsSync(join(APP_ROOT, "analises-modpacks"))
  ? join(APP_ROOT, "analises-modpacks")
  : resolve(APP_ROOT, "..", "analises-modpacks");
const DEFAULT_DATA_ROOT = join(APP_ROOT, "data");
const DEFAULT_PORT = Number(process.env.PORT || 8787);
const DEFAULT_HOST = process.env.HOST || "0.0.0.0";
const MAX_BODY_SIZE = 6 * 1024 * 1024;
const STAGING_RESOLUTION_FIELDS = new Set([
  "name", "sourceUrl", "projectUrl", "supportedVersions", "loaders",
  "officialSummary", "officialAuthors", "officialProjectId", "officialCategories",
  "officialEnvironment", "officialLicense", "officialProvider", "officialPublishedAt",
  "officialUpdatedAt", "officialDownloads", "officialIconUrl", "metadataSourceUrl",
  "metadataFetchedAt", "stagingResolution", "stagingFiles", "stagingSources", "stagingMessage"
]);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "content-type": MIME_TYPES[".json"],
    "cache-control": "no-store",
    ...headers
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, content, contentType, headers = {}) {
  response.writeHead(statusCode, {
    "content-type": contentType,
    "cache-control": "no-store",
    ...headers
  });
  response.end(content);
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_SIZE) throw new ValidationError("Arquivo ou requisição maior que 6 MB.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readJsonBody(request) {
  const text = await readBody(request);
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new ValidationError("JSON inválido.");
  }
}

function collectionFromKind(kind) {
  if (kind === "mods" || kind === "references" || kind === "staging") return kind;
  throw new ValidationError("Coleção inválida.");
}

function fieldsFor(collection) {
  return collection === "mods" ? MOD_CSV_FIELDS : REFERENCE_CSV_FIELDS;
}

function parseImportedJson(content, collection) {
  let parsed;
  try {
    parsed = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    throw new ValidationError("O arquivo JSON não pôde ser lido.");
  }

  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.records)) return parsed.records;
  if (Array.isArray(parsed?.[collection])) return parsed[collection];
  throw new ValidationError("O JSON deve conter uma lista ou uma propriedade records.");
}

function applyStagingResolution(stage, resolved) {
  const factualResolution = Object.fromEntries(
    Object.entries(resolved).filter(([key]) => STAGING_RESOLUTION_FIELDS.has(key))
  );
  return { ...stage, ...factualResolution };
}

async function serveStatic(pathname, method, response) {
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^[/\\]+/, "");
  const absolutePath = resolve(PUBLIC_ROOT, normalize(requested));
  if (absolutePath !== PUBLIC_ROOT && !absolutePath.startsWith(`${PUBLIC_ROOT}${sep}`)) {
    sendJson(response, 403, { error: "Caminho inválido." });
    return;
  }

  try {
    const content = await readFile(absolutePath);
    response.writeHead(200, {
      "content-type": MIME_TYPES[extname(absolutePath)] || "application/octet-stream",
      // A interface é servida como um único artefato local. Evitar cache de JS/CSS
      // impede que um navegador continue com uma versão anterior após redeploy.
      "cache-control": "no-cache"
    });
    response.end(method === "HEAD" ? undefined : content);
  } catch {
    sendJson(response, 404, { error: "Página não encontrada." });
  }
}

function analysisFile(name) {
  const safeName = String(name || "");
  if (!/^[a-z0-9][a-z0-9._-]*\.(?:md|json|html)$/i.test(safeName)) {
    throw new ValidationError("Nome de arquivo de análise inválido.");
  }
  return join(ANALYSES_ROOT, safeName);
}

async function listAnalysisDocuments() {
  try {
    const entries = await readdir(ANALYSES_ROOT, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => ({ name: entry.name, title: entry.name.replace(/^\d+-/, "").replace(/\.md$/, "").replaceAll("-", " ") }))
      .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
  } catch {
    return [];
  }
}

async function serveAnalysisStatic(name, method, response) {
  const path = analysisFile(name);
  try {
    const content = await readFile(path);
    response.writeHead(200, {
      "content-type": MIME_TYPES[extname(path)] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    response.end(method === "HEAD" ? undefined : content);
  } catch {
    sendJson(response, 404, { error: "Arquivo de análise não encontrado." });
  }
}

export function createAppServer({ dataRoot = DEFAULT_DATA_ROOT, metadataResolver = resolveProjectMetadata, jarResolver = resolveJarDescriptors } = {}) {
  const store = createStore({ dataRoot });
  void store.initialise();

  return createServer(async (request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const segments = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);

    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(response, 200, {
          ok: true,
          app: "Equilibrium — Avaliador de Mods",
          storage: "json-files",
          now: new Date().toISOString()
        });
        return;
      }

      if (segments[0] === "api" && segments[1] === "records") {
        const collection = collectionFromKind(segments[2]);
        const id = segments[3];

        if (request.method === "GET" && !id) {
          sendJson(response, 200, { records: await store.list(collection) });
          return;
        }
        if (request.method === "GET" && id && !segments[4]) {
          const record = await store.get(collection, id);
          if (!record) sendJson(response, 404, { error: "Ficha não encontrada." });
          else sendJson(response, 200, { record });
          return;
        }
        if (request.method === "POST" && !id) {
          const body = await readJsonBody(request);
          const record = await store.create(collection, body.record || body, body.author);
          sendJson(response, 201, { record });
          return;
        }
        if (request.method === "PUT" && id) {
          const body = await readJsonBody(request);
          const record = await store.save(collection, id, body.record || body, {
            expectedStorageVersion: body.expectedStorageVersion,
            force: Boolean(body.force),
            author: body.author
          });
          if (!record) sendJson(response, 404, { error: "Ficha não encontrada." });
          else sendJson(response, 200, { record });
          return;
        }
        if (request.method === "POST" && id && segments[4] === "review") {
          const body = await readJsonBody(request);
          const record = await store.review(collection, id, {
            expectedStorageVersion: body.expectedStorageVersion,
            author: body.author
          });
          if (!record) sendJson(response, 404, { error: "Ficha não encontrada." });
          else sendJson(response, 200, { record });
          return;
        }
        if (request.method === "DELETE" && id && !segments[4]) {
          const body = await readJsonBody(request);
          const record = await store.remove(collection, id, {
            expectedStorageVersion: body.expectedStorageVersion,
            force: Boolean(body.force)
          });
          if (!record) sendJson(response, 404, { error: "Ficha não encontrada." });
          else sendJson(response, 200, { deleted: { id: record.id, name: record.name } });
          return;
        }
      }

      if (segments[0] === "api" && segments[1] === "staging") {
        const id = segments[2];
        if (request.method === "POST" && !id && segments[2] === undefined) {
          const body = await readJsonBody(request);
          const records = await jarResolver(body.descriptors, { author: body.author });
          const created = [];
          for (const record of records) created.push(await store.create("staging", record, body.author));
          sendJson(response, 201, { records: created });
          return;
        }
        if (request.method === "POST" && id && segments[3] === "resolve") {
          const body = await readJsonBody(request);
          const stage = await store.get("staging", id);
          if (!stage) {
            sendJson(response, 404, { error: "Item de staging não encontrado." });
            return;
          }
          const records = await jarResolver(stage.stagingFiles || [], { author: body.author });
          if (records.length !== 1) throw new ValidationError("Não foi possível reavaliar este item de staging.");
          const record = await store.save("staging", id, applyStagingResolution(stage, records[0]), {
            expectedStorageVersion: body.expectedStorageVersion,
            author: body.author
          });
          sendJson(response, 200, { record });
          return;
        }
        if (request.method === "POST" && id && segments[3] === "promote") {
          const body = await readJsonBody(request);
          const result = await store.promoteStage(id, {
            expectedStorageVersion: body.expectedStorageVersion,
            author: body.author
          });
          if (!result.stage) sendJson(response, 404, { error: "Item de staging não encontrado." });
          else if (result.duplicate) sendJson(response, 409, { error: "Já existe uma ficha equivalente no catálogo.", duplicate: result.duplicate });
          else sendJson(response, 200, { record: result.record });
          return;
        }
      }

      if (segments[0] === "api" && segments[1] === "library") {
        const name = segments[2];
        if (request.method === "GET" && !name) {
          sendJson(response, 200, { documents: await store.listDocuments() });
          return;
        }
        if (request.method === "GET" && name) {
          const content = await store.getDocument(name);
          if (content === null) sendJson(response, 404, { error: "Documento não encontrado." });
          else sendJson(response, 200, { name, content });
          return;
        }
        if (request.method === "PUT" && name) {
          const body = await readJsonBody(request);
          const document = await store.saveDocument(name, body.content);
          sendJson(response, 200, { document });
          return;
        }
      }

      if (segments[0] === "api" && segments[1] === "metadata" && request.method === "POST") {
        const body = await readJsonBody(request);
        const metadata = await metadataResolver(body.url || { provider: body.provider, projectId: body.projectId });
        sendJson(response, 200, { metadata });
        return;
      }

      if (segments[0] === "api" && segments[1] === "analyses") {
        if (request.method === "GET" && segments[2] === "catalog") {
          const content = await readFile(analysisFile("catalogo-apoio-qol-secundarios.json"), "utf8");
          sendText(response, 200, content, MIME_TYPES[".json"]);
          return;
        }
        if (request.method === "GET" && segments[2] === "documents" && !segments[3]) {
          sendJson(response, 200, { documents: await listAnalysisDocuments() });
          return;
        }
        if (request.method === "GET" && segments[2] === "documents" && segments[3]) {
          const content = await readFile(analysisFile(segments[3]), "utf8");
          sendJson(response, 200, { name: segments[3], content });
          return;
        }
      }

      if (segments[0] === "api" && segments[1] === "export" && request.method === "GET") {
        const match = segments[2]?.match(/^(mods|references)\.(json|csv)$/);
        if (!match) throw new ValidationError("Formato de exportação inválido.");
        const [, collection, format] = match;
        const records = await store.list(collection);
        const timestamp = new Date().toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
        if (format === "csv") {
          sendText(response, 200, stringifyCsv(records, fieldsFor(collection)), "text/csv; charset=utf-8", {
            "content-disposition": `attachment; filename="equilibrium-${collection}-${timestamp}.csv"`
          });
        } else {
          sendText(response, 200, `${JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), collection, records }, null, 2)}\n`, MIME_TYPES[".json"], {
            "content-disposition": `attachment; filename="equilibrium-${collection}-${timestamp}.json"`
          });
        }
        return;
      }

      if (segments[0] === "analises-modpacks" && (request.method === "GET" || request.method === "HEAD")) {
        await serveAnalysisStatic(segments[1] || "comparador-apoio-qol-secundarios.html", request.method, response);
        return;
      }

      if (segments[0] === "api" && segments[1] === "import" && request.method === "POST") {
        const collection = collectionFromKind(segments[2]);
        const body = await readJsonBody(request);
        const records = body.format === "csv"
          ? parseCsv(body.content)
          : parseImportedJson(body.content, collection);
        const result = await store.importRecords(collection, records, {
          mode: body.mode,
          author: body.author
        });
        sendJson(response, 200, { result });
        return;
      }

      if (segments[0] !== "api" && (request.method === "GET" || request.method === "HEAD")) {
        await serveStatic(url.pathname, request.method, response);
        return;
      }

      sendJson(response, 405, { error: "Método não permitido." });
    } catch (error) {
      if (error instanceof ConflictError) {
        sendJson(response, 409, { error: error.message, current: error.current });
      } else if (error instanceof MetadataLookupError) {
        sendJson(response, error.statusCode, { error: error.message, code: error.code });
      } else if (error instanceof ValidationError || error instanceof SyntaxError) {
        sendJson(response, 400, { error: error.message });
      } else {
        console.error(error);
        sendJson(response, 500, { error: "Erro interno ao processar a solicitação." });
      }
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const server = createAppServer();
  server.listen(DEFAULT_PORT, DEFAULT_HOST, () => {
    console.log(`Equilibrium disponível em http://${DEFAULT_HOST}:${DEFAULT_PORT}`);
  });
}
