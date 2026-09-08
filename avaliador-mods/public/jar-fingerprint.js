export function curseForgeFingerprint(bytes) {
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
  return hash | 0;
}
