import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { curseForgeFingerprint } from "../public/jar-fingerprint.js";
import { sha1Fallback } from "../public/sha1.js";
import { resolveJarDescriptors } from "../lib/staging-resolution.js";
import { createStore } from "../lib/store.js";
import { createAppServer } from "../server.js";

async function temporaryRoot(t) {
  const root = await mkdtemp(join(tmpdir(), "equilibrium-staging-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("fingerprint CurseForge é estável para vetor conhecido", () => {
  assert.equal(curseForgeFingerprint(new TextEncoder().encode("hello")), -1506700914);
});

test("SHA-1 local confere com vetor conhecido", () => {
  assert.equal(sha1Fallback(new TextEncoder().encode("abc")), "a9993e364706816aba3e25717850c26c9cd0d89d");
});

test("resolução de JAR confirma CurseForge e consulta disponibilidade leve do Modrinth", async () => {
  const fetchImpl = async (url, options = {}) => {
    const target = String(url);
    if (target.includes("curseforge.com/v1/fingerprints/432")) {
      assert.equal(options.method, "POST");
      return new Response(JSON.stringify({ data: { exactMatches: [{ file: { fileFingerprint: 123, modId: 456 } }] } }), { status: 200 });
    }
    if (target.endsWith("curseforge.com/v1/mods/456")) {
      return new Response(JSON.stringify({ data: { id: 456, name: "Mod confirmado", summary: "Resumo", authors: [{ name: "Autor" }], categories: [{ name: "Technology" }], latestFilesIndexes: [] } }), { status: 200 });
    }
    if (target.includes("curseforge.com/v1/mods/456/files")) return new Response(JSON.stringify({ data: [] }), { status: 200 });
    if (target.endsWith("modrinth.com/v2/version_files")) return new Response(JSON.stringify({}), { status: 200 });
    throw new Error(`URL inesperada: ${target}`);
  };
  const records = await resolveJarDescriptors([{
    fileName: "mod-confirmado-1.0.jar",
    relativePath: "mods/mod-confirmado-1.0.jar",
    size: 10,
    sha1: "a".repeat(40),
    curseFingerprint: 123
  }], { fetchImpl, curseForgeApiKey: "chave", author: "Teste" });
  assert.equal(records.length, 1);
  assert.equal(records[0].name, "Mod confirmado");
  assert.equal(records[0].stagingResolution, "confirmed");
  assert.equal(records[0].stagingSources.curseforge.state, "exact");
  assert.equal(records[0].stagingSources.modrinth.state, "missing");
});

test("fallback por nome mantém candidatos ambíguos no staging e tolera falha parcial", async () => {
  const fetchImpl = async (url) => {
    const target = String(url);
    if (target.includes("curseforge.com/v1/fingerprints/432")) return new Response(JSON.stringify({ data: { exactMatches: [] } }), { status: 200 });
    if (target.includes("curseforge.com/v1/mods/search")) {
      return new Response(JSON.stringify({ data: [
        { id: 100, name: "Candidato A", links: { websiteUrl: "https://example.test/a" } },
        { id: 101, name: "Candidato B", links: { websiteUrl: "https://example.test/b" } }
      ] }), { status: 200 });
    }
    if (target.endsWith("modrinth.com/v2/version_files")) throw new Error("rede indisponível");
    throw new Error(`URL inesperada: ${target}`);
  };
  const [record] = await resolveJarDescriptors([{
    fileName: "nome-incerto-2.1.jar",
    relativePath: "mods/nome-incerto-2.1.jar",
    size: 10,
    sha1: "c".repeat(40),
    curseFingerprint: 999
  }], { fetchImpl, curseForgeApiKey: "chave" });
  assert.equal(record.stagingResolution, "ambiguous");
  assert.equal(record.stagingSources.curseforge.candidates.length, 2);
  assert.equal(record.stagingSources.modrinth.state, "error");
});

test("promoção preserva staging até detectar duplicata e move ficha única para mods", async (t) => {
  const store = createStore({ dataRoot: await temporaryRoot(t) });
  const stage = await store.create("staging", {
    name: "Candidato",
    sourceUrl: "https://www.curseforge.com/minecraft/mc-mods/candidato",
    officialProvider: "CurseForge",
    officialProjectId: "123",
    stagingFiles: [{ fileName: "candidato.jar", sha1: "b".repeat(40), curseFingerprint: 9 }]
  }, "Teste");
  const promoted = await store.promoteStage(stage.id, { expectedStorageVersion: stage.storageVersion, author: "Teste" });
  assert.equal(promoted.duplicate, null);
  assert.equal(promoted.record.kind, "mod");
  assert.equal(await store.get("staging", stage.id), null);

  const duplicateStage = await store.create("staging", {
    name: "Outro nome",
    sourceUrl: "https://www.curseforge.com/minecraft/mc-mods/candidato",
    officialProvider: "CurseForge",
    officialProjectId: "123"
  }, "Teste");
  const duplicate = await store.promoteStage(duplicateStage.id, { expectedStorageVersion: duplicateStage.storageVersion, author: "Teste" });
  assert.equal(duplicate.record, null);
  assert.equal(duplicate.duplicate.id, promoted.record.id);
  assert.ok(await store.get("staging", duplicateStage.id));
});

test("promoção concorrente não cria dois mods", async (t) => {
  const store = createStore({ dataRoot: await temporaryRoot(t) });
  const stage = await store.create("staging", { name: "Único", sourceUrl: "https://example.test/unico" }, "Teste");
  const results = await Promise.all([
    store.promoteStage(stage.id, { expectedStorageVersion: stage.storageVersion, author: "A" }),
    store.promoteStage(stage.id, { expectedStorageVersion: stage.storageVersion, author: "B" })
  ]);
  assert.equal(results.filter((result) => result.record).length, 1);
  assert.equal((await store.list("mods")).length, 1);
});

test("API cria staging, promove e expõe as análises somente para leitura", async (t) => {
  const server = createAppServer({
    dataRoot: await temporaryRoot(t),
    jarResolver: async () => [{ name: "Do staging", stagingFiles: [{ fileName: "teste.jar", sha1: "d".repeat(40), curseFingerprint: 4 }] }]
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const created = await fetch(`${base}/api/staging`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ descriptors: [{ fileName: "teste.jar" }], author: "Teste" })
  });
  assert.equal(created.status, 201);
  const stage = (await created.json()).records[0];

  const promoted = await fetch(`${base}/api/staging/${stage.id}/promote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ expectedStorageVersion: stage.storageVersion, author: "Teste" })
  });
  assert.equal(promoted.status, 200);
  assert.equal((await promoted.json()).record.kind, "mod");

  const catalog = await fetch(`${base}/api/analyses/catalog`);
  assert.equal(catalog.status, 200);
  assert.ok(Array.isArray((await catalog.json()).mods));
  const documents = await fetch(`${base}/api/analyses/documents`).then((response) => response.json());
  assert.ok(documents.documents.length > 0);
});
