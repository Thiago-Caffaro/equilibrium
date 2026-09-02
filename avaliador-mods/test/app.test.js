import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { MOD_CSV_FIELDS, parseCsv, stringifyCsv } from "../lib/csv.js";
import { ConflictError, createStore } from "../lib/store.js";
import { createAppServer } from "../server.js";

async function temporaryRoot(t) {
  const root = await mkdtemp(join(tmpdir(), "equilibrium-avaliador-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("CSV preserva listas, aspas e observações com várias linhas", () => {
  const records = [{
    id: "mod-12345678",
    name: "Mod, com vírgula",
    divisions: ["Magia", "Aventura"],
    humanEvidence: "Linha 1\nLinha \"2\""
  }];
  const csv = stringifyCsv(records, MOD_CSV_FIELDS);
  const parsed = parseCsv(csv);
  assert.equal(parsed[0].name, records[0].name);
  assert.deepEqual(parsed[0].divisions, records[0].divisions);
  assert.equal(parsed[0].humanEvidence, records[0].humanEvidence);
});

test("store separa salvamentos de revisões humanas e detecta versão interna antiga", async (t) => {
  const dataRoot = await temporaryRoot(t);
  const store = createStore({ dataRoot });
  const created = await store.create("mods", {
    name: "Candidato de teste",
    divisions: ["Tecnologia"],
    primaryFunction: "Validar o armazenamento."
  }, "Avaliador A");

  assert.equal(created.revision, 0);
  assert.equal(created.storageVersion, 1);
  const raw = JSON.parse(await readFile(join(dataRoot, "mods", `${created.id}.json`), "utf8"));
  assert.equal(raw.name, "Candidato de teste");

  const updated = await store.save("mods", created.id, { ...created, status: "Em análise" }, {
    expectedStorageVersion: 1,
    author: "Avaliador B"
  });
  assert.equal(updated.revision, 0);
  assert.equal(updated.storageVersion, 2);
  assert.equal(updated.updatedBy, "Avaliador B");

  const attemptedReviewEdit = await store.save("mods", created.id, {
    ...updated,
    revision: 99,
    reviewedBy: "Não deveria valer"
  }, { expectedStorageVersion: 2, author: "Avaliador B" });
  assert.equal(attemptedReviewEdit.revision, 0);
  assert.equal(attemptedReviewEdit.reviewedBy, undefined);

  await assert.rejects(
    () => store.save("mods", created.id, { ...created, status: "Rejeitado" }, { expectedStorageVersion: 2 }),
    ConflictError
  );

  const reviewed = await store.review("mods", created.id, {
    expectedStorageVersion: 3,
    author: "Revisor"
  });
  assert.equal(reviewed.revision, 1);
  assert.equal(reviewed.storageVersion, 4);
  assert.equal(reviewed.reviewedBy, "Revisor");

  await store.saveDocument("observacoes.md", "# Observações\n");
  assert.equal(await store.getDocument("observacoes.md"), "# Observações\n");
  await assert.rejects(() => store.saveDocument("../fora.md", "não"));
});

test("API executa criação, atualização, conflito, exportação e importação", async (t) => {
  const dataRoot = await temporaryRoot(t);
  const server = createAppServer({ dataRoot });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  const health = await fetch(`${base}/api/health`).then((response) => response.json());
  assert.equal(health.ok, true);

  const createResponse = await fetch(`${base}/api/records/mods`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ record: { name: "Mod de API", divisions: ["Magia"] }, author: "Thiago" })
  });
  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()).record;

  const updateResponse = await fetch(`${base}/api/records/mods/${created.id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ record: { ...created, status: "Shortlist" }, expectedStorageVersion: 1, author: "Amigo" })
  });
  assert.equal(updateResponse.status, 200);
  const updated = (await updateResponse.json()).record;
  assert.equal(updated.revision, 0);
  assert.equal(updated.storageVersion, 2);

  const reviewResponse = await fetch(`${base}/api/records/mods/${created.id}/review`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ expectedStorageVersion: 2, author: "Revisor" })
  });
  assert.equal(reviewResponse.status, 200);
  const reviewed = (await reviewResponse.json()).record;
  assert.equal(reviewed.revision, 1);
  assert.equal(reviewed.storageVersion, 3);

  const conflictResponse = await fetch(`${base}/api/records/mods/${created.id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ record: { ...created, status: "Rejeitado" }, expectedStorageVersion: 1 })
  });
  assert.equal(conflictResponse.status, 409);

  const csvResponse = await fetch(`${base}/api/export/mods.csv`);
  assert.equal(csvResponse.status, 200);
  assert.match(await csvResponse.text(), /Mod de API/);

  const importResponse = await fetch(`${base}/api/import/mods`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      format: "json",
      mode: "skip",
      content: JSON.stringify([{ name: "Importado", divisions: ["Aventura"] }]),
      author: "Importação"
    })
  });
  assert.equal(importResponse.status, 200);
  assert.equal((await importResponse.json()).result.created, 1);

  const records = await fetch(`${base}/api/records/mods`).then((response) => response.json());
  assert.equal(records.records.length, 2);

  const referenceResponse = await fetch(`${base}/api/records/references`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ record: { name: "Referência de API", referenceType: "Modpack" }, author: "Thiago" })
  });
  assert.equal(referenceResponse.status, 201);
  const referenceExport = await fetch(`${base}/api/export/references.json`).then((response) => response.json());
  assert.equal(referenceExport.records[0].name, "Referência de API");

  const documentResponse = await fetch(`${base}/api/library/cola.md`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content: "# Cola\n\nObservação compartilhada.\n" })
  });
  assert.equal(documentResponse.status, 200);
  const document = await fetch(`${base}/api/library/cola.md`).then((response) => response.json());
  assert.match(document.content, /Observação compartilhada/);
});
