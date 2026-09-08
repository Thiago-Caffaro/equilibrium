const MODRINTH_API = "https://api.modrinth.com/v2";
const CURSEFORGE_API = "https://api.curseforge.com/v1";
const MINECRAFT_GAME_ID = 432;
const REQUEST_TIMEOUT_MS = 15000;
const USER_AGENT = "Equilibrium-Mod-Evaluator/0.1 (https://github.com/Thiago-Caffaro/equilibrium)";

const LOADER_NAMES = new Map([
  ["forge", "Forge"],
  ["fabric", "Fabric"],
  ["neoforge", "NeoForge"],
  ["neo forge", "NeoForge"],
  ["quilt", "Quilt"],
  ["rift", "Rift"],
  ["liteloader", "LiteLoader"]
]);

const CURSEFORGE_LOADER_IDS = new Map([
  [1, "Forge"],
  [3, "LiteLoader"],
  [4, "Fabric"],
  [5, "Quilt"],
  [6, "NeoForge"]
]);

export class MetadataLookupError extends Error {
  constructor(message, { code = "METADATA_LOOKUP_FAILED", statusCode = 502 } = {}) {
    super(message);
    this.name = "MetadataLookupError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "pt-BR", { numeric: true, sensitivity: "base" }));
}

function unwrapMarkdownLink(value) {
  const text = String(value || "").trim();
  const match = text.match(/^\[[^\]]*\]\((https?:\/\/[^)]+)\)$/i);
  return match ? match[1] : text;
}

