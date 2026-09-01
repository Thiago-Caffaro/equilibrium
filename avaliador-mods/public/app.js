const DIVISIONS = ["Tecnologia", "Magia", "Aventura", "Comerciantes"];
const STATUS = {
  mods: ["Não avaliado", "Em análise", "Precisa de teste", "Shortlist", "Selecionado", "Rejeitado", "Arquivado"],
  references: ["Não analisada", "Em análise", "Analisada", "Prioridade", "Arquivada"]
};

const COMMON_IDENTIFICATION = [
  { key: "name", label: "Nome", type: "text", required: true, placeholder: "Nome oficial do projeto" },
  { key: "status", label: "Estado da avaliação", type: "status" },
  { key: "evaluator", label: "Responsável principal", type: "text", placeholder: "Quem está conduzindo esta avaliação?" },
  { key: "sourceUrl", label: "Link de referência", type: "url", placeholder: "https://…" },
  { key: "supportedVersions", label: "Versões observadas", type: "tags", placeholder: "Ex.: 1.20.1, 1.21.1" },
  { key: "loaders", label: "Loaders observados", type: "tags", placeholder: "Ex.: NeoForge, Fabric" },
  { key: "tags", label: "Etiquetas", type: "tags", placeholder: "Ex.: automação, boss, worldgen" }
];

const MOD_SECTIONS = [
  {
    title: "Identificação essencial",
    description: "Metadados mínimos para reconhecer e localizar o candidato.",
    fields: [
      ...COMMON_IDENTIFICATION,
      { key: "projectUrl", label: "Link técnico ou documentação", type: "url", placeholder: "Wiki, repositório ou documentação" },
      { key: "divisions", label: "Divisões relacionadas", type: "divisions", full: true }
    ]
  },
  {
    title: "Função e valor único",
    description: "O motivo concreto para este mod existir no Equilibrium.",
    fields: [
      { key: "primaryFunction", label: "Função única no pack", type: "textarea", rows: 4, full: true, placeholder: "Que problema ele resolve que os outros candidatos não cobrem melhor?" },
      { key: "uniqueSystems", label: "Sistemas realmente únicos", type: "textarea", rows: 3, full: true, placeholder: "Quais partes justificam dependências, manutenção e espaço na progressão?" },
      { key: "humanEvidence", label: "Experiência prática e evidências", type: "textarea", rows: 5, full: true, placeholder: "O que vocês observaram jogando, testando ou administrando esse mod?" }
    ]
  },
  {
    title: "Riscos de composição",
    description: "A maior parte dos problemas aparece na combinação entre sistemas.",
    fields: [
      { key: "overlaps", label: "Sobreposições e concorrentes", type: "textarea", rows: 3, full: true, placeholder: "Quais candidatos fazem algo parecido?" },
      { key: "dangerousCombinations", label: "Combinações perigosas", type: "textarea", rows: 4, full: true, placeholder: "Interações que removem escassez, pulam gates ou tornam outra divisão irrelevante" },
      { key: "scarcityImpact", label: "Impacto na escassez", type: "select", options: ["A avaliar", "Preserva", "Controlável", "Risco alto", "Crítico"] },
      { key: "integrationEffort", label: "Esforço de integração", type: "select", options: ["Desconhecido", "Pequeno", "Médio", "Grande", "Muito grande"] },
      { key: "scarcityNotes", label: "Como altera a economia", type: "textarea", rows: 3, full: true, placeholder: "Que limitação desaparece e em qual momento isso seria aceitável?" }
    ]
  },
  {
    title: "Progressão e automação",
    description: "Como o candidato se encaixa em maestria, gates e Automation Follows Mastery.",
    fields: [
      { key: "automationImpact", label: "O que automatiza ou substitui", type: "textarea", rows: 3, full: true },
      { key: "masteryGate", label: "Domínio que deveria vir antes", type: "textarea", rows: 3, full: true },
      { key: "progressionWindow", label: "Janela de progressão proposta", type: "textarea", rows: 3, full: true, placeholder: "Descreva o momento conceitual; não presuma atos ou tiers ainda indefinidos." }
    ]
  },
  {
    title: "Worldgen, multiplayer e desempenho",
    description: "Custos e benefícios observáveis no ambiente real do grupo.",
    fields: [
      { key: "worldgenImpact", label: "Impacto de worldgen", type: "select", options: ["Nenhum", "Leve", "Moderado", "Pesado", "Desconhecido"] },
      { key: "worldgenNotes", label: "Função do worldgen", type: "textarea", rows: 3, full: true },
      { key: "multiplayerNotes", label: "Valor e problemas multiplayer", type: "textarea", rows: 3, full: true },
      { key: "performanceNotes", label: "Desempenho observado", type: "textarea", rows: 3, full: true },
      { key: "rupturePotential", label: "Potencial para rupturas e eventos", type: "textarea", rows: 3, full: true, placeholder: "Bosses, mobs, estruturas, efeitos ou materiais reutilizáveis" }
    ]
  },
  {
    title: "Teste e parecer",
    description: "O que precisa mudar ou ser comprovado antes da decisão.",
    fields: [
      { key: "requiredChanges", label: "Alterações necessárias", type: "textarea", rows: 4, full: true },
      { key: "testNeeds", label: "Testes ainda necessários", type: "textarea", rows: 3, full: true },
      { key: "verdict", label: "Parecer atual", type: "select", options: ["Sem parecer", "Manter na mesa", "Precisa de teste", "Rejeitar", "Selecionar"] },
      { key: "verdictReason", label: "Justificativa do parecer", type: "textarea", rows: 3, full: true },
      { key: "openQuestions", label: "Dúvidas em aberto", type: "textarea", rows: 4, full: true }
    ]
  }
];

