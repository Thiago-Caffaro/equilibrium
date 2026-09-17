import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { MetadataLookupError, parseProjectUrl, resolveProjectMetadata } from "../lib/project-metadata.js";
import { createAppServer } from "../server.js";

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" }
  });
}

test("reconhece links de projeto e remove sintaxe Markdown acidental", () => {
  assert.deepEqual(parseProjectUrl("https://modrinth.com/mod/exemplo"), {
    provider: "modrinth",
    slug: "exemplo",
    canonicalUrl: "https://modrinth.com/mod/exemplo"
  });
  assert.equal(
    parseProjectUrl("[fonte](https://www.curseforge.com/minecraft/mc-mods/exemplo)").provider,
    "curseforge"
  );
  assert.throws(() => parseProjectUrl("https://example.com/mod/teste"), MetadataLookupError);
});

test("normaliza metadados factuais do Modrinth", async () => {
  const fetchImpl = async (url) => {
    if (String(url).includes("/team/")) {
      return jsonResponse([{ user: { username: "Autora" } }]);
    }
    return jsonResponse({
      id: "A1B2C3D4",
      slug: "mod-exemplo",
      title: "Mod Exemplo",
      description: "Resumo publicado.",
      team: "TEAM1234",
      game_versions: ["1.20.1", "1.21.1"],
      loaders: ["fabric", "neoforge"],
      categories: ["adventure"],
      additional_categories: ["utility"],
      client_side: "required",
      server_side: "optional",
      license: { id: "MIT", name: "MIT License" },
      source_url: "https://github.com/example/mod",
      icon_url: "https://cdn.modrinth.com/icon.png",
      published: "2025-01-01T00:00:00Z",
      updated: "2026-01-01T00:00:00Z",
      downloads: 1200
    });
  };

  const metadata = await resolveProjectMetadata("https://modrinth.com/mod/mod-exemplo", { fetchImpl });
  assert.equal(metadata.provider, "Modrinth");
  assert.equal(metadata.name, "Mod Exemplo");
  assert.deepEqual(metadata.authors, ["Autora"]);
  assert.deepEqual(metadata.loaders, ["Fabric", "NeoForge"]);
  assert.deepEqual(metadata.supportedVersions, ["1.20.1", "1.21.1"]);
  assert.equal(metadata.license, "MIT License");
});

test("CurseForge exige chave e normaliza dados da API oficial", async () => {
  await assert.rejects(
    () => resolveProjectMetadata("https://www.curseforge.com/minecraft/mc-mods/mod-exemplo", {
      fetchImpl: async () => jsonResponse({}),
      curseForgeApiKey: ""
    }),
    (error) => error.code === "CURSEFORGE_VAULT_LOCKED" && error.statusCode === 424
  );

  const fetchImpl = async (url, options) => {
    assert.equal(options.headers["x-api-key"], "segredo-de-teste");
    const target = String(url);
    if (target.includes("/mods/search")) {
      return jsonResponse({ data: [{ id: 321, slug: "mod-exemplo", name: "Mod Exemplo" }] });
    }
    if (target.includes("/files")) {
      return jsonResponse({ data: [{ gameVersions: ["1.20.1", "Forge", "Client"] }] });
    }
    return jsonResponse({
      data: {
        id: 321,
        name: "Mod Exemplo",
        slug: "mod-exemplo",
        summary: "Resumo do CurseForge.",
        links: {
          websiteUrl: "https://www.curseforge.com/minecraft/mc-mods/mod-exemplo",
          sourceUrl: "https://github.com/example/mod"
        },
        authors: [{ name: "Autor" }],
        categories: [{ name: "Utility & QoL" }],
        latestFilesIndexes: [{ gameVersion: "1.21.1", modLoader: 6 }],
        dateCreated: "2025-01-01T00:00:00Z",
        dateModified: "2026-01-01T00:00:00Z",
        downloadCount: 900
      }
    });
  };

  const metadata = await resolveProjectMetadata("https://www.curseforge.com/minecraft/mc-mods/mod-exemplo", {
    fetchImpl,
    curseForgeApiKey: "segredo-de-teste"
  });
  assert.equal(metadata.provider, "CurseForge");
  assert.deepEqual(metadata.loaders, ["Forge", "NeoForge"]);
  assert.deepEqual(metadata.supportedVersions, ["1.20.1", "1.21.1"]);
  assert.deepEqual(metadata.categories, ["Utility & QoL"]);
});

test("endpoint de metadados mantém a consulta no servidor", async (t) => {
  const dataRoot = await mkdtemp(join(tmpdir(), "equilibrium-metadata-"));
  t.after(() => rm(dataRoot, { recursive: true, force: true }));
  const metadataResolver = async (url) => ({
    provider: "Teste",
    sourceUrl: url,
    name: "Projeto consultado",
    supportedVersions: ["1.21.1"],
    loaders: ["NeoForge"],
    categories: []
  });
  const server = createAppServer({ dataRoot, metadataResolver });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();

  const response = await fetch(`http://127.0.0.1:${address.port}/api/metadata`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: "https://modrinth.com/mod/teste" })
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.metadata.name, "Projeto consultado");
});
