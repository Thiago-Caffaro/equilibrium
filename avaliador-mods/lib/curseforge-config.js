function clean(value) {
  return String(value || "").trim();
}

/**
 * Reads the credential without exposing it in the UI or persisted data.
 * The Base64 variant exists for deployment tools that interpolate `$` inside
 * ordinary environment values (some CurseForge keys contain that character).
 */
export function curseForgeApiKeyFromEnvironment(environment = process.env) {
  const encoded = clean(environment?.CURSEFORGE_API_KEY_BASE64);
  if (encoded) {
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) || encoded.length % 4 !== 0) return "";
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    return clean(decoded);
  }
  return clean(environment?.CURSEFORGE_API_KEY);
}