const REFERENCE_SECTIONS = [
  {
    title: "Identificação da referência",
    description: "Modpack, lista, repositório ou projeto que vale analisar.",
    fields: [
      ...COMMON_IDENTIFICATION,
      { key: "referenceType", label: "Tipo de referência", type: "select", options: ["Modpack", "Lista de mods", "Repositório", "Documento", "Outro"] }
    ]
  },
  {
    title: "Motivo da análise",
    description: "O que esta fonte pode ensinar sem se transformar em base automática.",
    fields: [
      { key: "whyStudy", label: "Por que estudar esta referência", type: "textarea", rows: 4, full: true },
      { key: "humanEvidence", label: "Experiência do grupo com ela", type: "textarea", rows: 4, full: true },
      { key: "usefulPatterns", label: "Soluções e padrões úteis", type: "textarea", rows: 5, full: true }
    ]
  },
  {
    title: "Progressão e composição",
    description: "Registre a função das soluções, não apenas o que foi copiado pelo pack.",
    fields: [
      { key: "pacingNotes", label: "Pacing e mudanças de fase", type: "textarea", rows: 4, full: true },
      { key: "gateNotes", label: "Gates, receitas e integrações", type: "textarea", rows: 4, full: true },
      { key: "compositionNotes", label: "Composição e sobreposições", type: "textarea", rows: 4, full: true },
      { key: "candidateMods", label: "Mods que merecem ficha própria", type: "tags", full: true }
    ]
  },
  {
    title: "Limites e conclusão",
    description: "Separe inspiração útil daquilo que não combina com o Equilibrium.",
    fields: [
      { key: "avoidPatterns", label: "O que não devemos reproduzir", type: "textarea", rows: 5, full: true },
      { key: "openQuestions", label: "Pontos que exigem investigação", type: "textarea", rows: 4, full: true }
    ]
  }
];

const state = {
  collection: "mods",
  records: [],
  current: null,
  dirty: false,
  saving: false,
  changeVersion: 0,
  autosaveTimer: null,
  conflictCurrent: null,
  documents: [],
  noteSource: "record",
  libraryContent: "",
  pendingImport: null
};

const elements = Object.fromEntries([
  "connectionStatus", "editorName", "transferButton", "transferMenu", "newRecordButton",
  "welcomeNewButton", "searchInput", "statusFilter", "divisionFilter", "refreshButton",
  "recordCount", "recordList", "welcomeState", "editorState", "recordKindLabel", "recordTitle",
  "recordMeta", "saveIndicator", "saveButton", "recordForm", "conflictBanner", "noteSource",
  "notePreview", "noteEditor", "noteTextarea", "noteHint", "saveDocumentButton", "jsonEditor",
  "jsonTextarea", "applyJsonButton", "newDocumentButton", "importFileInput", "importDialog",
  "importFileSummary", "confirmImportButton", "shortcutsButton", "shortcutsDialog", "toastRegion"
].map((id) => [id, document.getElementById(id)]));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function getAuthor() {
  return elements.editorName.value.trim() || "Anônimo";
}

