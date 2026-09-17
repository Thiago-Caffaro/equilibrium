import { queueCurseForgeRequest } from "./curseforge-queue.js";

const MODRINTH_API = "https://api.modrinth.com/v2";
const CURSEFORGE_API = "https://api.curseforge.com/v1";
const MINECRAFT_GAME_ID = 432;
const MOD_CLASS_ID = 6;
const REQUEST_TIMEOUT_MS = 12000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const RESULT_LIMIT = 12;
const USER_AGENT = "Equilibrium-Mod-Evaluator/0.1 (https://github.com/Thiago-Caffaro/equilibrium)";

const CURSEFORGE_LOADERS = new Map([
  ["forge", 1],
  ["fabric", 4],
  ["quilt", 5],
  ["neoforge", 6]
]);

const CURSEFORGE_LOADER_NAMES = new Map([...CURSEFORGE_LOADERS.entries()].map(([name, id]) => [id, name === "neoforge" ? "NeoForge" : `${name[0].toUpperCase()}${name.slice(1)}`]));

function unique(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

function normaliseText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function normaliseSource(value) {
  return ["both", "curseforge", "modrinth"].includes(value) ? value : "both";
}

function normaliseLoader(value) {
  const loader = String(value || "").trim().toLocaleLowerCase("pt-BR").replace(/[ _-]+/g, "");
  return CURSEFORGE_LOADERS.has(loader) ? loader : "";
}

function normaliseQuery(options = {}) {
  const query = String(options.query || "").trim().replace(/\s+/g, " ").slice(0, 120);
  if (query.length < 3) throw new Error("Digite ao menos três caracteres para buscar mods.");
  return {
    query,
    source: normaliseSource(String(options.source || "both").toLocaleLowerCase()),
    version: String(options.version || "").trim().slice(0, 40),
    loader: normaliseLoader(options.loader)
  };
}

function sourceError(provider, error) {
  return {
    provider,
    state: "error",
    upstreamStatus: Number.isInteger(error?.upstreamStatus) ? error.upstreamStatus : null,
    message: error?.message || "Não foi possível consultar esta fonte."
  };
}

async function requestJson(url, { fetchImpl, headers = {} } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, {
      headers: { accept: "application/json", "user-agent": USER_AGENT, ...headers },
      signal: controller.signal
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(response.status === 401 ? "Credencial da fonte rejeitada." : `A fonte respondeu com erro ${response.status}.`);
      error.upstreamStatus = response.status;
      throw error;
    }
    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("A fonte demorou demais para responder.");
      timeoutError.upstreamStatus = null;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function modrinthResult(hit) {
  const categories = unique(hit.categories || []);
  return {
    provider: "modrinth",
    projectId: String(hit.project_id || hit.projectId || ""),
    name: hit.title || "",
    slug: hit.slug || "",
    sourceUrl: `https://modrinth.com/mod/${encodeURIComponent(hit.slug || hit.project_id || "")}`,
    summary: hit.description || "",
    authors: unique(hit.author ? [hit.author] : []),
    supportedVersions: unique(hit.versions || []),
    loaders: unique(categories.filter((category) => ["forge", "fabric", "neoforge", "quilt"].includes(String(category).toLowerCase())).map((loader) => String(loader).toLowerCase() === "neoforge" ? "NeoForge" : `${loader[0].toUpperCase()}${loader.slice(1)}`)),
    categories,
    iconUrl: hit.icon_url || "",
    downloads: Number.isFinite(Number(hit.downloads)) ? Number(hit.downloads) : null
  };
}

function curseForgeResult(mod) {
  const indexes = Array.isArray(mod.latestFilesIndexes) ? mod.latestFilesIndexes : [];
  return {
    provider: "curseforge",
    projectId: String(mod.id || ""),
    name: mod.name || "",
    slug: mod.slug || "",
    sourceUrl: mod.links?.websiteUrl || `https://www.curseforge.com/minecraft/mc-mods/${encodeURIComponent(mod.slug || mod.id || "")}`,
    summary: mod.summary || "",
    authors: unique((mod.authors || []).map((author) => author?.name)),
    supportedVersions: unique(indexes.map((index) => index?.gameVersion)),
    loaders: unique(indexes.map((index) => CURSEFORGE_LOADER_NAMES.get(Number(index?.modLoader)))),
    categories: unique((mod.categories || []).map((category) => category?.name)),
    iconUrl: mod.logo?.thumbnailUrl || mod.logo?.url || "",
    downloads: Number.isFinite(Number(mod.downloadCount)) ? Number(mod.downloadCount) : null
  };
}

function groupResults(results) {
  const groups = [];
  for (const result of results.filter((item) => item.projectId && item.name)) {
    const titleKey = normaliseText(result.name);
    const slugKey = normaliseText(result.slug);
    let group = groups.find((candidate) => candidate._keys.has(titleKey) || (slugKey && candidate._keys.has(slugKey)));
    if (!group) {
      group = { id: `remote-${result.provider}-${result.projectId}`, name: result.name, sources: [], _keys: new Set() };
      groups.push(group);
    }
    if (titleKey) group._keys.add(titleKey);
    if (slugKey) group._keys.add(slugKey);
    group.sources.push(result);
  }
  return groups.map((group) => {
    const primary = group.sources.find((source) => source.provider === "curseforge") || group.sources[0];
    return {
      id: group.id,
      name: primary.name,
      summary: primary.summary,
      iconUrl: primary.iconUrl || group.sources.find((source) => source.iconUrl)?.iconUrl || "",
      authors: unique(group.sources.flatMap((source) => source.authors)),
      supportedVersions: unique(group.sources.flatMap((source) => source.supportedVersions)),
      loaders: unique(group.sources.flatMap((source) => source.loaders)),
      categories: unique(group.sources.flatMap((source) => source.categories)),
      downloads: Math.max(...group.sources.map((source) => Number(source.downloads) || 0), 0) || null,
      sources: group.sources.sort((left, right) => (left.provider === "curseforge" ? -1 : 1) - (right.provider === "curseforge" ? -1 : 1))
    };
  });
}

export function createRemoteModSearch({
  fetchImpl = globalThis.fetch,
  curseForgeApiKey,
  curseForgeApiKeyProvider,
  cacheTtlMs = CACHE_TTL_MS,
  now = () => Date.now()
} = {}) {
  const cache = new Map();
  const inFlight = new Map();
  const currentCurseForgeApiKey = typeof curseForgeApiKeyProvider === "function"
    ? curseForgeApiKeyProvider
    : () => curseForgeApiKey || "";

  async function searchModrinth(options) {
    const facets = [["project_type:mod"]];
    if (options.version) facets.push([`versions:${options.version}`]);
    if (options.loader) facets.push([`categories:${options.loader}`]);
    const query = new URLSearchParams({
      query: options.query,
      limit: String(RESULT_LIMIT),
      index: "relevance",
      facets: JSON.stringify(facets)
    });
    const payload = await requestJson(`${MODRINTH_API}/search?${query}`, { fetchImpl });
    return (payload?.hits || []).map(modrinthResult).filter((result) => result.projectId);
  }

  async function searchCurseForge(options) {
    const apiKey = String(currentCurseForgeApiKey() || "").trim();
    if (!apiKey) {
      const error = new Error("O cofre do CurseForge está bloqueado ou não foi configurado.");
      error.upstreamStatus = null;
      throw error;
    }
    const query = new URLSearchParams({
      gameId: String(MINECRAFT_GAME_ID),
      classId: String(MOD_CLASS_ID),
      searchFilter: options.query,
      pageSize: String(RESULT_LIMIT)
    });
    if (options.version) query.set("gameVersion", options.version);
    if (options.loader) query.set("modLoaderType", String(CURSEFORGE_LOADERS.get(options.loader)));
    const payload = await queueCurseForgeRequest(() => requestJson(`${CURSEFORGE_API}/mods/search?${query}`, {
      fetchImpl,
      headers: { "x-api-key": apiKey }
    }));
    return (payload?.data || [])
      .filter((mod) => !Number.isFinite(Number(mod?.classId)) || Number(mod.classId) === MOD_CLASS_ID)
      .map(curseForgeResult)
      .filter((result) => result.projectId);
  }

  async function search(rawOptions = {}) {
    const options = normaliseQuery(rawOptions);
    const key = JSON.stringify(options);
    const cached = cache.get(key);
    if (!rawOptions.refresh && cached && cached.expiresAt > now()) return { ...cached.value, cached: true };
    if (!rawOptions.refresh && inFlight.has(key)) return inFlight.get(key);

    const pending = (async () => {
      const requests = [];
      if (options.source !== "curseforge") requests.push(searchModrinth(options).then((results) => ({ provider: "modrinth", results })).catch((error) => ({ provider: "modrinth", error })));
      if (options.source !== "modrinth") requests.push(searchCurseForge(options).then((results) => ({ provider: "curseforge", results })).catch((error) => ({ provider: "curseforge", error })));
      const responses = await Promise.all(requests);
      const sources = {
        modrinth: { provider: "Modrinth", state: options.source === "curseforge" ? "skipped" : "ready" },
        curseforge: { provider: "CurseForge", state: options.source === "modrinth" ? "skipped" : "ready" }
      };
      const results = [];
      for (const response of responses) {
        if (response.error) sources[response.provider] = sourceError(response.provider === "curseforge" ? "CurseForge" : "Modrinth", response.error);
        else results.push(...response.results);
      }
      const value = { query: options, groups: groupResults(results), sources, cached: false };
      cache.set(key, { expiresAt: now() + cacheTtlMs, value });
      return value;
    })();
    inFlight.set(key, pending);
    try {
      return await pending;
    } finally {
      if (inFlight.get(key) === pending) inFlight.delete(key);
    }
  }

  return { search, clearCache: () => cache.clear() };
}

export { groupResults, normaliseQuery };
