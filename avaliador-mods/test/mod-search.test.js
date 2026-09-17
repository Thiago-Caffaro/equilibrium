import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createRemoteModSearch } from "../lib/mod-search.js";
import { createAppServer } from "../server.js";

async function temporaryRoot(t) {
  const root = await mkdtemp(join(tmpdir(), "equilibrium-remote-search-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("busca as duas fontes, aplica filtros e agrupa somente o mesmo título", async () => {
  const seen = [];
  const search = createRemoteModSearch({
    curseForgeApiKey: "test-key",
    fetchImpl: async (url) => {
      const target = new URL(String(url));
      seen.push(target);
      if (target.hostname === "api.modrinth.com") {
        return new Response(JSON.stringify({ hits: [
          { project_id: "mr-apoth", title: "Apotheosis", slug: "apotheosis", description: "Mod principal", author: "Shadows", versions: ["1.20.1"], categories: ["neoforge"], downloads: 12 },
          { project_id: "mr-addon", title: "Apotheosis Addon", slug: "apotheosis-addon", description: "Addon" }
        ] }), { status: 200 });
      }
      return new Response(JSON.stringify({ data: [{
        id: 313970,
        classId: 6,
        name: "Apotheosis",
        slug: "apotheosis",
        summary: "Mod principal",
        authors: [{ name: "Shadows" }],
        latestFilesIndexes: [{ gameVersion: "1.20.1", modLoader: 6 }],
        links: { websiteUrl: "https://www.curseforge.com/minecraft/mc-mods/apotheosis" }
      }] }), { status: 200 });
    }
  });

  const result = await search.search({ query: "Apotheosis", version: "1.20.1", loader: "neoforge" });
  assert.equal(result.groups.length, 2);
  const main = result.groups.find((group) => group.name === "Apotheosis");
  assert.equal(main.sources.length, 2);
  assert.equal(main.sources[0].provider, "curseforge");
  assert.equal(result.sources.modrinth.state, "ready");
  assert.equal(result.sources.curseforge.state, "ready");
  const modrinth = seen.find((url) => url.hostname === "api.modrinth.com");
  assert.match(modrinth.searchParams.get("facets"), /project_type:mod/);
  assert.match(modrinth.searchParams.get("facets"), /versions:1.20.1/);
  assert.match(modrinth.searchParams.get("facets"), /categories:neoforge/);
  const curseForge = seen.find((url) => url.hostname === "api.curseforge.com");
  assert.equal(curseForge.searchParams.get("classId"), "6");
  assert.equal(curseForge.searchParams.get("gameVersion"), "1.20.1");
  assert.equal(curseForge.searchParams.get("modLoaderType"), "6");
});

test("cacheia consultas, atualiza sob demanda e tolera falha parcial", async () => {
  let modrinthCalls = 0;
  let curseForgeCalls = 0;
  const search = createRemoteModSearch({
    curseForgeApiKey: "test-key",
    fetchImpl: async (url) => {
      if (String(url).includes("api.modrinth.com")) {
        modrinthCalls += 1;
        return new Response(JSON.stringify({ hits: [{ project_id: "mr", title: "Produto", slug: "produto" }] }), { status: 200 });
      }
      curseForgeCalls += 1;
      return new Response("", { status: 401 });
    }
  });
  const first = await search.search({ query: "Produto" });
  const second = await search.search({ query: "Produto" });
  assert.equal(first.groups.length, 1);
  assert.equal(first.sources.curseforge.upstreamStatus, 401);
  assert.equal(second.cached, true);
  assert.equal(modrinthCalls, 1);
  assert.equal(curseForgeCalls, 1);
  await search.search({ query: "Produto", refresh: true });
  assert.equal(modrinthCalls, 2);
  assert.equal(curseForgeCalls, 2);
});

test("lê a credencial do provedor no momento da consulta", async () => {
  let currentKey = "";
  const headers = [];
  const search = createRemoteModSearch({
    curseForgeApiKeyProvider: () => currentKey,
    fetchImpl: async (_url, options) => {
      headers.push(options.headers["x-api-key"]);
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }
  });

  const locked = await search.search({ query: "Apotheosis", source: "curseforge" });
  assert.equal(locked.sources.curseforge.state, "error");
  assert.equal(headers.length, 0);

  currentKey = "chave-do-cofre";
  search.clearCache();
  const unlocked = await search.search({ query: "Apotheosis", source: "curseforge" });
  assert.equal(unlocked.sources.curseforge.state, "ready");
  assert.deepEqual(headers, ["chave-do-cofre"]);
});

test("API de busca sinaliza existentes e staging remoto bloqueia duplicatas", async (t) => {
  const remoteSearch = {
    async search() {
      return {
        query: {},
        sources: { curseforge: { provider: "CurseForge", state: "ready" }, modrinth: { provider: "Modrinth", state: "ready" } },
        groups: [{
          id: "remote-cf-1",
          name: "Candidato remoto",
          sources: [
            { provider: "curseforge", projectId: "1", name: "Candidato remoto", slug: "candidato", sourceUrl: "https://www.curseforge.com/minecraft/mc-mods/candidato", summary: "Resumo", authors: ["Autor"], supportedVersions: ["1.20.1"], loaders: ["Forge"], categories: ["Magic"], downloads: 10 },
            { provider: "modrinth", projectId: "mr-1", name: "Candidato remoto", slug: "candidato", sourceUrl: "https://modrinth.com/mod/candidato", summary: "Resumo", authors: ["Autor"], supportedVersions: ["1.20.1"], loaders: ["Forge"], categories: ["Magic"], downloads: 12 }
          ]
        }]
      };
    }
  };
  const server = createAppServer({ dataRoot: await temporaryRoot(t), remoteSearch });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;

  const listed = await fetch(`${base}/api/search/mods?query=candidato`).then((response) => response.json());
  assert.equal(listed.groups[0].existing, null);
  const create = await fetch(`${base}/api/staging/from-search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ selections: listed.groups, author: "Teste" })
  });
  assert.equal(create.status, 201);
  const created = await create.json();
  assert.equal(created.created.length, 1);
  assert.equal(created.created[0].stagingOrigin, "remote-search");
  assert.equal(created.created[0].officialProvider, "CurseForge");
  assert.equal(created.created[0].officialSources.length, 2);

  const duplicate = await fetch(`${base}/api/staging/from-search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ selections: listed.groups, author: "Teste" })
  }).then((response) => response.json());
  assert.equal(duplicate.created.length, 0);
  assert.equal(duplicate.duplicates.length, 1);

  const listedAgain = await fetch(`${base}/api/search/mods?query=candidato`).then((response) => response.json());
  assert.equal(listedAgain.groups[0].existing.collection, "staging");
});