function apiError(message, response, payload) {
  const error = new Error(payload?.error || message);
  error.status = response.status;
  error.payload = payload;
  return error;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw apiError("Falha na comunicação com o servidor.", response, payload);
  return payload;
}

function toast(message, tone = "info", duration = 3200) {
  const item = document.createElement("div");
  item.className = `toast toast--${tone}`;
  item.textContent = message;
  elements.toastRegion.append(item);
  requestAnimationFrame(() => item.classList.add("is-visible"));
  setTimeout(() => {
    item.classList.remove("is-visible");
    setTimeout(() => item.remove(), 180);
  }, duration);
}

function setConnection(online) {
  elements.connectionStatus.textContent = online ? "Servidor local conectado" : "Servidor indisponível";
  elements.connectionStatus.classList.toggle("status-pill--online", online);
  elements.connectionStatus.classList.remove("status-pill--checking");
}

function fieldValue(record, field) {
  const value = record?.[field.key];
  if (field.type === "tags") return Array.isArray(value) ? value.join(", ") : value || "";
  return value ?? "";
}

function renderField(field, record) {
  const value = fieldValue(record, field);
  const required = field.required ? "required" : "";
  const span = field.full ? " field--full" : "";
  const id = `field-${field.key}`;

  if (field.type === "divisions") {
    return `<fieldset class="field division-field${span}" data-field-wrap="${field.key}">
      <legend>${escapeHtml(field.label)}</legend>
      <div class="division-options">
        ${DIVISIONS.map((division) => `<label><input type="checkbox" data-field="${field.key}" value="${division}" ${Array.isArray(value) && value.includes(division) ? "checked" : ""}><span>${division}</span></label>`).join("")}
      </div>
    </fieldset>`;
  }

  if (field.type === "textarea") {
    return `<label class="field${span}" for="${id}"><span>${escapeHtml(field.label)}</span>
      <textarea id="${id}" data-field="${field.key}" rows="${field.rows || 3}" placeholder="${escapeHtml(field.placeholder || "")}" ${required}>${escapeHtml(value)}</textarea>
    </label>`;
  }

  if (field.type === "select" || field.type === "status") {
    const options = field.type === "status" ? STATUS[state.collection] : field.options;
    const selected = value || options[0];
    return `<label class="field${span}" for="${id}"><span>${escapeHtml(field.label)}</span>
      <select id="${id}" data-field="${field.key}">${options.map((option) => `<option ${option === selected ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>
    </label>`;
  }

  return `<label class="field${span}" for="${id}"><span>${escapeHtml(field.label)}</span>
    <input id="${id}" data-field="${field.key}" type="${field.type === "url" ? "url" : "text"}" value="${escapeHtml(value)}" placeholder="${escapeHtml(field.placeholder || "")}" ${required}>
  </label>`;
}

function renderForm() {
  if (!state.current) return;
  const sections = state.collection === "mods" ? MOD_SECTIONS : REFERENCE_SECTIONS;
  elements.recordForm.innerHTML = sections.map((section, index) => `
    <fieldset class="form-section" data-section-index="${index}">
      <legend><span>${index + 1}</span>${escapeHtml(section.title)}</legend>
      <p class="section-description">${escapeHtml(section.description)}</p>
      <div class="form-grid">${section.fields.map((field) => renderField(field, state.current)).join("")}</div>
    </fieldset>
  `).join("");
  updateEditorHeader();
  syncRecordNotes();
  syncJsonEditor();
}

function updateEditorHeader() {
  if (!state.current) return;
  elements.recordKindLabel.textContent = state.collection === "mods" ? "Ficha crítica de mod" : "Análise de referência";
  elements.recordTitle.textContent = state.current.name || "Nova ficha";
  elements.recordMeta.textContent = state.current.id
    ? `Revisão ${state.current.revision} · atualizado ${formatDate(state.current.updatedAt)} por ${state.current.updatedBy || "—"}`
    : "Ainda não salva";
  updateSaveIndicator();
}

function updateSaveIndicator() {
  elements.saveIndicator.classList.toggle("is-dirty", state.dirty);
  elements.saveIndicator.classList.toggle("is-saving", state.saving);
  elements.saveIndicator.lastChild.textContent = state.saving
    ? " Salvando…"
    : state.dirty
      ? " Alterações pendentes"
      : " Salvo";
}

function readForm() {
  if (!state.current) return;
  const next = { ...state.current };
  elements.recordForm.querySelectorAll("[data-field]").forEach((control) => {
    const key = control.dataset.field;
    if (control.type === "checkbox") {
      next[key] = [...elements.recordForm.querySelectorAll(`[data-field="${CSS.escape(key)}"]:checked`)].map((item) => item.value);
    } else {
      next[key] = control.value;
    }
  });
  for (const field of [...COMMON_IDENTIFICATION, { key: "divisions", type: "divisions" }, { key: "candidateMods", type: "tags" }]) {
    if (field.type === "tags" && typeof next[field.key] === "string") {
      next[field.key] = next[field.key].split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  state.current = next;
}

function markDirty({ autosave = true } = {}) {
  state.dirty = true;
  state.changeVersion += 1;
  updateEditorHeader();
  syncJsonEditor();
  clearTimeout(state.autosaveTimer);
  if (autosave) {
    state.autosaveTimer = setTimeout(() => {
      if (state.current?.name?.trim()) void saveRecord({ quiet: true });
    }, 1300);
  }
}

function defaultRecord() {
  const author = getAuthor();
  if (state.collection === "mods") {
    return {
      kind: "mod",
      name: "",
      status: STATUS.mods[0],
      evaluator: author,
      divisions: [],
      supportedVersions: [],
      loaders: [],
      tags: [],
      scarcityImpact: "A avaliar",
      integrationEffort: "Desconhecido",
      worldgenImpact: "Desconhecido",
      verdict: "Sem parecer",
      notesMarkdown: ""
    };
  }
  return {
    kind: "reference",
    name: "",
    status: STATUS.references[0],
    evaluator: author,
    referenceType: "Modpack",
    supportedVersions: [],
    loaders: [],
    tags: [],
    candidateMods: [],
    notesMarkdown: ""
  };
}

function startNewRecord() {
  clearTimeout(state.autosaveTimer);
  state.current = defaultRecord();
  state.dirty = false;
  state.conflictCurrent = null;
  elements.conflictBanner.hidden = true;
  elements.welcomeState.hidden = true;
  elements.editorState.hidden = false;
  renderForm();
  requestAnimationFrame(() => document.getElementById("field-name")?.focus());
}

async function openRecord(id) {
  if (state.dirty && !confirm("Há alterações pendentes. Deseja descartá-las e abrir outra ficha?")) return;
  clearTimeout(state.autosaveTimer);
  try {
    const { record } = await api(`/api/records/${state.collection}/${encodeURIComponent(id)}`);
    state.current = record;
    state.dirty = false;
    state.conflictCurrent = null;
    elements.conflictBanner.hidden = true;
    elements.welcomeState.hidden = true;
    elements.editorState.hidden = false;
    renderForm();
    renderList();
  } catch (error) {
    toast(error.message, "error");
  }
}

function upsertLocalRecord(record) {
  const index = state.records.findIndex((candidate) => candidate.id === record.id);
  if (index >= 0) state.records[index] = record;
  else state.records.unshift(record);
  state.records.sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")));
}

async function saveRecord({ quiet = false, navigateNext = false, forceCopy = false } = {}) {
  if (!state.current || state.saving) return false;
  readForm();
  if (!state.current.name?.trim()) {
    if (!quiet) toast("Informe o nome antes de salvar.", "warning");
    document.getElementById("field-name")?.focus();
    return false;
  }

  state.saving = true;
  const savedVersion = state.changeVersion;
  updateSaveIndicator();
  try {
    const isNew = !state.current.id || forceCopy;
    const source = forceCopy
      ? { ...state.current, id: undefined, revision: undefined, createdAt: undefined, updatedAt: undefined, updatedBy: undefined, name: `${state.current.name} — cópia` }
      : state.current;
    const payload = isNew
      ? await api(`/api/records/${state.collection}`, {
          method: "POST",
          body: JSON.stringify({ record: source, author: getAuthor() })
        })
      : await api(`/api/records/${state.collection}/${encodeURIComponent(state.current.id)}`, {
          method: "PUT",
          body: JSON.stringify({
            record: state.current,
            expectedRevision: state.current.revision,
            author: getAuthor()
          })
        });

    state.current = payload.record;
    upsertLocalRecord(payload.record);
    state.dirty = state.changeVersion !== savedVersion;
    state.conflictCurrent = null;
    elements.conflictBanner.hidden = true;
    renderForm();
    renderList();
    if (!quiet) toast("Ficha salva.", "success");
    if (state.dirty) markDirty();
    if (navigateNext) navigateRecord(1);
    return true;
  } catch (error) {
    if (error.status === 409) {
      state.conflictCurrent = error.payload.current;
      elements.conflictBanner.hidden = false;
      toast("Conflito detectado: outra pessoa salvou esta ficha.", "warning", 5200);
    } else {
      toast(error.message, "error");
    }
    return false;
  } finally {
    state.saving = false;
    updateSaveIndicator();
  }
}

function filteredRecords() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const status = elements.statusFilter.value;
  const division = elements.divisionFilter.value;
  return state.records.filter((record) => {
    if (status && record.status !== status) return false;
    if (division && !(record.divisions || []).includes(division)) return false;
    if (!query) return true;
    return [record.name, record.status, record.primaryFunction, record.whyStudy, ...(record.tags || []), ...(record.divisions || [])]
      .some((value) => String(value || "").toLocaleLowerCase("pt-BR").includes(query));
  });
}

function statusClass(status) {
  const normalised = String(status || "").toLocaleLowerCase("pt-BR");
  if (/selecion|prioridade/.test(normalised)) return "positive";
  if (/rejeit|erro/.test(normalised)) return "negative";
  if (/teste|análise/.test(normalised)) return "warning";
  return "neutral";
}

function renderList() {
  const records = filteredRecords();
  elements.recordCount.textContent = `${records.length} ${records.length === 1 ? "registro" : "registros"}`;
  if (records.length === 0) {
    elements.recordList.innerHTML = `<div class="empty-list"><span class="empty-list__icon">◇</span><strong>Nenhuma ficha encontrada</strong><p>Altere os filtros ou crie um novo registro.</p></div>`;
    return;
  }
  elements.recordList.innerHTML = records.map((record) => `
    <button class="record-list-item ${state.current?.id === record.id ? "is-active" : ""}" type="button" data-record-id="${escapeHtml(record.id)}">
      <span class="record-list-item__top"><strong>${escapeHtml(record.name)}</strong><span class="status-dot status-dot--${statusClass(record.status)}"></span></span>
      <span class="record-list-item__meta">${escapeHtml(record.status || "Sem estado")}${record.divisions?.length ? ` · ${escapeHtml(record.divisions.join(" / "))}` : ""}</span>
      <span class="record-list-item__date">${escapeHtml(formatDate(record.updatedAt))}</span>
    </button>
  `).join("");
}

function refreshFilters() {
  const previous = elements.statusFilter.value;
  elements.statusFilter.innerHTML = `<option value="">Todos os estados</option>${STATUS[state.collection].map((status) => `<option>${escapeHtml(status)}</option>`).join("")}`;
  if (STATUS[state.collection].includes(previous)) elements.statusFilter.value = previous;
  elements.divisionFilter.hidden = state.collection !== "mods";
}

async function loadCollection({ preserveCurrent = false } = {}) {
  try {
    const { records } = await api(`/api/records/${state.collection}`);
    state.records = records;
    refreshFilters();
    renderList();
    setConnection(true);
    if (!preserveCurrent && !state.current) {
      elements.welcomeState.hidden = false;
      elements.editorState.hidden = true;
    }
  } catch (error) {
    setConnection(false);
    toast(error.message, "error");
  }
}

async function switchCollection(collection) {
  if (collection === state.collection) return;
  if (state.dirty && !confirm("Há alterações pendentes. Deseja descartá-las e trocar de coleção?")) return;
  state.collection = collection;
  state.current = null;
  state.dirty = false;
  document.querySelectorAll("[data-collection]").forEach((button) => {
    const active = button.dataset.collection === collection;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.searchInput.value = "";
  elements.welcomeState.hidden = false;
  elements.editorState.hidden = true;
  await loadCollection();
}

function navigateRecord(direction) {
  const records = filteredRecords();
  if (records.length === 0) return;
  const index = records.findIndex((record) => record.id === state.current?.id);
  const nextIndex = index < 0 ? 0 : (index + direction + records.length) % records.length;
  void openRecord(records[nextIndex].id);
}

function inlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return html;
}

function renderMarkdown(source) {
  const lines = String(source || "").replaceAll("\r\n", "\n").split("\n");
  const output = [];
  let list = null;
  let code = false;
  const closeList = () => {
    if (list) output.push(`</${list}>`);
    list = null;
  };
  for (const line of lines) {
    if (line.startsWith("```")) {
      closeList();
      output.push(code ? "</code></pre>" : "<pre><code>");
      code = !code;
      continue;
    }
    if (code) {
      output.push(`${escapeHtml(line)}\n`);
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 2, 6);
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const wanted = unordered ? "ul" : "ol";
      if (list !== wanted) {
        closeList();
        list = wanted;
        output.push(`<${wanted}>`);
      }
      output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
      continue;
    }
    closeList();
    if (line.startsWith("> ")) output.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
    else if (line.trim()) output.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  closeList();
  if (code) output.push("</code></pre>");
  return output.join("\n") || "<p class=\"muted-copy\">Nenhuma observação ainda.</p>";
}

