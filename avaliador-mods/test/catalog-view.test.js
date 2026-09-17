import assert from "node:assert/strict";
import test from "node:test";
import { initialRecordId, normalizeCatalogView } from "../public/catalog-view.js";

test("o catálogo usa tabela como visualização inicial e preserva uma escolha explícita", () => {
  assert.equal(normalizeCatalogView(), "table");
  assert.equal(normalizeCatalogView("cards"), "cards");
  assert.equal(normalizeCatalogView("valor-inválido"), "table");
});

test("a primeira ficha disponível é aberta quando ainda não há ficha atual", () => {
  const records = [{ id: "mais-recente" }, { id: "anterior" }];
  assert.equal(initialRecordId(records), "mais-recente");
  assert.equal(initialRecordId(records, "anterior"), "anterior");
  assert.equal(initialRecordId(records, "removida"), "mais-recente");
  assert.equal(initialRecordId([]), null);
});
