import assert from "node:assert/strict";
import test from "node:test";
import { extractJarMetadata } from "../public/jar-metadata.js";

const encoder = new TextEncoder();

function put16(bytes, offset, value) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
}

function put32(bytes, offset, value) {
  put16(bytes, offset, value & 0xffff);
  put16(bytes, offset + 2, value >>> 16);
}

function storedZip(entries) {
  const parts = [];
  const directory = [];
  let offset = 0;
  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const content = encoder.encode(entry.content);
    const local = new Uint8Array(30 + name.length + content.length);
    put32(local, 0, 0x04034b50);
    put16(local, 4, 20);
    put16(local, 26, name.length);
    put32(local, 18, content.length);
    put32(local, 22, content.length);
    local.set(name, 30);
    local.set(content, 30 + name.length);
    parts.push(local);

    const central = new Uint8Array(46 + name.length);
    put32(central, 0, 0x02014b50);
    put16(central, 4, 20);
    put16(central, 6, 20);
    put16(central, 28, name.length);
    put32(central, 20, content.length);
    put32(central, 24, content.length);
    put32(central, 42, offset);
    central.set(name, 46);
    directory.push(central);
    offset += local.length;
  }
  const directorySize = directory.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22);
  put32(end, 0, 0x06054b50);
  put16(end, 8, entries.length);
  put16(end, 10, entries.length);
  put32(end, 12, directorySize);
  put32(end, 16, offset);
  const output = new Uint8Array(offset + directorySize + end.length);
  let cursor = 0;
  for (const part of [...parts, ...directory, end]) {
    output.set(part, cursor);
    cursor += part.length;
  }
  return output;
}

test("lê modId, versão e dependências de fabric.mod.json sem enviar o JAR", async () => {
  const jar = storedZip([{ name: "fabric.mod.json", content: JSON.stringify({
    id: "mod-exemplo",
    name: "Mod Exemplo",
    version: "1.2.3",
    authors: ["Tago"],
    depends: { fabricloader: ">=0.16", minecraft: "1.21.1" }
  }) }]);
  const metadata = await extractJarMetadata(jar);
  assert.equal(metadata.format, "fabric.mod.json");
  assert.deepEqual(metadata.mods, [{
    modId: "mod-exemplo",
    name: "Mod Exemplo",
    version: "1.2.3",
    loader: "Fabric",
    authors: ["Tago"],
    dependencies: ["fabricloader", "minecraft"]
  }]);
});

test("lê identidade básica de META-INF/mods.toml", async () => {
  const jar = storedZip([{ name: "META-INF/mods.toml", content: "[[mods]]\nmodId=\"exemplo\"\ndisplayName=\"Exemplo Forge\"\nversion=\"4.0\"\nauthors=\"Tago\"\n" }]);
  const metadata = await extractJarMetadata(jar);
  assert.equal(metadata.format, "META-INF/mods.toml");
  assert.equal(metadata.mods[0].modId, "exemplo");
  assert.equal(metadata.mods[0].name, "Exemplo Forge");
  assert.equal(metadata.mods[0].loader, "Forge");
});