async function loadLibrary() {
  try {
    const { documents } = await api("/api/library");
    state.documents = documents;
    const currentValue = elements.noteSource.value;
    elements.noteSource.innerHTML = `<option value="record">Notas Markdown desta ficha</option>${documents.map((document) => `<option value="library:${escapeHtml(document.name)}">${escapeHtml(document.name)}</option>`).join("")}`;
    if (["record", ...documents.map((document) => `library:${document.name}`)].includes(currentValue)) elements.noteSource.value = currentValue;
  } catch (error) {
    toast(error.message, "error");
  }
}

function syncRecordNotes() {
  if (state.noteSource !== "record") return;
  const content = state.current?.notesMarkdown || "";
  elements.noteTextarea.value = content;
  elements.notePreview.innerHTML = renderMarkdown(content);
  elements.noteHint.textContent = "Markdown salvo junto da ficha.";
}

function syncJsonEditor() {
  elements.jsonTextarea.value = state.current ? JSON.stringify(state.current, null, 2) : "{}";
}

async function changeNoteSource(value) {
  state.noteSource = value;
  if (value === "record") {
    syncRecordNotes();
    return;
  }
  const name = value.replace(/^library:/, "");
  try {
    const payload = await api(`/api/library/${encodeURIComponent(name)}`);
    state.libraryContent = payload.content;
    elements.noteTextarea.value = payload.content;
    elements.noteHint.textContent = name.endsWith(".json") ? "JSON validado ao salvar." : "Arquivo Markdown compartilhado.";
    elements.notePreview.innerHTML = name.endsWith(".json")
      ? `<pre><code>${escapeHtml(payload.content)}</code></pre>`
      : renderMarkdown(payload.content);
  } catch (error) {
    toast(error.message, "error");
  }
}

