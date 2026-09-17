import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("publica uma imagem identificável para o branch de entrega sem substituir latest", async () => {
  const workflow = (await readFile(join(root, ".github", "workflows", "publish-container.yml"), "utf8")).replaceAll("\r\n", "\n");
  assert.match(workflow, /branches:\s*\n\s*- main\s*\n\s*- codex\/merchant-core-foundation/);
  assert.match(workflow, /IMAGE_TAG:\s*\$\{\{ github\.ref == 'refs\/heads\/main' && 'latest' \|\| 'merchant-core-foundation' \}\}/);
  assert.match(workflow, /\$\{\{ env\.IMAGE_NAME \}\}:\$\{\{ env\.IMAGE_TAG \}\}/);
  assert.match(workflow, /\$\{\{ env\.IMAGE_NAME \}\}:\$\{\{ github\.sha \}\}/);
});
