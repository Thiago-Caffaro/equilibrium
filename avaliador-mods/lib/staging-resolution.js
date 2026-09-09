import { MetadataLookupError, resolveProjectMetadataById } from "./project-metadata.js";
import { curseForgeApiKeyFromEnvironment } from "./curseforge-config.js";

const MODRINTH_API = "https://api.modrinth.com/v2";
const CURSEFORGE_API = "https://api.curseforge.com/v1";
const MINECRAFT_GAME_ID = 432;
const USER_AGENT = "Equilibrium-Mod-Evaluator/0.1 (https://github.com/Thiago-Caffaro/equilibrium)";
const CURSEFORGE_MIN_INTERVAL_MS = 350;
const UPSTREAM_MAX_ATTEMPTS = 3;

let curseForgeQueue = Promise.resolve();
let nextCurseForgeRequestAt = 0;

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function queueCurseForge(operation) {
  const scheduled = curseForgeQueue.then(async () => {
    const delay = Math.max(0, nextCurseForgeRequestAt - Date.now());
    if (delay > 0) await wait(delay);
    try {
      return await operation();
    } finally {
      nextCurseForgeRequestAt = Date.now() + CURSEFORGE_MIN_INTERVAL_MS;
    }
  });
  curseForgeQueue = scheduled.catch(() => undefined);
  return scheduled;
}

function retryAfterSeconds(response) {
  const value = response.headers?.get("retry-after");
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? Math.max(0, Math.ceil((timestamp - Date.now()) / 1000)) : null;
}

function retryDelayMilliseconds(response, attempt) {
  const serverDelay = retryAfterSeconds(response);
  if (serverDelay !== null) return serverDelay * 1000;
  return 400 * (2 ** attempt);
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

function plainFileName(value) {
  return String(value || "").split(/[\\/]/).pop() || "mod.jar";
}

function fallbackName(fileName) {
  return plainFileName(fileName)
    .replace(/\.jar$/i, "")
    .replace(/[-_.]?(?:mc)?1\.\d+(?:\.\d+)?[\w.+-]*$/i, "")
    .replace(/[-_.]?v?\d+(?:\.\d+){1,4}[\w.+-]*$/i, "")
    .replace(/[-_]+/g, " ")
    .trim() || plainFileName(fileName).replace(/\.jar$/i, "");
}

function cleanMetadataText(value, limit = 240) {
  return String(value || "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, limit);
}

function metadataStrings(value, limit = 40) {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(values.map((item) => cleanMetadataText(item, 120)).filter(Boolean))].slice(0, limit);
}

function normaliseJarMetadata(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    format: cleanMetadataText(source.format, 120) || "Não identificado",
    mods: (Array.isArray(source.mods) ? source.mods : []).slice(0, 24).map((mod) => ({
      modId: cleanMetadataText(mod?.modId, 160),
      name: cleanMetadataText(mod?.name, 180),
      version: cleanMetadataText(mod?.version, 100),
      loader: cleanMetadataText(mod?.loader, 60),
      authors: metadataStrings(mod?.authors),
      dependencies: metadataStrings(mod?.dependencies, 80)
    })).filter((mod) => mod.modId || mod.name),
    warnings: metadataStrings(source.warnings, 10)
  };
}

function identityTerms(descriptor) {
  const internal = descriptor.jarMetadata?.mods?.[0] || {};
  return unique([internal.name, internal.modId, fallbackName(descriptor.fileName)]).slice(0, 3);
}

function comparableProjectName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function isRelevantCandidate(candidate, searchedName) {
  const expected = comparableProjectName(searchedName);
  const received = comparableProjectName(candidate?.name);
  if (expected.length < 3 || !received) return false;
  return received === expected || received.startsWith(expected) || expected.startsWith(received);
}

function normaliseDescriptor(input) {
  const fileName = plainFileName(input?.fileName);
  const sha1 = String(input?.sha1 || "").trim().toLowerCase();
  const suppliedFingerprint = Number(input?.curseFingerprint);
  if (!/^[a-f0-9]{40}$/.test(sha1)) {
    throw new MetadataLookupError(`Hash SHA-1 inválido para ${fileName}.`, { code: "INVALID_JAR_DESCRIPTOR", statusCode: 400 });
  }
  if (!Number.isInteger(suppliedFingerprint) || suppliedFingerprint < -0x80000000 || suppliedFingerprint > 0xffffffff) {
    throw new MetadataLookupError(`Fingerprint CurseForge inválido para ${fileName}.`, { code: "INVALID_JAR_DESCRIPTOR", statusCode: 400 });
  }
  // Compatibilidade com fichas gravadas pela versão que serializava Murmur2
  // como int32 assinado. O padrão de bits é o mesmo; a API exige uint32.
  const curseFingerprint = suppliedFingerprint >>> 0;
  return {
    fileName,
    relativePath: String(input?.relativePath || fileName)
      .split(/[\\/]+/)
      .filter((part) => part && part !== "." && part !== "..")
      .join("/")
      .slice(0, 500) || fileName,
    size: Math.max(0, Number(input?.size) || 0),
    sha1,
    curseFingerprint,
    jarMetadata: normaliseJarMetadata(input?.jarMetadata)
  };
}