function activateNoteTab(tab) {
  document.querySelectorAll("[data-note-tab]").forEach((button) => {
    const active = button.dataset.noteTab === tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.notePreview.hidden = tab !== "preview";
  elements.noteEditor.hidden = tab !== "edit";
  elements.jsonEditor.hidden = tab !== "json";
  if (tab === "json") syncJsonEditor();
}

async function saveSideDocument() {
  if (state.noteSource === "record") {
    if (!state.current) {
      toast("Abra uma ficha para salvar notas nela.", "warning");
      return;
    }
    state.current.notesMarkdown = elements.noteTextarea.value;
    markDirty({ autosave: false });
    await saveRecord();
    elements.notePreview.innerHTML = renderMarkdown(elements.noteTextarea.value);
    return;
  }
  const name = state.noteSource.replace(/^library:/, "");
  try {
    await api(`/api/library/${encodeURIComponent(name)}`, {
      method: "PUT",
      body: JSON.stringify({ content: elements.noteTextarea.value })
    });
    state.libraryContent = elements.noteTextarea.value;
    elements.notePreview.innerHTML = name.endsWith(".json")
      ? `<pre><code>${escapeHtml(state.libraryContent)}</code></pre>`
      : renderMarkdown(state.libraryContent);
    toast("Arquivo compartilhado salvo.", "success");
  } catch (error) {
    toast(error.message, "error");
  }
}

async function createDocument() {
  const name = prompt("Nome do novo arquivo (termine em .md ou .json):", "observacoes.md");
  if (!name) return;
  const initial = name.endsWith(".json") ? "{}\n" : `# ${name.replace(/\.md$/i, "")}\n\n`;
  try {
    await api(`/api/library/${encodeURIComponent(name)}`, {
      method: "PUT",
      body: JSON.stringify({ content: initial })
    });
    await loadLibrary();
    elements.noteSource.value = `library:${name}`;
    await changeNoteSource(`library:${name}`);
    activateNoteTab("edit");
    elements.noteTextarea.focus();
  } catch (error) {
    toast(error.message, "error");
  }
}

function applyRawJson() {
  if (!state.current) return;
  try {
    const parsed = JSON.parse(elements.jsonTextarea.value);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("A ficha precisa ser um objeto JSON.");
    state.current = {
      ...parsed,
      id: state.current.id,
      kind: state.current.kind,
      revision: state.current.revision,
      createdAt: state.current.createdAt,
      updatedAt: state.current.updatedAt,
      updatedBy: state.current.updatedBy
    };
    renderForm();
    markDirty();
    toast("JSON aplicado ao formulário. Salve para persistir.", "success");
  } catch (error) {
    toast(`JSON inválido: ${error.message}`, "error", 5000);
  }
}

function exportCollection(format) {
  window.location.href = `/api/export/${state.collection}.${format}`;
  elements.transferMenu.hidden = true;
}

async function handleImportFile(file) {
  if (!file) return;
  const format = file.name.toLocaleLowerCase().endsWith(".csv") ? "csv" : "json";
  try {
    const content = await file.text();
    state.pendingImport = { format, content, fileName: file.name };
    elements.importFileSummary.textContent = `${file.name} será importado em ${state.collection === "mods" ? "Mods" : "Referências"}.`;
    elements.importDialog.showModal();
  } catch {
    toast("Não foi possível ler o arquivo.", "error");
  } finally {
    elements.importFileInput.value = "";
  }
}

async function confirmImport() {
  if (!state.pendingImport) return;
  const mode = elements.importDialog.querySelector('[name="importMode"]:checked')?.value || "skip";
  elements.confirmImportButton.disabled = true;
  try {
    const { result } = await api(`/api/import/${state.collection}`, {
      method: "POST",
      body: JSON.stringify({ ...state.pendingImport, mode, author: getAuthor() })
    });
    elements.importDialog.close();
    state.pendingImport = null;
    await loadCollection({ preserveCurrent: true });
    const summary = `${result.created} criadas, ${result.updated} atualizadas, ${result.skipped} ignoradas`;
    toast(result.errors.length ? `${summary}; ${result.errors.length} erros.` : summary, result.errors.length ? "warning" : "success", 5200);
  } catch (error) {
    toast(error.message, "error", 5200);
  } finally {
    elements.confirmImportButton.disabled = false;
  }
}

function closeMenus(event) {
  if (!event.target.closest(".menu-wrap")) elements.transferMenu.hidden = true;
}

elements.recordForm.addEventListener("input", (event) => {
  if (!event.target.matches("[data-field]")) return;
  readForm();
  markDirty();
});
elements.recordForm.addEventListener("change", (event) => {
  if (!event.target.matches("[data-field]")) return;
  readForm();
  markDirty();
});
elements.recordList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-record-id]");
  if (button) void openRecord(button.dataset.recordId);
});
document.querySelectorAll("[data-collection]").forEach((button) => button.addEventListener("click", () => void switchCollection(button.dataset.collection)));
elements.newRecordButton.addEventListener("click", startNewRecord);
elements.welcomeNewButton.addEventListener("click", startNewRecord);
elements.saveButton.addEventListener("click", () => void saveRecord());
elements.refreshButton.addEventListener("click", () => void loadCollection({ preserveCurrent: true }));
elements.searchInput.addEventListener("input", renderList);
elements.statusFilter.addEventListener("change", renderList);
elements.divisionFilter.addEventListener("change", renderList);
elements.editorName.addEventListener("change", () => localStorage.setItem("equilibrium.editorName", elements.editorName.value.trim()));
elements.transferButton.addEventListener("click", () => {
  elements.transferMenu.hidden = !elements.transferMenu.hidden;
  elements.transferButton.setAttribute("aria-expanded", String(!elements.transferMenu.hidden));
});
elements.transferMenu.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "import") elements.importFileInput.click();
  if (action === "export-json") exportCollection("json");
  if (action === "export-csv") exportCollection("csv");
});
elements.importFileInput.addEventListener("change", () => void handleImportFile(elements.importFileInput.files[0]));
elements.confirmImportButton.addEventListener("click", () => void confirmImport());
elements.noteSource.addEventListener("change", () => void changeNoteSource(elements.noteSource.value));
document.querySelectorAll("[data-note-tab]").forEach((button) => button.addEventListener("click", () => activateNoteTab(button.dataset.noteTab)));
elements.noteTextarea.addEventListener("input", () => {
  if (state.noteSource === "record" && state.current) {
    state.current.notesMarkdown = elements.noteTextarea.value;
    elements.notePreview.innerHTML = renderMarkdown(elements.noteTextarea.value);
    markDirty();
  }
});
elements.saveDocumentButton.addEventListener("click", () => void saveSideDocument());
elements.newDocumentButton.addEventListener("click", () => void createDocument());
elements.applyJsonButton.addEventListener("click", applyRawJson);
elements.shortcutsButton.addEventListener("click", () => elements.shortcutsDialog.showModal());
elements.conflictBanner.addEventListener("click", (event) => {
  const action = event.target.dataset.conflict;
  if (action === "reload" && state.conflictCurrent) {
    state.current = state.conflictCurrent;
    state.dirty = false;
    state.conflictCurrent = null;
    elements.conflictBanner.hidden = true;
    renderForm();
    toast("Versão mais recente carregada.", "success");
  }
  if (action === "copy") void saveRecord({ forceCopy: true });
});
document.addEventListener("click", closeMenus);

