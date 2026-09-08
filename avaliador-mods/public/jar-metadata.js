const decoder = new TextDecoder("utf-8", { fatal: false });
const MAX_ENTRY_SIZE = 1024 * 1024;
const MAX_MODS = 24;

function u16(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function u32(bytes, offset) {
  return (bytes[offset]
    | (bytes[offset + 1] << 8)
    | (bytes[offset + 2] << 16)
    | (bytes[offset + 3] << 24)) >>> 0;
}

function clean(value, limit = 240) {
  return String(value || "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, limit);
}

function strings(value, limit = 40) {
  const source = Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : [value];
  return [...new Set(source.map((item) => clean(typeof item === "object" ? item?.name || item?.username : item, 120)).filter(Boolean))].slice(0, limit);
}

function findDirectory(bytes) {
  const minimum = Math.max(0, bytes.length - 65_557);
  for (let offset = bytes.length - 22; offset >= minimum; offset -= 1) {
    if (u32(bytes, offset) === 0x06054b50) {
      return { size: u32(bytes, offset + 12), offset: u32(bytes, offset + 16) };
    }
  }
  throw new Error("O arquivo não contém um diretório ZIP válido.");
}

function zipEntries(bytes) {
  const directory = findDirectory(bytes);
  const end = directory.offset + directory.size;
  const entries = new Map();
  let cursor = directory.offset;
  while (cursor + 46 <= end && u32(bytes, cursor) === 0x02014b50) {
    const compression = u16(bytes, cursor + 10);
    const compressedSize = u32(bytes, cursor + 20);
    const uncompressedSize = u32(bytes, cursor + 24);
    const nameSize = u16(bytes, cursor + 28);
    const extraSize = u16(bytes, cursor + 30);
    const commentSize = u16(bytes, cursor + 32);
    const localOffset = u32(bytes, cursor + 42);
    const name = decoder.decode(bytes.subarray(cursor + 46, cursor + 46 + nameSize));
    entries.set(name.toLowerCase(), { name, compression, compressedSize, uncompressedSize, localOffset });
    cursor += 46 + nameSize + extraSize + commentSize;
  }
  return entries;
}

async function entryText(bytes, entry) {
  if (!entry || entry.uncompressedSize > MAX_ENTRY_SIZE) return "";
  const offset = entry.localOffset;
  if (u32(bytes, offset) !== 0x04034b50) return "";
  const nameSize = u16(bytes, offset + 26);
  const extraSize = u16(bytes, offset + 28);
  const content = bytes.subarray(offset + 30 + nameSize + extraSize, offset + 30 + nameSize + extraSize + entry.compressedSize);
  if (entry.compression === 0) return decoder.decode(content);
  if (entry.compression !== 8 || typeof DecompressionStream !== "function") return "";
  const stream = new Blob([content]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return decoder.decode(new Uint8Array(await new Response(stream).arrayBuffer()));
}

function modRecord(input, loader, fallback = {}) {
  const modId = clean(input?.id || input?.modId || fallback.modId, 160);
  const name = clean(input?.name || input?.displayName || input?.display_name || fallback.name, 180);
  const version = clean(input?.version || fallback.version, 100);
  if (!modId && !name) return null;
  return {
    modId,
    name: name || modId,
    version,
    loader,
    authors: strings(input?.authors || input?.author || input?.contributors || fallback.authors),
    dependencies: strings(input?.depends || input?.dependencies || fallback.dependencies)
  };
}

function parseFabric(text) {
  const data = JSON.parse(text);
  const record = modRecord(data, "Fabric");
  if (!record) return [];
  record.dependencies = strings(Object.keys(data.depends || {}));
  return [record];
}

function parseQuilt(text) {
  const data = JSON.parse(text);
  const loader = data.quilt_loader || data;
  const record = modRecord({
    id: loader.id,
    version: loader.version,
    name: loader.metadata?.name,
    contributors: loader.metadata?.contributors,
    depends: loader.depends
  }, "Quilt");
  if (!record) return [];
  record.dependencies = strings((loader.depends || []).map((item) => item?.id || item));
  return [record];
}

function tomlValue(block, key) {
  const match = block.match(new RegExp(`^\\s*${key}\\s*=\\s*[\"']([^\"']+)[\"']`, "mi"));
  return clean(match?.[1]);
}

function parseToml(text, loader) {
  const blocks = text.split(/^\s*\[\[mods\]\]\s*$/mi).slice(1);
  const candidates = blocks.length ? blocks : [text];
  return candidates.map((block) => modRecord({
    modId: tomlValue(block, "modId"),
    displayName: tomlValue(block, "displayName"),
    version: tomlValue(block, "version"),
    author: tomlValue(block, "authors")
  }, loader)).filter(Boolean).slice(0, MAX_MODS);
}

function parseMcmod(text) {
  const data = JSON.parse(text);
  return (Array.isArray(data) ? data : [data]).map((item) => modRecord({
    modId: item.modid,
    name: item.name,
    version: item.version,
    authors: item.authorList
  }, "Forge")).filter(Boolean).slice(0, MAX_MODS);
}

function parseManifest(text) {
  const attributes = Object.fromEntries(text.split(/\r?\n/).map((line) => {
    const index = line.indexOf(":");
    return index > 0 ? [line.slice(0, index).trim(), clean(line.slice(index + 1))] : [];
  }).filter((entry) => entry.length));
  return modRecord({
    modId: attributes["Automatic-Module-Name"],
    name: attributes["Implementation-Title"] || attributes["Specification-Title"],
    version: attributes["Implementation-Version"] || attributes["Specification-Version"]
  }, "Desconhecido");
}

export async function extractJarMetadata(bytes) {
  const result = { format: "Não identificado", mods: [], warnings: [] };
  try {
    const entries = zipEntries(bytes);
    const find = (name) => entries.get(name.toLowerCase());
    const fabric = await entryText(bytes, find("fabric.mod.json"));
    const quilt = await entryText(bytes, find("quilt.mod.json"));
    const neoforge = await entryText(bytes, find("META-INF/neoforge.mods.toml"));
    const forge = await entryText(bytes, find("META-INF/mods.toml"));
    const legacy = await entryText(bytes, find("mcmod.info"));
    const manifest = await entryText(bytes, find("META-INF/MANIFEST.MF"));
    if (fabric) {
      result.format = "fabric.mod.json";
      result.mods = parseFabric(fabric);
    } else if (quilt) {
      result.format = "quilt.mod.json";
      result.mods = parseQuilt(quilt);
    } else if (neoforge) {
      result.format = "META-INF/neoforge.mods.toml";
      result.mods = parseToml(neoforge, "NeoForge");
    } else if (forge) {
      result.format = "META-INF/mods.toml";
      result.mods = parseToml(forge, "Forge");
    } else if (legacy) {
      result.format = "mcmod.info";
      result.mods = parseMcmod(legacy);
    } else if (manifest) {
      result.format = "META-INF/MANIFEST.MF";
      const record = parseManifest(manifest);
      result.mods = record ? [record] : [];
    }
  } catch (error) {
    result.warnings.push(clean(error?.message || "Não foi possível ler os metadados internos."));
  }
  result.mods = result.mods.slice(0, MAX_MODS);
  return result;
}