async function requestJson(url, { fetchImpl, headers = {}, method = "GET", body, rateLimit = "none" } = {}) {
  const execute = async () => {
    let lastError;
    for (let attempt = 0; attempt < UPSTREAM_MAX_ATTEMPTS; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetchImpl(url, {
          method,
          headers: { accept: "application/json", "user-agent": USER_AGENT, ...headers },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const payload = await response.json().catch(() => null);
        if (response.ok) return payload;
        const transient = response.status === 429 || response.status >= 500;
        lastError = new MetadataLookupError(
          response.status === 429 ? "A plataforma limitou temporariamente as consultas." : `A plataforma respondeu com erro ${response.status}.`,
          {
            code: response.status === 429 ? "STAGING_RATE_LIMITED" : "STAGING_UPSTREAM_ERROR",
            statusCode: 502,
            upstreamStatus: response.status,
            retryAfterSeconds: retryAfterSeconds(response),
            retryable: transient
          }
        );
        if (!transient || attempt === UPSTREAM_MAX_ATTEMPTS - 1) throw lastError;
        await wait(retryDelayMilliseconds(response, attempt));
      } catch (error) {
        if (error instanceof MetadataLookupError) {
          if (attempt === UPSTREAM_MAX_ATTEMPTS - 1 || !error.retryable) throw error;
          lastError = error;
          await wait(400 * (2 ** attempt));
        } else if (error.name === "AbortError") {
          lastError = new MetadataLookupError("A plataforma demorou demais para responder.", { code: "STAGING_TIMEOUT" });
          if (attempt === UPSTREAM_MAX_ATTEMPTS - 1) throw lastError;
          await wait(400 * (2 ** attempt));
        } else {
          lastError = new MetadataLookupError("Não foi possível consultar a plataforma.", { code: "STAGING_NETWORK_ERROR" });
          if (attempt === UPSTREAM_MAX_ATTEMPTS - 1) throw lastError;
          await wait(400 * (2 ** attempt));
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    throw lastError;
  };
  return rateLimit === "curseforge" ? queueCurseForge(execute) : execute();
}

async function mapLimited(items, limit, operation) {
  const output = new Array(items.length);
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      output[current] = await operation(items[current]);
    }
  }));
  return output;
}

function fieldsFromMetadata(metadata) {
  return {
    name: metadata.name || "",
    sourceUrl: metadata.sourceUrl || "",
    projectUrl: metadata.projectUrl || "",
    supportedVersions: metadata.supportedVersions || [],
    loaders: metadata.loaders || [],
    officialSummary: metadata.summary || "",
    officialAuthors: metadata.authors || [],
    officialProjectId: metadata.projectId || "",
    officialCategories: metadata.categories || [],
    officialEnvironment: metadata.environment || [],
    officialLicense: metadata.license || "",
    officialProvider: metadata.provider || "",
    officialPublishedAt: metadata.publishedAt || "",
    officialUpdatedAt: metadata.updatedAt || "",
    officialDownloads: metadata.downloads ?? "",
    officialIconUrl: metadata.iconUrl || "",
    metadataSourceUrl: metadata.sourceUrl || "",
    metadataFetchedAt: metadata.fetchedAt || new Date().toISOString()
  };
}

function markSourceError(result, error) {
  result.state = "error";
  result.errorCode = error?.code || "STAGING_UPSTREAM_ERROR";
  result.upstreamStatus = Number.isInteger(error?.upstreamStatus) ? error.upstreamStatus : null;
  result.retryAfterSeconds = Number.isFinite(Number(error?.retryAfterSeconds)) ? Number(error.retryAfterSeconds) : null;
}

function curseForgeFetch(fetchImpl) {
  return (...args) => queueCurseForge(() => fetchImpl(...args));
}

