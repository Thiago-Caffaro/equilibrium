function isCurseForgeWhitespace(byte) {
  return byte === 0x09 || byte === 0x0a || byte === 0x0d || byte === 0x20;
}

// O CurseForge calcula Murmur2 sobre o arquivo normalizado: bytes de tab,
// espaço e quebra de linha não participam nem do conteúdo nem do tamanho.
// SHA-1 continua usando o JAR bruto em jar-hash-worker.js.
export function normaliseCurseForgeBytes(bytes) {
  let length = 0;
  for (const byte of bytes) if (!isCurseForgeWhitespace(byte)) length += 1;
  if (length === bytes.length) return bytes;
  const normalised = new Uint8Array(length);
  let offset = 0;
  for (const byte of bytes) {
    if (!isCurseForgeWhitespace(byte)) normalised[offset++] = byte;
  }
  return normalised;
}

export function curseForgeFingerprint(input) {
  const bytes = normaliseCurseForgeBytes(input);
  const multiplier = 0x5bd1e995;
  let hash = (1 ^ bytes.length) >>> 0;
  let offset = 0;
  let remaining = bytes.length;

  while (remaining >= 4) {
    let value = (bytes[offset]
      | (bytes[offset + 1] << 8)
      | (bytes[offset + 2] << 16)
      | (bytes[offset + 3] << 24)) >>> 0;
    value = Math.imul(value, multiplier) >>> 0;
    value ^= value >>> 24;
    value = Math.imul(value, multiplier) >>> 0;
    hash = (Math.imul(hash, multiplier) ^ value) >>> 0;
    offset += 4;
    remaining -= 4;
  }

  if (remaining === 3) hash ^= bytes[offset + 2] << 16;
  if (remaining >= 2) hash ^= bytes[offset + 1] << 8;
  if (remaining >= 1) {
    hash ^= bytes[offset];
    hash = Math.imul(hash, multiplier) >>> 0;
  }
  hash ^= hash >>> 13;
  hash = Math.imul(hash, multiplier) >>> 0;
  hash ^= hash >>> 15;
  // O endpoint do CurseForge declara os fingerprints como int32 sem sinal.
  // Manter o valor em JavaScript como uint32 evita enviar números negativos.
  return hash >>> 0;
}