document.addEventListener("keydown", (event) => {
  const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "s") {
    event.preventDefault();
    void saveRecord();
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "n") {
    event.preventDefault();
    startNewRecord();
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
    event.preventDefault();
    elements.searchInput.focus();
    elements.searchInput.select();
  } else if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    void saveRecord({ navigateNext: true });
  } else if (event.altKey && /^[1-9]$/.test(event.key)) {
    event.preventDefault();
    const section = elements.recordForm.querySelector(`[data-section-index="${Number(event.key) - 1}"]`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    section?.querySelector("input, textarea, select")?.focus({ preventScroll: true });
  } else if (!typing && event.key === "[") {
    event.preventDefault();
    navigateRecord(-1);
  } else if (!typing && event.key === "]") {
    event.preventDefault();
    navigateRecord(1);
  } else if (!typing && event.key === "?") {
    event.preventDefault();
    elements.shortcutsDialog.showModal();
  }
});

window.addEventListener("beforeunload", (event) => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

async function initialise() {
  elements.editorName.value = localStorage.getItem("equilibrium.editorName") || "";
  refreshFilters();
  await Promise.all([loadCollection(), loadLibrary()]);
  activateNoteTab("preview");
  if (state.documents.some((document) => document.name === "criterios.md")) {
    elements.noteSource.value = "library:criterios.md";
    await changeNoteSource("library:criterios.md");
  }
}

void initialise();