async function resolveCurseForge(descriptors, { fetchImpl, curseForgeApiKey }) {
  const state = new Map(descriptors.map((descriptor) => [descriptor.sha1, {
    provider: "CurseForge",
    state: "unavailable",
    projectId: "",
    sourceUrl: "",
    candidates: []
  }]));
  if (!curseForgeApiKey) {
    for (const result of state.values()) result.state = "not-configured";
    return { state, metadata: new Map() };
  }

  const headers = { "x-api-key": curseForgeApiKey, "content-type": "application/json" };
  try {
    const payload = await requestJson(`${CURSEFORGE_API}/fingerprints/${MINECRAFT_GAME_ID}`, {
      fetchImpl,
      headers,
      method: "POST",
      body: { fingerprints: descriptors.map((descriptor) => descriptor.curseFingerprint) },
      rateLimit: "curseforge"
    });
    const byFingerprint = new Map(descriptors.map((descriptor) => [String(descriptor.curseFingerprint), descriptor]));
    const projectIds = new Set();
    for (const match of payload?.data?.exactMatches || []) {
      const descriptor = byFingerprint.get(String(match?.file?.fileFingerprint));
      if (!descriptor || !match?.file?.modId) continue;
      const result = state.get(descriptor.sha1);
      result.state = "exact";
      result.projectId = String(match.file.modId);
      projectIds.add(result.projectId);
    }

    const entries = await mapLimited([...projectIds], 1, async (projectId) => {
      try {
        const metadata = await resolveProjectMetadataById({ provider: "curseforge", projectId }, { fetchImpl: curseForgeFetch(fetchImpl), curseForgeApiKey });
        return [projectId, metadata];
      } catch (error) {
        return [projectId, { error }];
      }
    });
    const metadata = new Map(entries);
    for (const result of state.values()) {
      const entry = metadata.get(result.projectId);
      if (entry && !entry.error) result.sourceUrl = entry.sourceUrl;
      if (entry?.error) markSourceError(result, entry.error);
    }

    const unresolved = descriptors.filter((descriptor) => state.get(descriptor.sha1).state === "unavailable");
    await mapLimited(unresolved, 1, async (descriptor) => {
      try {
        let candidates = [];
        for (const searchedName of identityTerms(descriptor)) {
          const query = new URLSearchParams({ gameId: String(MINECRAFT_GAME_ID), classId: "6", searchFilter: searchedName, pageSize: "50" });
          const search = await requestJson(`${CURSEFORGE_API}/mods/search?${query}`, { fetchImpl, headers, rateLimit: "curseforge" });
          candidates = (search?.data || [])
            .filter((candidate) => !Number.isFinite(Number(candidate.classId)) || Number(candidate.classId) === 6)
            .filter((candidate) => isRelevantCandidate(candidate, searchedName))
            .map((candidate) => ({
              provider: "CurseForge",
              projectId: String(candidate.id || ""),
              name: candidate.name || "",
              sourceUrl: candidate.links?.websiteUrl || ""
            }))
            .filter((candidate) => candidate.projectId)
            .filter((candidate, index, list) => list.findIndex((other) => other.projectId === candidate.projectId) === index)
            .slice(0, 5);
          if (candidates.length > 0) break;
        }
        const result = state.get(descriptor.sha1);
        result.candidates = candidates;
        result.state = candidates.length === 1 ? "candidate" : candidates.length > 1 ? "ambiguous" : "missing";
      } catch (error) {
        markSourceError(state.get(descriptor.sha1), error);
      }
    });
    return { state, metadata };
  } catch (error) {
    for (const result of state.values()) markSourceError(result, error);
    return { state, metadata: new Map() };
  }
}

