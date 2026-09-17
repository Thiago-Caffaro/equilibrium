import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CredentialVaultError, createCredentialVault } from "../lib/credential-vault.js";
import { createAppServer } from "../server.js";

async function temporaryRoot(t) {
  const root = await mkdtemp(join(tmpdir(), "equilibrium-vault-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("cifra a chave no volume e exige a senha atual para substituí-la", async (t) => {
  const dataRoot = await temporaryRoot(t);
  const passphrase = "uma senha longa do cofre";
  const secret = "chave-de-teste-que-nunca-vai-para-o-json";
  const vault = createCredentialVault({ dataRoot });

  assert.deepEqual(await vault.status(), { configured: false, unlocked: false, storage: "encrypted-vault" });
  await vault.configure({ apiKey: secret, vaultPassphrase: passphrase });
  assert.equal(vault.apiKey(), secret);
  assert.deepEqual(await vault.status(), { configured: true, unlocked: true, storage: "encrypted-vault" });

  const persisted = await readFile(join(dataRoot, "settings", "curseforge-vault.json"), "utf8");
  assert.equal(persisted.includes(secret), false);
  assert.equal(persisted.includes(passphrase), false);

  const restarted = createCredentialVault({ dataRoot });
  assert.deepEqual(await restarted.status(), { configured: true, unlocked: false, storage: "encrypted-vault" });
  await assert.rejects(() => restarted.unlock("senha errada"), CredentialVaultError);
  await restarted.unlock(passphrase);
  assert.equal(restarted.apiKey(), secret);

  await assert.rejects(
    () => restarted.configure({ apiKey: "nova-chave-de-teste", vaultPassphrase: passphrase }),
    CredentialVaultError
  );
  await restarted.configure({
    apiKey: "nova-chave-de-teste",
    vaultPassphrase: "uma nova senha longa do cofre",
    currentVaultPassphrase: passphrase
  });
  assert.equal(restarted.apiKey(), "nova-chave-de-teste");
});

test("a API configura, bloqueia e desbloqueia o cofre sem devolver a chave", async (t) => {
  const dataRoot = await temporaryRoot(t);
  const server = createAppServer({ dataRoot });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;

  const initial = await fetch(`${base}/api/health`).then((response) => response.json());
  assert.deepEqual(initial.curseForge, { configured: false, unlocked: false, storage: "encrypted-vault" });

  const saved = await fetch(`${base}/api/integrations/curseforge`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ apiKey: "chave-de-teste-da-interface", vaultPassphrase: "uma senha longa do cofre" })
  });
  assert.equal(saved.status, 200);
  assert.deepEqual((await saved.json()).curseForge, { configured: true, unlocked: true, storage: "encrypted-vault" });

  const locked = await fetch(`${base}/api/integrations/curseforge/lock`, { method: "POST" }).then((response) => response.json());
  assert.deepEqual(locked.curseForge, { configured: true, unlocked: false, storage: "encrypted-vault" });

  const unlocked = await fetch(`${base}/api/integrations/curseforge/unlock`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ vaultPassphrase: "uma senha longa do cofre" })
  }).then((response) => response.json());
  assert.deepEqual(unlocked.curseForge, { configured: true, unlocked: true, storage: "encrypted-vault" });
});
