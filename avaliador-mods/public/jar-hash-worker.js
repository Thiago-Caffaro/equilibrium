import { curseForgeFingerprint } from "./jar-fingerprint.js";
import { extractJarMetadata } from "./jar-metadata.js";
import { sha1 } from "./sha1.js";

self.onmessage = async ({ data }) => {
  try {
    const content = await data.file.arrayBuffer();
    const bytes = new Uint8Array(content);
    self.postMessage({
      id: data.id,
      descriptor: {
        fileName: data.file.name,
        relativePath: data.relativePath || data.file.name,
        size: data.file.size,
        sha1: await sha1(bytes),
        curseFingerprint: curseForgeFingerprint(bytes),
        jarMetadata: await extractJarMetadata(bytes)
      }
    });
  } catch (error) {
    self.postMessage({ id: data.id, error: error?.message || "Não foi possível ler o JAR." });
  }
};
