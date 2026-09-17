import assert from "node:assert/strict";

const cdpBaseUrl = process.env.MOD_RATER_CDP_URL || "http://127.0.0.1:9334";
const targetUrl = process.env.MOD_RATER_URL || "https://server-tago.tail2ce16b.ts.net/mod-rater";

async function evaluate(page, expression) {
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  try {
    const response = await new Promise((resolve, reject) => {
      socket.addEventListener("message", ({ data }) => {
        const message = JSON.parse(data);
        if (message.id === 1) resolve(message);
      });
      socket.addEventListener("error", reject, { once: true });
      socket.send(JSON.stringify({
        id: 1,
        method: "Runtime.evaluate",
        params: { expression, returnByValue: true, awaitPromise: true }
      }));
    });
    if (response.error || response.result?.exceptionDetails) {
      throw new Error(`CDP evaluation failed: ${JSON.stringify(response.error || response.result.exceptionDetails)}`);
    }
    return response.result.result.value;
  } finally {
    socket.close();
  }
}

const pages = await (await fetch(`${cdpBaseUrl}/json/list`)).json();
const page = pages.find((item) => item.type === "page" && item.url === targetUrl);
assert.ok(page, `Open ${targetUrl} in the CDP browser before running this check.`);

const layout = JSON.parse(await evaluate(page, `JSON.stringify({
  records: document.querySelectorAll('[data-record-id]').length,
  welcomeVisible: !document.getElementById('welcomeState').hidden,
  editorVisible: !document.getElementById('editorState').hidden,
  catalogTableToggle: Boolean(document.getElementById('catalogViewTable'))
})`));

console.log(JSON.stringify(layout));
assert.ok(
  layout.records === 0 || (!layout.welcomeVisible && layout.editorVisible),
  "Records are loaded but the UI still presents the empty first-record state."
);
assert.ok(layout.catalogTableToggle, "The catalog needs a table-view control for dense inventories.");

const table = JSON.parse(await evaluate(page, `JSON.stringify((() => {
  const toggle = document.getElementById('catalogViewTable');
  toggle?.click();
  return {
    selected: toggle?.getAttribute('aria-pressed') === 'true',
    rows: document.querySelectorAll('.catalog-table tbody tr').length,
    viewportHeight: window.innerHeight,
    pageHeight: document.scrollingElement.scrollHeight,
    catalogScrolls: document.querySelector('.catalog-panel').scrollHeight > document.querySelector('.catalog-panel').clientHeight,
    editorScrolls: document.querySelector('.record-panel').scrollHeight > document.querySelector('.record-panel').clientHeight
  };
})())`));
assert.ok(table.selected && table.rows === layout.records, "Table view must contain every visible catalog record.");
assert.ok(table.pageHeight <= table.viewportHeight + 1, "Long catalogs must scroll inside their panels, not extend the entire page.");
assert.ok(table.catalogScrolls && table.editorScrolls, "Catalog and editor panels should independently scroll for large collections.");
console.log(JSON.stringify(table));

const click = JSON.parse(await evaluate(page, `new Promise((resolve) => {
  const buttons = [...document.querySelectorAll('.catalog-table [data-record-id]')];
  const target = buttons.find((button) => !button.closest('tr')?.classList.contains('is-active'));
  const id = target?.dataset.recordId;
  target?.click();
  setTimeout(() => resolve(JSON.stringify({
    requestedId: id,
    activeId: document.querySelector('.catalog-table tr.is-active [data-record-id]')?.dataset.recordId,
    editorVisible: !document.getElementById('editorState').hidden
  })), 350);
})`));
assert.ok(click.requestedId && click.activeId === click.requestedId && click.editorVisible, "Selecting a row in table view must open that exact record.");
console.log(JSON.stringify(click));

const vault = JSON.parse(await evaluate(page, `new Promise((resolve) => {
  document.getElementById('curseForgeVaultButton')?.click();
  setTimeout(() => {
    const dialog = document.getElementById('curseForgeVaultDialog');
    const keyInput = document.getElementById('curseForgeApiKeyInput');
    const passphraseInput = document.getElementById('curseForgeVaultPassphrase');
    const result = {
      open: Boolean(dialog?.open),
      keyIsPassword: keyInput?.type === 'password',
      passphraseIsPassword: passphraseInput?.type === 'password',
      keyStartsEmpty: keyInput?.value === '',
      mentionsEncryptedStorage: document.getElementById('curseForgeVaultState')?.textContent?.includes('Nenhuma chave') === true
    };
    dialog?.close();
    resolve(JSON.stringify(result));
  }, 200);
})`));
assert.ok(vault.open && vault.keyIsPassword && vault.passphraseIsPassword && vault.keyStartsEmpty && vault.mentionsEncryptedStorage, "The credential vault UI must open without revealing or pre-filling a key.");
console.log(JSON.stringify(vault));
