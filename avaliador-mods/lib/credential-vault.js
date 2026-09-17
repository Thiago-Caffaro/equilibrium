import { createCipheriv, createDecipheriv, randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { ValidationError } from "./store.js";

const scrypt = promisify(scryptCallback);
const VAULT_VERSION = 1;
const KDF_OPTIONS = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export class CredentialVaultError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = "CredentialVaultError";
  }
}

function clean(value) {
  return String(value || "").trim();
}

function requirePassphrase(value, label = "senha do cofre") {
  const passphrase = String(value || "");
  if (passphrase.length < 12 || passphrase.length > 1024) {
    throw new CredentialVaultError(`Informe uma ${label} com 12 a 1024 caracteres.`);
  }
  return passphrase;
}

function requireApiKey(value) {
  const apiKey = clean(value);
  if (apiKey.length < 12 || apiKey.length > 4096) {
    throw new CredentialVaultError("Informe uma chave do CurseForge válida.");
  }
  return apiKey;
}

function fromBase64(value, field) {
  const encoded = String(value || "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) || encoded.length % 4 !== 0) {
    throw new CredentialVaultError(`O cofre salvo possui ${field} inválido.`);
  }
  return Buffer.from(encoded, "base64");
}

function validateRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || value.version !== VAULT_VERSION || value.algorithm !== "aes-256-gcm") {
    throw new CredentialVaultError("O formato do cofre salvo não é compatível.");
  }
  const salt = fromBase64(value.salt, "salt");
  const iv = fromBase64(value.iv, "vetor de inicialização");
  const authTag = fromBase64(value.authTag, "autenticador");
  const ciphertext = fromBase64(value.ciphertext, "conteúdo cifrado");
  if (salt.length < 16 || iv.length !== 12 || authTag.length !== 16 || ciphertext.length === 0) {
    throw new CredentialVaultError("O cofre salvo está incompleto ou foi corrompido.");
  }
  return { salt, iv, authTag, ciphertext };
}

async function deriveKey(passphrase, salt) {
  return scrypt(passphrase, salt, 32, KDF_OPTIONS);
}

async function encrypt(apiKey, passphrase) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveKey(passphrase, salt);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify({ apiKey }), "utf8"), cipher.final()]);
  return {
    version: VAULT_VERSION,
    algorithm: "aes-256-gcm",
    kdf: { name: "scrypt", ...KDF_OPTIONS },
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    updatedAt: new Date().toISOString()
  };
}

async function decrypt(record, passphrase) {
  const { salt, iv, authTag, ciphertext } = validateRecord(record);
  try {
    const key = await deriveKey(passphrase, salt);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const content = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
    const apiKey = requireApiKey(JSON.parse(content)?.apiKey);
    return apiKey;
  } catch (error) {
    if (error instanceof CredentialVaultError) throw error;
    throw new CredentialVaultError("A senha do cofre está incorreta ou o arquivo foi alterado.");
  }
}

async function atomicWrite(path, value) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, path);
}

export function createCredentialVault({ dataRoot }) {
  const settingsRoot = join(dataRoot, "settings");
  const vaultPath = join(settingsRoot, "curseforge-vault.json");
  let unlockedApiKey = "";
  let queue = Promise.resolve();

  function exclusively(task) {
    const pending = queue.then(task, task);
    queue = pending.catch(() => undefined);
    return pending;
  }

  async function readRecord() {
    try {
      return JSON.parse(await readFile(vaultPath, "utf8"));
    } catch (error) {
      if (error?.code === "ENOENT") return null;
      if (error instanceof SyntaxError) throw new CredentialVaultError("O arquivo do cofre não contém JSON válido.");
      throw error;
    }
  }

  async function status() {
    const record = await readRecord();
    if (record) validateRecord(record);
    return { configured: Boolean(record), unlocked: Boolean(unlockedApiKey), storage: "encrypted-vault" };
  }

  return {
    apiKey: () => unlockedApiKey,
    status,
    lock: () => exclusively(async () => {
      unlockedApiKey = "";
      return status();
    }),
    unlock: (vaultPassphrase) => exclusively(async () => {
      const record = await readRecord();
      if (!record) throw new CredentialVaultError("Nenhuma chave do CurseForge foi salva neste cofre.");
      unlockedApiKey = await decrypt(record, requirePassphrase(vaultPassphrase));
      return status();
    }),
    configure: ({ apiKey, vaultPassphrase, currentVaultPassphrase }) => exclusively(async () => {
      const existing = await readRecord();
      if (existing) {
        await decrypt(existing, requirePassphrase(currentVaultPassphrase, "senha atual do cofre"));
      }
      const nextApiKey = requireApiKey(apiKey);
      const nextPassphrase = requirePassphrase(vaultPassphrase);
      const encrypted = await encrypt(nextApiKey, nextPassphrase);
      await mkdir(settingsRoot, { recursive: true });
      await atomicWrite(vaultPath, encrypted);
      unlockedApiKey = nextApiKey;
      return status();
    })
  };
}