async function resolveModrinth(descriptors, { fetchImpl }) {
  const state = new Map(descriptors.map((descriptor) => [descriptor.sha1, {
    provider: "Modrinth",
    state: "missing",
    projectId: "",
    sourceUrl: "",
    candidates: []
  }]));
  try {
    for (let index = 0; index < descriptors.length; index += 100) {
      const batch = descriptors.slice(index, index + 100);
      const payload = await requestJson(`${MODRINTH_API}/version_files`, {
        fetchImpl,
        headers: { "content-type": "application/json" },
        method: "POST",
        body: { hashes: batch.map((descriptor) => descriptor.sha1), algorithm: "sha1" }
      });
      for (const descriptor of batch) {
        const version = payload?.[descriptor.sha1];
        if (!version?.project_id) continue;
        const result = state.get(descriptor.sha1);
        result.state = "exact";
        result.projectId = String(version.project_id);
        result.sourceUrl = `https://modrinth.com/mod/${encodeURIComponent(result.projectId)}`;
      }
    }

    const unresolved = descriptors.filter((descriptor) => state.get(descriptor.sha1).state === "missing");
    await mapLimited(unresolved, 3, async (descriptor) => {
      try {
        let candidates = [];
        for (const searchedName of identityTerms(descriptor)) {
          const query = new URLSearchParams({ query: searchedName, limit: "50", facets: '[["project_type:mod"]]' });
          const search = await requestJson(`${MODRINTH_API}/search?${query}`, { fetchImpl });
          candidates = (search?.hits || [])
            .filter((candidate) => isRelevantCandidate({ name: candidate.title || candidate.slug }, searchedName))
            .map((candidate) => ({
              provider: "Modrinth",
              projectId: String(candidate.project_id || ""),
              name: candidate.title || candidate.slug || "",
              sourceUrl: candidate.slug ? `https://modrinth.com/mod/${encodeURIComponent(candidate.slug)}` : ""
            }))
            .filter((candidate) => candidate.projectId)
            .filter((candidate, index, list) => list.findIndex((other) => other.projectId === candidate.projectId) === index)
            .slice(0, 5);
          if (candidates.length > 0) break;
        }
        const result = state.get(descriptor.sha1);
        result.candidates = candidates;
        result.state = candidates.length === 1 ? "candidate" : candidates.length > 1 ? "ambiguous" : "missing";
      } catch {
        // A ausência de busca complementar não invalida uma consulta de hash
        // que já respondeu; apenas preservamos o estado "missing".
      }
    });
  } catch {
    for (const result of state.values()) result.state = "error";
  }
  return state;
}

function keyFor(descriptor, curseForge, modrinth) {
  const curse = curseForge.state.get(descriptor.sha1);
  const modrinthResult = modrinth.get(descriptor.sha1);
  if (curse?.state === "exact") return `curseforge:${curse.projectId}`;
  if (modrinthResult?.state === "exact") return `modrinth:${modrinthResult.projectId}`;
  return `file:${descriptor.sha1}`;
}

export async function resolveJarDescriptors(inputs, {
  fetchImpl = globalThis.fetch,
  curseForgeApiKey = curseForgeApiKeyFromEnvironment(),
  author = "Anônimo"
} = {}) {
  if (!Array.isArray(inputs) || inputs.length === 0 || inputs.length > 1500) {
    throw new MetadataLookupError("Envie entre 1 e 1500 identificadores de JAR.", { code: "INVALID_JAR_BATCH", statusCode: 400 });
  }
  const descriptors = inputs.map(normaliseDescriptor);
  const [curseForge, modrinth] = await Promise.all([
    resolveCurseForge(descriptors, { fetchImpl, curseForgeApiKey }),
    resolveModrinth(descriptors, { fetchImpl })
  ]);
  const groups = new Map();
  for (const descriptor of descriptors) {
    const key = keyFor(descriptor, curseForge, modrinth);
    const group = groups.get(key) || [];
    group.push(descriptor);
    groups.set(key, group);
  }

  return [...groups.values()].map((files) => {
    const first = files[0];
    const curse = curseForge.state.get(first.sha1);
    const modrinthResult = modrinth.get(first.sha1);
    const metadata = curse?.state === "exact" ? curseForge.metadata.get(curse.projectId) : null;
    const factual = metadata && !metadata.error ? fieldsFromMetadata(metadata) : {};
    const sources = [curse, modrinthResult];
    const candidateCount = sources.reduce((total, source) => total + (source?.candidates?.length || 0), 0);
    const hasExact = sources.some((source) => source?.state === "exact");
    const resolution = hasExact ? "confirmed" : candidateCount > 1 ? "ambiguous" : candidateCount === 1 ? "candidate" : "unresolved";
    const internal = first.jarMetadata?.mods?.[0] || {};
    return {
      kind: "staging",
      name: factual.name || internal.name || internal.modId || fallbackName(first.fileName),
      status: "Não avaliado",
      evaluator: author,
      divisions: [],
      tags: [],
      notApplicableFields: [],
      ...factual,
      stagingResolution: resolution,
      jarMetadata: first.jarMetadata,
      stagingFiles: files,
      stagingSources: {
        curseforge: curse,
        modrinth: modrinthResult
      },
      stagingMessage: resolution === "confirmed"
        ? "Confirmado pelo arquivo instalado."
        : resolution === "ambiguous"
          ? "Há mais de um candidato compatível; escolha manualmente antes de promover."
          : resolution === "candidate"
            ? "Há um candidato compatível; confira os metadados internos antes de promover."
          : "Sem confirmação exata; complete ou pesquise a ficha antes de promover."
    };
  });
}