export function parseProjectUrl(value) {
  let url;
  try {
    url = new URL(unwrapMarkdownLink(value));
  } catch {
    throw new MetadataLookupError("Informe uma URL válida do Modrinth ou CurseForge.", {
      code: "INVALID_PROJECT_URL",
      statusCode: 400
    });
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new MetadataLookupError("A URL precisa usar HTTP ou HTTPS.", {
      code: "INVALID_PROJECT_URL",
      statusCode: 400
    });
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const parts = url.pathname.split("/").filter(Boolean);
  if (hostname === "modrinth.com" && parts[0] === "mod" && parts[1]) {
    return {
      provider: "modrinth",
      slug: decodeURIComponent(parts[1]),
      canonicalUrl: `https://modrinth.com/${parts[0]}/${encodeURIComponent(decodeURIComponent(parts[1]))}`
    };
  }
  if (hostname === "curseforge.com" && parts[0] === "minecraft" && parts[1] === "mc-mods" && parts[2]) {
    return {
      provider: "curseforge",
      slug: decodeURIComponent(parts[2]),
      canonicalUrl: `https://www.curseforge.com/minecraft/mc-mods/${encodeURIComponent(decodeURIComponent(parts[2]))}`
    };
  }

  throw new MetadataLookupError("Use o link da página de um mod no Modrinth ou CurseForge.", {
    code: "UNSUPPORTED_PROJECT_URL",
    statusCode: 400
  });
}

async function requestJson(url, { fetchImpl, headers = {} }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetchImpl(url, {
      headers: { accept: "application/json", "user-agent": USER_AGENT, ...headers },
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new MetadataLookupError("A fonte oficial demorou demais para responder.", { code: "METADATA_TIMEOUT" });
    }
    throw new MetadataLookupError("Não foi possível alcançar a fonte oficial.", { code: "METADATA_NETWORK_ERROR" });
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const missing = response.status === 404;
    throw new MetadataLookupError(
      missing ? "O projeto não foi encontrado na fonte informada." : `A fonte oficial respondeu com erro ${response.status}.`,
      { code: missing ? "PROJECT_NOT_FOUND" : "UPSTREAM_ERROR", statusCode: missing ? 404 : 502 }
    );
  }
  return payload;
}

function normalizeLoader(value) {
  const text = String(value || "").trim();
  return LOADER_NAMES.get(text.toLowerCase()) || text;
}

function modrinthEnvironment(project) {
  if (Array.isArray(project.environment)) return unique(project.environment);
  const values = [];
  if (project.client_side) values.push(`Cliente: ${project.client_side}`);
  if (project.server_side) values.push(`Servidor: ${project.server_side}`);
  return unique(values);
}

async function lookupModrinth(parsed, fetchImpl) {
  const project = await requestJson(`${MODRINTH_API}/project/${encodeURIComponent(parsed.slug)}`, { fetchImpl });
  let authors = [];
  if (project.team) {
    try {
      const members = await requestJson(`${MODRINTH_API}/team/${encodeURIComponent(project.team)}/members`, { fetchImpl });
      authors = unique((Array.isArray(members) ? members : []).map((member) => member?.user?.username || member?.user?.name));
    } catch {
      // A autoria é complementar; os demais metadados continuam úteis se esta rota falhar.
    }
  }

  return {
    provider: "Modrinth",
    sourceUrl: `https://modrinth.com/mod/${encodeURIComponent(project.slug || parsed.slug)}`,
    projectId: String(project.id || ""),
    name: project.title || "",
    summary: project.description || "",
    authors,
    supportedVersions: unique(project.game_versions || []),
    loaders: unique((project.loaders || []).map(normalizeLoader)),
    categories: unique([...(project.categories || []), ...(project.additional_categories || [])]),
    environment: modrinthEnvironment(project),
    license: project.license?.name || project.license?.id || "",
    projectUrl: project.source_url || project.wiki_url || project.issues_url || "",
    iconUrl: project.icon_url || "",
    publishedAt: project.published || "",
    updatedAt: project.updated || "",
    downloads: Number.isFinite(project.downloads) ? project.downloads : null,
    fetchedAt: new Date().toISOString()
  };
}

function isGameVersion(value) {
  return /^\d+(?:\.\d+){1,3}(?:[.-][0-9A-Za-z]+)*$/.test(String(value || "").trim());
}

async function lookupCurseForge(parsed, fetchImpl, apiKey) {
  if (!apiKey) {
    throw new MetadataLookupError(
      "O Modrinth funciona sem credencial. Para consultar o CurseForge, configure CURSEFORGE_API_KEY no servidor.",
      { code: "CURSEFORGE_API_KEY_REQUIRED", statusCode: 424 }
    );
  }

  const headers = { "x-api-key": apiKey };
  const query = new URLSearchParams({ gameId: String(MINECRAFT_GAME_ID), slug: parsed.slug, pageSize: "10" });
  const search = await requestJson(`${CURSEFORGE_API}/mods/search?${query}`, { fetchImpl, headers });
  const match = (search?.data || []).find((candidate) => candidate.slug === parsed.slug) || search?.data?.[0];
  if (!match?.id) {
    throw new MetadataLookupError("O projeto não foi encontrado no CurseForge.", {
      code: "PROJECT_NOT_FOUND",
      statusCode: 404
    });
  }

  const [detailsResponse, filesResponse] = await Promise.all([
    requestJson(`${CURSEFORGE_API}/mods/${match.id}`, { fetchImpl, headers }),
    requestJson(`${CURSEFORGE_API}/mods/${match.id}/files?pageSize=50`, { fetchImpl, headers })
  ]);
  const project = detailsResponse?.data || match;
  const files = [...(project.latestFiles || []), ...(filesResponse?.data || [])];
  const tokens = files.flatMap((file) => file.gameVersions || []);
  const loaderTokens = tokens.map(normalizeLoader).filter((value) => [...LOADER_NAMES.values()].includes(value));
  const indexedLoaders = (project.latestFilesIndexes || []).map((item) => CURSEFORGE_LOADER_IDS.get(Number(item.modLoader)));
  const indexedVersions = (project.latestFilesIndexes || []).map((item) => item.gameVersion);

  return {
    provider: "CurseForge",
    sourceUrl: project.links?.websiteUrl || parsed.canonicalUrl,
    projectId: String(project.id || match.id),
    name: project.name || match.name || "",
    summary: project.summary || "",
    authors: unique((project.authors || []).map((author) => author.name)),
    supportedVersions: unique([...tokens.filter(isGameVersion), ...indexedVersions.filter(isGameVersion)]),
    loaders: unique([...loaderTokens, ...indexedLoaders]),
    categories: unique((project.categories || []).map((category) => category.name)),
    environment: [],
    license: "",
    projectUrl: project.links?.sourceUrl || project.links?.wikiUrl || project.links?.issuesUrl || "",
    iconUrl: project.logo?.thumbnailUrl || project.logo?.url || "",
    publishedAt: project.dateCreated || "",
    updatedAt: project.dateModified || project.dateReleased || "",
    downloads: Number.isFinite(project.downloadCount) ? project.downloadCount : null,
    fetchedAt: new Date().toISOString()
  };
}

export async function resolveProjectMetadata(value, {
  fetchImpl = globalThis.fetch,
  curseForgeApiKey = process.env.CURSEFORGE_API_KEY
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new MetadataLookupError("Este servidor não possui suporte a consultas HTTP.");
  }
  const parsed = parseProjectUrl(value);
  return parsed.provider === "modrinth"
    ? lookupModrinth(parsed, fetchImpl)
    : lookupCurseForge(parsed, fetchImpl, curseForgeApiKey);
}
