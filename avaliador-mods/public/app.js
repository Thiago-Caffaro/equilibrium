const DIVISIONS = ["Tecnologia", "Magia", "Aventura", "Comerciantes"];
const STATUS = {
  mods: ["Não avaliado", "Em análise", "Precisa de teste", "Shortlist", "Selecionado", "Rejeitado", "Arquivado"],
  staging: ["Não avaliado", "Em análise", "Precisa de teste", "Shortlist", "Selecionado", "Rejeitado", "Arquivado"],
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

const sourceUrlField = COMMON_IDENTIFICATION.find((field) => field.key === "sourceUrl");
sourceUrlField.metadataLookup = true;

const OFFICIAL_METADATA_SECTION = {
  title: "Metadados oficiais",
  description: "Fatos importados da fonte indicada. Estes campos não substituem a avaliação humana.",
  fields: [
    { key: "officialSummary", label: "Resumo oficial", type: "textarea", rows: 3, full: true },
    { key: "officialAuthors", label: "Autores", type: "tags", placeholder: "Importado da fonte" },
    { key: "officialProjectId", label: "ID do projeto", type: "text" },
    { key: "officialCategories", label: "Categorias oficiais", type: "tags", placeholder: "Categorias declaradas na plataforma" },
    { key: "officialEnvironment", label: "Ambiente declarado", type: "tags", placeholder: "Cliente, servidor ou ambos" },
    { key: "officialLicense", label: "Licença", type: "text" },
    { key: "officialProvider", label: "Fonte dos metadados", type: "text" },
    { key: "officialPublishedAt", label: "Publicado em", type: "text" },
    { key: "officialUpdatedAt", label: "Atualizado em", type: "text" },
    { key: "officialDownloads", label: "Downloads informados", type: "text" },
    { key: "officialIconUrl", label: "Ícone oficial", type: "url", full: true }
  ]
};

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

MOD_SECTIONS.splice(1, 0, OFFICIAL_METADATA_SECTION);

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
  pendingImport: null,
  metadataLoading: false,
  scanning: false,
  hoveredFieldKey: "",
  analysisCatalog: null,
  analysisDocuments: [],
  analysisVisible: false,
  scanCancelled: false,
  scanWorker: null,
  selectedRecordIds: new Set()
};

const elements = Object.fromEntries([
  "connectionStatus", "editorName", "transferButton", "transferMenu", "newRecordButton",
  "welcomeNewButton", "searchInput", "statusFilter", "divisionFilter", "refreshButton",
  "recordCount", "recordList", "welcomeState", "editorState", "recordKindLabel", "recordTitle",
  "recordMeta", "saveIndicator", "reviewButton", "saveButton", "deleteButton", "promoteButton", "recordForm", "conflictBanner", "noteSource",
  "notePreview", "noteEditor", "noteTextarea", "noteHint", "saveDocumentButton", "jsonEditor",
  "jsonTextarea", "applyJsonButton", "newDocumentButton", "importFileInput", "importDialog",
  "importFileSummary", "confirmImportButton", "shortcutsButton", "shortcutsDialog", "toastRegion", "analysesButton",
  "analysisState", "analysisSearch", "analysisCategory", "analysisPresence", "copyAnalysisButton", "analysisStats", "analysisHead", "analysisRows", "analysisDocumentLinks", "analysisDocumentPreview",
  "scanFolderButton", "jarDirectoryInput", "jarFilesInput", "selectVisibleButton", "bulkDeleteButton"
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

function canLookupMetadata(value) {
  return /(?:https?:\/\/)?(?:www\.)?(?:modrinth\.com|curseforge\.com)\//i.test(String(value || ""));
}

function fieldAcceptsNotApplicable(field) {
  return !field.required && field.key !== "status";
}

function fieldIsNotApplicable(record, field) {
  return Array.isArray(record?.notApplicableFields) && record.notApplicableFields.includes(field.key);
}

function fieldHasMeaningfulValue(record, field) {
  if (fieldIsNotApplicable(record, field)) return false;
  const value = record?.[field.key];
  if (Array.isArray(value)) return value.length > 0;
  if (field.type === "select") return Boolean(value) && value !== field.options?.[0];
  if (field.type === "status") return Boolean(value) && value !== STATUS[state.collection]?.[0];
  return String(value || "").trim().length > 0;
}

function renderNotApplicableToggle(field, record) {
  if (!fieldAcceptsNotApplicable(field)) return "";
  const active = fieldIsNotApplicable(record, field);
  return `<button class="field-na-toggle${active ? " is-active" : ""}" type="button" data-na-field="${field.key}" aria-pressed="${active}" title="${active ? "Voltar a preencher este campo" : "Marcar este campo como não aplicável"}">
    ${active ? "Não aplicável ✓" : "Não aplicável"}
  </button>`;
}

function renderField(field, record) {
  const value = fieldValue(record, field);
  const required = field.required ? "required" : "";
  const span = field.full ? " field--full" : "";
  const id = `field-${field.key}`;
  const notApplicable = fieldIsNotApplicable(record, field);
  const disabled = notApplicable ? "disabled" : "";
  const naClass = notApplicable ? " field--not-applicable" : "";
  const filledClass = fieldHasMeaningfulValue(record, field) ? " field--filled" : "";
  const toggle = renderNotApplicableToggle(field, record);

  if (field.type === "divisions") {
    return `<fieldset class="field division-field${span}${naClass}${filledClass}" data-field-wrap="${field.key}" aria-labelledby="${id}-label">
      <div class="field__header"><span id="${id}-label">${escapeHtml(field.label)}</span>${toggle}</div>
      <div class="division-options">
        ${DIVISIONS.map((division) => `<label><input type="checkbox" data-field="${field.key}" value="${division}" ${Array.isArray(value) && value.includes(division) ? "checked" : ""} ${disabled}><span>${division}</span></label>`).join("")}
      </div>
    </fieldset>`;
  }

  if (field.type === "textarea") {
    return `<div class="field${span}${naClass}${filledClass}" data-field-wrap="${field.key}">
      <div class="field__header"><label for="${id}">${escapeHtml(field.label)}</label>${toggle}</div>
      <textarea id="${id}" data-field="${field.key}" rows="${field.rows || 3}" placeholder="${escapeHtml(field.placeholder || "")}" ${required} ${disabled}>${escapeHtml(value)}</textarea>
    </div>`;
  }

  if (field.type === "select" || field.type === "status") {
    const options = field.type === "status" ? STATUS[state.collection] : field.options;
    const selected = value || options[0];
    return `<div class="field${span}${naClass}${filledClass}" data-field-wrap="${field.key}">
      <div class="field__header"><label for="${id}">${escapeHtml(field.label)}</label>${toggle}</div>
      <select id="${id}" data-field="${field.key}" ${disabled}>${options.map((option) => `<option ${option === selected ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>
    </div>`;
  }

  const metadataAction = field.metadataLookup && (state.collection === "mods" || state.collection === "staging")
    ? `<button class="metadata-lookup-button" type="button" data-metadata-lookup ${state.metadataLoading || notApplicable ? "disabled" : ""}>${state.metadataLoading ? "Buscandoâ€¦" : "Buscar dados"}</button>`
    : "";
  const metadataNote = field.metadataLookup && (state.collection === "mods" || state.collection === "staging") && record.metadataFetchedAt
    ? `<small class="field-note">Sincronizado com ${escapeHtml(record.officialProvider || "a fonte")} em ${escapeHtml(formatDate(record.metadataFetchedAt))}.</small>`
    : "";
  return `<div class="field${span}${naClass}${filledClass}" data-field-wrap="${field.key}">
    <div class="field__header"><label for="${id}">${escapeHtml(field.label)}</label>${toggle}</div>
    <div class="field-control-row"><input id="${id}" data-field="${field.key}" type="${field.type === "url" ? "url" : "text"}" value="${escapeHtml(value)}" placeholder="${escapeHtml(field.placeholder || "")}" ${required} ${disabled}>${metadataAction}</div>
    ${metadataNote}
  </div>`;
}

function renderForm() {
  if (!state.current) return;
  const sections = state.collection === "references" ? REFERENCE_SECTIONS : MOD_SECTIONS;
  elements.recordForm.innerHTML = `${renderStagingPanel(state.current)}${sections.map((section, index) => `
    <fieldset class="form-section" data-section-index="${index}">
      <legend><span>${index + 1}</span>${escapeHtml(section.title)}</legend>
      <p class="section-description">${escapeHtml(section.description)}</p>
      <div class="form-grid">${section.fields.map((field) => renderField(field, state.current)).join("")}</div>
    </fieldset>
  `).join("")}`;
  updateEditorHeader();
  syncRecordNotes();
  syncJsonEditor();
}

function updateEditorHeader() {
  if (!state.current) return;
  elements.recordKindLabel.textContent = state.collection === "staging" ? "Ficha em staging" : state.collection === "mods" ? "Ficha crítica de mod" : "Análise de referência";
  elements.recordTitle.textContent = state.current.name || "Nova ficha";
  elements.recordMeta.textContent = state.current.id
    ? `Revisões confirmadas: ${Number(state.current.revision || 0)} · salvo ${formatDate(state.current.updatedAt)} por ${state.current.updatedBy || "—"}${state.current.reviewedAt ? ` · última revisão ${formatDate(state.current.reviewedAt)} por ${state.current.reviewedBy || "—"}` : ""}`
    : "Ainda não salva";
  elements.reviewButton.disabled = !state.current.id || state.saving || state.collection === "staging";
  elements.deleteButton.disabled = !state.current.id || state.saving;
  elements.promoteButton.hidden = state.collection !== "staging";
  elements.promoteButton.disabled = !state.current.id || state.saving || state.current.stagingResolution === "ambiguous";
  updateSaveIndicator();
}

function updateSaveIndicator() {
  elements.saveIndicator.classList.toggle("is-dirty", state.dirty);
  elements.saveIndicator.classList.toggle("is-saving", state.saving);
  elements.saveButton.disabled = state.saving;
  elements.reviewButton.disabled = !state.current?.id || state.saving || state.collection === "staging";
  elements.deleteButton.disabled = !state.current?.id || state.saving;
  elements.promoteButton.disabled = !state.current?.id || state.saving || state.current?.stagingResolution === "ambiguous";
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
  const sections = state.collection === "references" ? REFERENCE_SECTIONS : MOD_SECTIONS;
  for (const field of sections.flatMap((section) => section.fields)) {
    if (field.type === "tags" && typeof next[field.key] === "string") {
      const separator = field.key === "supportedVersions" ? /[\s,;|]+/ : /[,;|]+/;
      next[field.key] = next[field.key].split(separator).map((item) => item.trim()).filter(Boolean);
    }
  }
  state.current = next;
}

function updateFieldVisual(control) {
  const key = control?.dataset?.field;
  if (!key) return;
  const sections = state.collection === "references" ? REFERENCE_SECTIONS : MOD_SECTIONS;
  const field = sections.flatMap((section) => section.fields).find((candidate) => candidate.key === key);
  const wrapper = control.closest("[data-field-wrap]");
  if (!field || !wrapper) return;
  const controls = [...wrapper.querySelectorAll("[data-field]")];
  const filled = field.type === "divisions"
    ? controls.some((item) => item.checked)
    : field.type === "select"
      ? control.value !== field.options?.[0]
      : field.type === "status"
        ? control.value !== STATUS[state.collection]?.[0]
        : String(control.value || "").trim().length > 0;
  wrapper.classList.toggle("field--filled", filled && !wrapper.classList.contains("field--not-applicable"));
}

function scheduleAutosave() {
  clearTimeout(state.autosaveTimer);
  state.autosaveTimer = setTimeout(() => {
    if (state.current?.name?.trim()) void saveRecord({ quiet: true });
  }, 1300);
}

function markDirty({ autosave = true } = {}) {
  state.dirty = true;
  state.changeVersion += 1;
  updateEditorHeader();
  syncJsonEditor();
  if (autosave) scheduleAutosave();
}

function mergeUnique(left, right) {
  return [...new Set([...(Array.isArray(left) ? left : []), ...(Array.isArray(right) ? right : [])].filter(Boolean))];
}

function factualMetadata(metadata, { mergeVersions = false } = {}) {
  return {
    name: metadata.name || state.current.name,
    sourceUrl: metadata.sourceUrl || state.current.sourceUrl || "",
    projectUrl: metadata.projectUrl || "",
    supportedVersions: mergeVersions ? mergeUnique(state.current.supportedVersions, metadata.supportedVersions) : (metadata.supportedVersions || []),
    loaders: mergeVersions ? mergeUnique(state.current.loaders, metadata.loaders) : (metadata.loaders || []),
    officialSummary: metadata.summary || "",
    officialAuthors: metadata.authors || [],
    officialProjectId: metadata.projectId || "",
    officialCategories: metadata.categories || [],
    officialEnvironment: metadata.environment || [],
    officialLicense: metadata.license || "",
    officialProvider: metadata.provider || "",
    officialPublishedAt: metadata.publishedAt || "",
    officialUpdatedAt: metadata.updatedAt || "",
    officialDownloads: metadata.downloads ?? "",
    officialIconUrl: metadata.iconUrl || "",
    metadataSourceUrl: metadata.sourceUrl || "",
    metadataFetchedAt: metadata.fetchedAt || new Date().toISOString()
  };
}

const METADATA_CACHE_DB = "equilibrium-metadata-cache";
const METADATA_CACHE_STORE = "responses";
const METADATA_CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

function openMetadataCache() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(METADATA_CACHE_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(METADATA_CACHE_STORE, { keyPath: "key" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function metadataCacheGet(key, force = false) {
  if (force || !globalThis.indexedDB) return null;
  try {
    const database = await openMetadataCache();
    const entry = await new Promise((resolve, reject) => {
      const request = database.transaction(METADATA_CACHE_STORE, "readonly").objectStore(METADATA_CACHE_STORE).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return entry && Date.now() - entry.savedAt < METADATA_CACHE_TTL ? entry.metadata : null;
  } catch {
    return null;
  }
}

async function metadataCacheSet(key, metadata) {
  if (!globalThis.indexedDB) return;
  try {
    const database = await openMetadataCache();
    await new Promise((resolve, reject) => {
      const request = database.transaction(METADATA_CACHE_STORE, "readwrite").objectStore(METADATA_CACHE_STORE).put({ key, metadata, savedAt: Date.now() });
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
    database.close();
  } catch {
    // O cache é apenas uma conveniência local; a consulta continua funcionando sem ele.
  }
}

async function providerMetadata(provider, projectId, { force = false } = {}) {
  const key = `${provider}:${projectId}`.toLowerCase();
  const cached = await metadataCacheGet(key, force);
  if (cached) return { metadata: cached, cached: true };
  const { metadata } = await api("/api/metadata", {
    method: "POST",
    body: JSON.stringify({ provider, projectId })
  });
  await metadataCacheSet(key, metadata);
  return { metadata, cached: false };
}

async function lookupOfficialMetadata({ force = false } = {}) {
  if (!state.current || !["mods", "staging"].includes(state.collection) || state.metadataLoading) return;
  readForm();
  const sourceUrl = String(state.current.sourceUrl || "").trim();
  if (!canLookupMetadata(sourceUrl)) {
    if (force) toast("Use um link de mod do Modrinth ou CurseForge.", "warning");
    return;
  }
  if (!force && state.current.metadataSourceUrl === sourceUrl) return;

  state.metadataLoading = true;
  const button = elements.recordForm.querySelector("[data-metadata-lookup]");
  if (button) {
    button.disabled = true;
    button.textContent = "Buscandoâ€¦";
  }

  try {
    const { metadata } = await api("/api/metadata", {
      method: "POST",
      body: JSON.stringify({ url: sourceUrl })
    });
    state.current = { ...state.current, ...factualMetadata(metadata, { mergeVersions: true }) };
    renderForm();
    markDirty();
    toast(`Metadados importados do ${metadata.provider}. Revise antes de marcar a ficha como avaliada.`, "success", 5200);
  } catch (error) {
    toast(error.message, "error", 6200);
  } finally {
    state.metadataLoading = false;
    const currentButton = elements.recordForm.querySelector("[data-metadata-lookup]");
    if (currentButton) {
      currentButton.disabled = false;
      currentButton.textContent = "Buscar dados";
    }
  }
}

function sourceStateLabel(source) {
  if (source?.state === "error") {
    if (source.upstreamStatus === 429) {
      return source.retryAfterSeconds ? `Limite temporário · tente em ${source.retryAfterSeconds}s` : "Limite temporário · tente novamente";
    }
    if (source.upstreamStatus === 400) return "Requisição inválida à fonte (400)";
    if (source.upstreamStatus === 401) return "Credencial da fonte rejeitada (401)";
    if (source.upstreamStatus === 403) return "Credencial sem acesso à fonte (403)";
    if (source.upstreamStatus) return `Erro da fonte (${source.upstreamStatus})`;
    return "Erro temporário na consulta";
  }
  const labels = {
    exact: "Disponível",
    candidate: "1 candidato",
    ambiguous: "Ambíguo",
    missing: "Indisponível",
    unavailable: "Não verificado",
    "not-configured": "Chave ausente"
  };
  return labels[source?.state] || "Não verificado";
}

function renderStagingPanel(record) {
  if (state.collection !== "staging") return "";
  const sources = record.stagingSources || {};
  const card = (key, label) => {
    const source = sources[key] || { state: "unavailable" };
    const clickable = source.state === "exact" && source.projectId;
    return `<div class="source-indicator-wrap"><button class="source-indicator source-indicator--${escapeHtml(source.state)}" type="button" data-source-provider="${key}" ${clickable ? "" : "disabled"} title="${clickable ? `Carregar dados do ${label}` : sourceStateLabel(source)}"><span></span><strong>${label}</strong><small>${escapeHtml(sourceStateLabel(source))}</small></button>${clickable ? `<button class="source-refresh" type="button" data-source-refresh="${key}" title="Ignorar o cache local e consultar ${label} novamente">Atualizar</button>` : ""}</div>`;
  };
  const candidates = Object.entries(sources).flatMap(([provider, source]) => (source?.candidates || []).map((candidate) => ({ ...candidate, provider })));
  const jarMetadata = record.jarMetadata || record.stagingFiles?.[0]?.jarMetadata;
  const internalMods = jarMetadata?.mods || [];
  const metadataPanel = internalMods.length ? `<div class="jar-metadata"><strong>Identidade lida do JAR · ${escapeHtml(jarMetadata.format || "arquivo interno")}</strong>${internalMods.map((mod) => `<span><code>${escapeHtml(mod.modId || "sem modId")}</code>${mod.name ? ` · ${escapeHtml(mod.name)}` : ""}${mod.version ? ` · v${escapeHtml(mod.version)}` : ""}${mod.loader ? ` · ${escapeHtml(mod.loader)}` : ""}</span>`).join("")}</div>` : "";
  return `<section class="staging-panel"><div><p class="eyebrow">Identificação do arquivo</p><h3>${escapeHtml(record.stagingMessage || "Revise a identificação antes de promover.")}</h3><p class="muted-copy">${(record.stagingFiles || []).map((file) => escapeHtml(file.relativePath || file.fileName)).join("<br>") || "Sem arquivo associado"}</p></div>${metadataPanel}<div class="source-indicators">${card("curseforge", "CurseForge")}${card("modrinth", "Modrinth")}</div><button class="button button--small" type="button" data-stage-resolve>Reavaliar identificação</button>${candidates.length ? `<div class="staging-candidates"><strong>Possíveis candidatos compatíveis</strong>${candidates.map((candidate) => `<button type="button" data-stage-candidate="${escapeHtml(candidate.projectId)}" data-stage-provider="${escapeHtml(candidate.provider)}">Usar ${escapeHtml(candidate.name || candidate.projectId)} · ${escapeHtml(candidate.provider === "modrinth" ? "Modrinth" : "CurseForge")}</button>`).join("")}</div>` : ""}</section>`;
}

function defaultRecord() {
  const author = getAuthor();
  if (state.collection === "mods" || state.collection === "staging") {
    return {
      kind: state.collection === "staging" ? "staging" : "mod",
      name: "",
      status: STATUS.mods[0],
      evaluator: author,
      divisions: [],
      supportedVersions: [],
      loaders: [],
      tags: [],
      notApplicableFields: [],
      officialAuthors: [],
      officialCategories: [],
      officialEnvironment: [],
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
    notApplicableFields: [],
    candidateMods: [],
    notesMarkdown: ""
  };
}

function startNewRecord() {
  clearTimeout(state.autosaveTimer);
  state.analysisVisible = false;
  state.current = defaultRecord();
  state.dirty = false;
  state.conflictCurrent = null;
  elements.conflictBanner.hidden = true;
  elements.analysisState.hidden = true;
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
    state.analysisVisible = false;
    state.dirty = false;
    state.conflictCurrent = null;
    elements.conflictBanner.hidden = true;
    elements.analysisState.hidden = true;
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
      ? { ...state.current, id: undefined, revision: undefined, storageVersion: undefined, reviewedAt: undefined, reviewedBy: undefined, createdAt: undefined, updatedAt: undefined, updatedBy: undefined, name: `${state.current.name} — cópia` }
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
            expectedStorageVersion: state.current.storageVersion,
            author: getAuthor()
          })
        });

    const hasNewChanges = state.changeVersion !== savedVersion;
    if (hasNewChanges) {
      const localDraft = state.current;
      state.current = {
        ...payload.record,
        ...localDraft,
        id: payload.record.id,
        kind: payload.record.kind,
        revision: payload.record.revision,
        storageVersion: payload.record.storageVersion,
        reviewedAt: payload.record.reviewedAt,
        reviewedBy: payload.record.reviewedBy,
        createdAt: payload.record.createdAt,
        updatedAt: payload.record.updatedAt,
        updatedBy: payload.record.updatedBy
      };
    } else {
      state.current = payload.record;
    }
    upsertLocalRecord(payload.record);
    state.dirty = hasNewChanges;
    state.conflictCurrent = null;
    elements.conflictBanner.hidden = true;
    updateEditorHeader();
    syncJsonEditor();
    renderList();
    if (!quiet) toast("Ficha salva.", "success");
    if (state.dirty) scheduleAutosave();
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

async function reviewRecord() {
  if (!state.current || state.saving) return;
  if (state.dirty && !(await saveRecord({ quiet: true }))) return;
  if (!state.current.id) return;

  state.saving = true;
  updateEditorHeader();
  try {
    const { record } = await api(`/api/records/${state.collection}/${encodeURIComponent(state.current.id)}/review`, {
      method: "POST",
      body: JSON.stringify({
        expectedStorageVersion: state.current.storageVersion,
        author: getAuthor()
      })
    });
    state.current = record;
    state.dirty = false;
    upsertLocalRecord(record);
    updateEditorHeader();
    syncJsonEditor();
    renderList();
    toast(`Revisão ${record.revision} confirmada.`, "success");
  } catch (error) {
    if (error.status === 409) {
      state.conflictCurrent = error.payload.current;
      elements.conflictBanner.hidden = false;
      toast("Conflito detectado: outra pessoa alterou esta ficha.", "warning", 5200);
    } else {
      toast(error.message, "error");
    }
  } finally {
    state.saving = false;
    updateEditorHeader();
  }
}

async function deleteRecord() {
  if (!state.current?.id || state.saving) return;
  const name = state.current.name || "esta ficha";
  const confirmed = confirm(`Excluir permanentemente a ficha “${name}”?\n\nEssa ação não pode ser desfeita pelo avaliador.`);
  if (!confirmed) return;

  clearTimeout(state.autosaveTimer);
  state.saving = true;
  updateEditorHeader();
  try {
    const { deleted } = await api(`/api/records/${state.collection}/${encodeURIComponent(state.current.id)}`, {
      method: "DELETE",
      body: JSON.stringify({ expectedStorageVersion: state.current.storageVersion })
    });
    state.records = state.records.filter((record) => record.id !== deleted.id);
    state.selectedRecordIds.delete(deleted.id);
    state.current = null;
    state.dirty = false;
    state.conflictCurrent = null;
    elements.conflictBanner.hidden = true;
    elements.editorState.hidden = true;
    elements.welcomeState.hidden = false;
    renderList();
    toast(`Ficha “${deleted.name}” excluída.`, "success");
  } catch (error) {
    if (error.status === 409) {
      state.conflictCurrent = error.payload.current;
      elements.conflictBanner.hidden = false;
      toast("A ficha mudou antes da exclusão. Recarregue e confirme novamente.", "warning", 5200);
    } else {
      toast(error.message, "error");
    }
  } finally {
    state.saving = false;
    updateSaveIndicator();
  }
}

function toggleVisibleSelection() {
  const visible = filteredRecords();
  const everyVisibleIsSelected = visible.length > 0 && visible.every((record) => state.selectedRecordIds.has(record.id));
  for (const record of visible) {
    if (everyVisibleIsSelected) state.selectedRecordIds.delete(record.id);
    else state.selectedRecordIds.add(record.id);
  }
  renderList();
}

async function deleteSelectedRecords() {
  if (state.saving || state.selectedRecordIds.size === 0) return;
  if (state.dirty) {
    toast("Salve ou descarte a edição atual antes de excluir fichas em lote.", "warning", 5200);
    return;
  }
  const selected = state.records.filter((record) => state.selectedRecordIds.has(record.id));
  if (selected.length === 0) return;
  const confirmed = confirm(`Excluir permanentemente ${selected.length} ficha${selected.length === 1 ? "" : "s"} selecionada${selected.length === 1 ? "" : "s"}?\n\nEssa ação não pode ser desfeita pelo avaliador.`);
  if (!confirmed) return;

  state.saving = true;
  updateEditorHeader();
  renderList();
  try {
    const { deleted } = await api(`/api/records/${state.collection}/bulk-delete`, {
      method: "POST",
      body: JSON.stringify({ records: selected.map((record) => ({ id: record.id, expectedStorageVersion: record.storageVersion })) })
    });
    const deletedIds = new Set(deleted.map((record) => record.id));
    state.records = state.records.filter((record) => !deletedIds.has(record.id));
    state.selectedRecordIds.clear();
    if (state.current && deletedIds.has(state.current.id)) {
      state.current = null;
      elements.editorState.hidden = true;
      elements.welcomeState.hidden = false;
    }
    toast(`${deleted.length} ficha${deleted.length === 1 ? "" : "s"} excluída${deleted.length === 1 ? "" : "s"}.`, "success");
  } catch (error) {
    if (error.status === 409) {
      toast("Nenhuma ficha foi excluída: uma delas mudou. Atualize e confirme novamente.", "warning", 5600);
      await loadCollection({ preserveCurrent: true });
    } else {
      toast(error.message, "error");
    }
  } finally {
    state.saving = false;
    updateSaveIndicator();
    renderList();
  }
}

async function loadStageProvider(provider, { projectId, force = false } = {}) {
  if (state.collection !== "staging" || !state.current || state.metadataLoading) return;
  const source = state.current.stagingSources?.[provider];
  const selectedProjectId = projectId || source?.projectId;
  if (!selectedProjectId) return;
  state.metadataLoading = true;
  try {
    const label = provider === "curseforge" ? "CurseForge" : "Modrinth";
    const { metadata, cached } = await providerMetadata(provider, selectedProjectId, { force });
    state.current = {
      ...state.current,
      ...factualMetadata(metadata),
      stagingResolution: "confirmed",
      stagingMessage: `Dados factuais carregados do ${label}${cached ? " (cache local)" : ""}.`,
      stagingSources: {
        ...state.current.stagingSources,
        [provider]: {
          ...(source || {}),
          provider: label,
          state: "exact",
          projectId: String(selectedProjectId),
          sourceUrl: metadata.sourceUrl || source?.sourceUrl || ""
        }
      }
    };
    renderForm();
    markDirty();
    toast(`Metadados do ${label} aplicados${cached ? " a partir do cache local" : ""}.`, "success");
  } catch (error) {
    toast(error.message, "error", 5200);
  } finally {
    state.metadataLoading = false;
  }
}

async function resolveStage() {
  if (state.collection !== "staging" || !state.current?.id || state.saving) return;
  if (state.dirty && !(await saveRecord({ quiet: true }))) return;
  state.saving = true;
  updateEditorHeader();
  try {
    const { record } = await api(`/api/staging/${encodeURIComponent(state.current.id)}/resolve`, {
      method: "POST",
      body: JSON.stringify({ expectedStorageVersion: state.current.storageVersion, author: getAuthor() })
    });
    state.current = record;
    state.dirty = false;
    upsertLocalRecord(record);
    renderForm();
    renderList();
    toast("Identificação atualizada com os filtros de mods.", "success");
  } catch (error) {
    if (error.status === 409) {
      state.conflictCurrent = error.payload.current;
      elements.conflictBanner.hidden = false;
      toast("O item mudou antes da reavaliação.", "warning");
    } else {
      toast(error.message, "error");
    }
  } finally {
    state.saving = false;
    updateEditorHeader();
  }
}

async function promoteStage() {
  if (state.collection !== "staging" || !state.current?.id || state.saving) return;
  if (state.dirty && !(await saveRecord({ quiet: true }))) return;
  state.saving = true;
  updateEditorHeader();
  try {
    const { record } = await api(`/api/staging/${encodeURIComponent(state.current.id)}/promote`, {
      method: "POST",
      body: JSON.stringify({ expectedStorageVersion: state.current.storageVersion, author: getAuthor() })
    });
    state.collection = "mods";
    state.current = record;
    state.records = [];
    state.dirty = false;
    document.querySelectorAll("[data-collection]").forEach((button) => {
      const active = button.dataset.collection === "mods";
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    elements.welcomeState.hidden = true;
    elements.editorState.hidden = false;
    await loadCollection({ preserveCurrent: true });
    renderForm();
    toast("Ficha promovida para o catálogo principal.", "success");
  } catch (error) {
    if (error.status === 409 && error.payload?.duplicate) {
      const duplicate = error.payload.duplicate;
      toast("Já existe uma ficha equivalente; a ficha existente foi aberta.", "warning", 5200);
      await switchCollection("mods");
      await openRecord(duplicate.id);
    } else if (error.status === 409) {
      state.conflictCurrent = error.payload.current;
      elements.conflictBanner.hidden = false;
      toast("O item de staging mudou antes da promoção.", "warning");
    } else {
      toast(error.message, "error");
    }
  } finally {
    state.saving = false;
    updateEditorHeader();
  }
}

function hashJar(worker, file, id) {
  return new Promise((resolve, reject) => {
    const listener = ({ data }) => {
      if (data.id !== id) return;
      worker.removeEventListener("message", listener);
      if (data.error) reject(new Error(data.error));
      else resolve(data.descriptor);
    };
    worker.addEventListener("message", listener);
    worker.postMessage({ id, file, relativePath: file.webkitRelativePath || file.name });
  });
}

async function scanJarFiles(fileList) {
  const files = [...fileList].filter((file) => /\.jar$/i.test(file.name));
  if (files.length === 0) {
    toast("Selecione uma pasta ou arquivos que contenham JARs de mods.", "warning");
    return;
  }
  if (files.length > 1500) {
    toast("O limite por leitura é de 1500 JARs.", "warning");
    return;
  }
  if (state.collection !== "staging") {
    await switchCollection("staging");
    if (state.collection !== "staging") return;
  }
  state.scanning = true;
  state.scanCancelled = false;
  elements.scanFolderButton.textContent = "Cancelar leitura";
  const worker = new Worker("/jar-hash-worker.js?v=staging-0.1", { type: "module" });
  state.scanWorker = worker;
  const descriptors = [];
  const failures = [];
  try {
    for (let index = 0; index < files.length; index += 1) {
      if (state.scanCancelled) break;
      elements.scanFolderButton.textContent = `Lendo ${index + 1}/${files.length} · cancelar`;
      try {
        descriptors.push(await hashJar(worker, files[index], index));
      } catch (error) {
        failures.push(`${files[index].name}: ${error.message}`);
      }
    }
    if (state.scanCancelled) {
      toast("Leitura de JARs cancelada. Nada foi salvo no staging.", "warning");
      return;
    }
    if (descriptors.length === 0) {
      toast("Nenhum JAR pôde ser processado.", "error");
      return;
    }
    elements.scanFolderButton.textContent = "Consultando plataformas…";
    const { records } = await api("/api/staging", {
      method: "POST",
      body: JSON.stringify({ descriptors, author: getAuthor() })
    });
    await loadCollection({ preserveCurrent: true });
    toast(`${records.length} itens criados no staging${failures.length ? `; ${failures.length} JARs falharam` : ""}.`, failures.length ? "warning" : "success", 6000);
  } catch (error) {
    toast(error.message, "error", 6200);
  } finally {
    worker.terminate();
    state.scanWorker = null;
    state.scanning = false;
    elements.scanFolderButton.disabled = false;
    elements.scanFolderButton.textContent = "Ler JARs";
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
  const availableIds = new Set(state.records.map((record) => record.id));
  state.selectedRecordIds = new Set([...state.selectedRecordIds].filter((id) => availableIds.has(id)));
  const selectedVisible = records.filter((record) => state.selectedRecordIds.has(record.id));
  elements.recordCount.textContent = `${records.length} ${records.length === 1 ? "registro" : "registros"}${state.selectedRecordIds.size ? ` · ${state.selectedRecordIds.size} selecionada${state.selectedRecordIds.size === 1 ? "" : "s"}` : ""}`;
  elements.selectVisibleButton.hidden = records.length === 0;
  elements.selectVisibleButton.textContent = records.length > 0 && selectedVisible.length === records.length ? "Limpar seleção visível" : "Selecionar visíveis";
  elements.selectVisibleButton.disabled = state.saving;
  elements.bulkDeleteButton.hidden = state.selectedRecordIds.size === 0;
  elements.bulkDeleteButton.textContent = `Excluir ${state.selectedRecordIds.size} selecionada${state.selectedRecordIds.size === 1 ? "" : "s"}`;
  elements.bulkDeleteButton.disabled = state.saving;
  if (records.length === 0) {
    elements.recordList.innerHTML = `<div class="empty-list"><span class="empty-list__icon">◇</span><strong>Nenhuma ficha encontrada</strong><p>Altere os filtros ou crie um novo registro.</p></div>`;
    return;
  }
  elements.recordList.innerHTML = records.map((record) => `
    <article class="record-list-item ${state.current?.id === record.id ? "is-active" : ""}">
      <label class="record-list-item__select" title="Selecionar ${escapeHtml(record.name)} para exclusão em lote"><input type="checkbox" data-record-select="${escapeHtml(record.id)}" ${state.selectedRecordIds.has(record.id) ? "checked" : ""}><span class="sr-only">Selecionar ${escapeHtml(record.name)}</span></label>
      <button class="record-list-item__open" type="button" data-record-id="${escapeHtml(record.id)}">
        <span class="record-list-item__icon${record.officialIconUrl ? "" : " is-fallback"}" data-record-icon><img src="${escapeHtml(record.officialIconUrl || "")}" alt="" loading="lazy" data-record-icon-image><span aria-hidden="true">◇</span></span>
        <span class="record-list-item__content"><span class="record-list-item__top"><strong>${escapeHtml(record.name)}</strong><span class="status-dot status-dot--${statusClass(record.status)}"></span></span>
        <span class="record-list-item__meta">${escapeHtml(record.status || "Sem estado")}${record.divisions?.length ? ` · ${escapeHtml(record.divisions.join(" / "))}` : ""}</span>
        <span class="record-list-item__date">${escapeHtml(formatDate(record.updatedAt))}</span></span>
      </button>
    </article>
  `).join("");
}

function refreshFilters() {
  const previous = elements.statusFilter.value;
  elements.statusFilter.innerHTML = `<option value="">Todos os estados</option>${STATUS[state.collection].map((status) => `<option>${escapeHtml(status)}</option>`).join("")}`;
  if (STATUS[state.collection].includes(previous)) elements.statusFilter.value = previous;
  elements.divisionFilter.hidden = state.collection === "references";
  elements.scanFolderButton.hidden = state.collection !== "staging";
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
  if (collection === state.collection) {
    if (state.analysisVisible) await showAnalyses();
    return;
  }
  if (state.dirty && !confirm("Há alterações pendentes. Deseja descartá-las e trocar de coleção?")) return;
  state.collection = collection;
  state.analysisVisible = false;
  state.current = null;
  state.dirty = false;
  state.selectedRecordIds.clear();
  document.querySelectorAll("[data-collection]").forEach((button) => {
    const active = button.dataset.collection === collection;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.searchInput.value = "";
  elements.analysisState.hidden = true;
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

function analysisMatches() {
  const catalog = state.analysisCatalog;
  if (!catalog) return [];
  const query = elements.analysisSearch.value.trim().toLocaleLowerCase("pt-BR");
  const category = elements.analysisCategory.value;
  const presence = elements.analysisPresence.value;
  return catalog.mods.filter((mod) => {
    const haystack = [mod.name, mod.modId, mod.basis, ...(mod.files || []).map((file) => file.file)].join(" ").toLocaleLowerCase("pt-BR");
    if (query && !haystack.includes(query)) return false;
    if (category !== "all" && mod.category !== category) return false;
    if (presence === "shared" && mod.packs.length < 2) return false;
    if (presence === "unique" && mod.packs.length !== 1) return false;
    return true;
  });
}

function renderAnalyses() {
  const catalog = state.analysisCatalog;
  if (!catalog) return;
  const mods = analysisMatches();
  const counts = ["suporte", "qol", "secundario"].map((category) => [category, mods.filter((mod) => mod.category === category).length]);
  elements.analysisStats.innerHTML = `<span><strong>${mods.length}</strong> mods exibidos</span>${counts.map(([category, count]) => `<span class="analysis-pill analysis-pill--${category}">${category}: ${count}</span>`).join("")}`;
  elements.analysisHead.innerHTML = `<tr><th>Mod</th><th>Categoria</th><th>Base da triagem</th><th>Presente em</th>${catalog.packs.map((pack) => `<th>${escapeHtml(pack)}</th>`).join("")}</tr>`;
  elements.analysisRows.innerHTML = mods.map((mod) => {
    const present = new Set(mod.packs || []);
    return `<tr><td><strong>${escapeHtml(mod.name)}</strong><br><code>${escapeHtml(mod.modId)}</code><br><small>${escapeHtml((mod.files || []).map((file) => file.file).join(" · "))}</small></td><td><span class="analysis-pill analysis-pill--${escapeHtml(mod.category)}">${escapeHtml(mod.category)}</span></td><td>${escapeHtml(mod.basis)}</td><td>${(mod.packs || []).map(escapeHtml).join("<br>")}</td>${catalog.packs.map((pack) => `<td class="${present.has(pack) ? "analysis-present" : "analysis-absent"}">${present.has(pack) ? "●" : "—"}</td>`).join("")}</tr>`;
  }).join("") || `<tr><td colspan="20" class="muted-copy">Nenhum mod corresponde aos filtros.</td></tr>`;
}

async function openAnalysisDocument(name) {
  try {
    const { content } = await api(`/api/analyses/documents/${encodeURIComponent(name)}`);
    elements.analysisDocumentPreview.innerHTML = renderMarkdown(content);
    elements.analysisDocumentLinks.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", button.dataset.analysisDocument === name));
  } catch (error) {
    toast(error.message, "error");
  }
}

async function showAnalyses() {
  if (state.analysisVisible) {
    state.analysisVisible = false;
    elements.analysisState.hidden = true;
    elements.welcomeState.hidden = Boolean(state.current);
    elements.editorState.hidden = !state.current;
    return;
  }
  if (state.dirty && !confirm("Há alterações pendentes. Deseja abrir as análises sem salvar a ficha?")) return;
  try {
    const [catalogResponse, documentsResponse] = await Promise.all([api("/api/analyses/catalog"), api("/api/analyses/documents")]);
    state.analysisCatalog = catalogResponse;
    state.analysisDocuments = documentsResponse.documents || [];
    state.analysisVisible = true;
    elements.welcomeState.hidden = true;
    elements.editorState.hidden = true;
    elements.analysisState.hidden = false;
    elements.analysisDocumentLinks.innerHTML = state.analysisDocuments.map((document) => `<button type="button" data-analysis-document="${escapeHtml(document.name)}">${escapeHtml(document.title)}</button>`).join("") || "<span class=\"muted-copy\">Nenhum relatório disponível.</span>";
    elements.analysisDocumentPreview.innerHTML = "";
    renderAnalyses();
    if (state.analysisDocuments[0]) await openAnalysisDocument(state.analysisDocuments[0].name);
  } catch (error) {
    toast(error.message, "error", 5200);
  }
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
  if (state.collection === "staging") {
    toast("O staging é transitório e não é exportado pelo menu Dados.", "warning");
    return;
  }
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

function toggleNotApplicable(key) {
  if (!state.current || !key) return;
  const sections = state.collection === "references" ? REFERENCE_SECTIONS : MOD_SECTIONS;
  const field = sections.flatMap((section) => section.fields).find((candidate) => candidate.key === key);
  if (!field || !fieldAcceptsNotApplicable(field)) return;
  readForm();
  const fields = new Set(Array.isArray(state.current.notApplicableFields) ? state.current.notApplicableFields : []);
  if (fields.has(key)) fields.delete(key);
  else fields.add(key);
  state.current.notApplicableFields = [...fields];
  renderForm();
  markDirty();
  if (!fields.has(key)) requestAnimationFrame(() => document.querySelector(`[data-field="${CSS.escape(key)}"]`)?.focus());
}

elements.recordForm.addEventListener("input", (event) => {
  if (!event.target.matches("[data-field]")) return;
  readForm();
  updateFieldVisual(event.target);
  markDirty();
});
elements.recordForm.addEventListener("pointerover", (event) => {
  const wrap = event.target.closest("[data-field-wrap]");
  if (wrap) state.hoveredFieldKey = wrap.dataset.fieldWrap;
});
elements.recordForm.addEventListener("pointerout", (event) => {
  const nextWrap = event.relatedTarget?.closest?.("[data-field-wrap]");
  if (!nextWrap) state.hoveredFieldKey = "";
});
elements.recordForm.addEventListener("change", (event) => {
  if (!event.target.matches("[data-field]")) return;
  readForm();
  updateFieldVisual(event.target);
  markDirty();
  if (event.target.dataset.field === "sourceUrl") void lookupOfficialMetadata();
});
elements.recordForm.addEventListener("click", (event) => {
  if (event.target.closest("[data-metadata-lookup]")) {
    void lookupOfficialMetadata({ force: true });
    return;
  }
  const button = event.target.closest("[data-na-field]");
  if (button) {
    toggleNotApplicable(button.dataset.naField);
    return;
  }
  if (event.target.closest("[data-stage-resolve]")) {
    void resolveStage();
    return;
  }
  const providerButton = event.target.closest("[data-source-provider]");
  if (providerButton) {
    void loadStageProvider(providerButton.dataset.sourceProvider);
    return;
  }
  const refreshButton = event.target.closest("[data-source-refresh]");
  if (refreshButton) {
    void loadStageProvider(refreshButton.dataset.sourceRefresh, { force: true });
    return;
  }
  const candidateButton = event.target.closest("[data-stage-candidate]");
  if (candidateButton) void loadStageProvider(candidateButton.dataset.stageProvider || "curseforge", { projectId: candidateButton.dataset.stageCandidate });
});
elements.recordList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-record-id]");
  if (button) void openRecord(button.dataset.recordId);
});
elements.recordList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-record-select]");
  if (!input) return;
  if (input.checked) state.selectedRecordIds.add(input.dataset.recordSelect);
  else state.selectedRecordIds.delete(input.dataset.recordSelect);
  renderList();
});
elements.recordList.addEventListener("error", (event) => {
  const image = event.target.closest?.("[data-record-icon-image]");
  if (!image) return;
  image.closest("[data-record-icon]")?.classList.add("is-fallback");
  image.remove();
}, true);
document.querySelectorAll("[data-collection]").forEach((button) => button.addEventListener("click", () => void switchCollection(button.dataset.collection)));
elements.analysesButton.addEventListener("click", () => void showAnalyses());
elements.analysisSearch.addEventListener("input", renderAnalyses);
elements.analysisCategory.addEventListener("change", renderAnalyses);
elements.analysisPresence.addEventListener("change", renderAnalyses);
elements.copyAnalysisButton.addEventListener("click", async () => {
  const rows = analysisMatches();
  const text = ["Mod\tMod ID\tCategoria\tPresente em", ...rows.map((mod) => [mod.name, mod.modId, mod.category, mod.packs.join(", ")].join("\t"))].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    toast("Tabela filtrada copiada.", "success");
  } catch {
    toast("O navegador não permitiu copiar a tabela.", "warning");
  }
});
elements.analysisDocumentLinks.addEventListener("click", (event) => {
  const button = event.target.closest("[data-analysis-document]");
  if (button) void openAnalysisDocument(button.dataset.analysisDocument);
});
elements.newRecordButton.addEventListener("click", startNewRecord);
elements.welcomeNewButton.addEventListener("click", startNewRecord);
elements.saveButton.addEventListener("click", () => void saveRecord());
elements.reviewButton.addEventListener("click", () => void reviewRecord());
elements.deleteButton.addEventListener("click", () => void deleteRecord());
elements.selectVisibleButton.addEventListener("click", toggleVisibleSelection);
elements.bulkDeleteButton.addEventListener("click", () => void deleteSelectedRecords());
elements.promoteButton.addEventListener("click", () => void promoteStage());
elements.refreshButton.addEventListener("click", () => void loadCollection({ preserveCurrent: true }));
elements.scanFolderButton.addEventListener("click", () => {
  if (state.scanning) {
    state.scanCancelled = true;
    elements.scanFolderButton.disabled = true;
    return;
  }
  if ("webkitdirectory" in elements.jarDirectoryInput) elements.jarDirectoryInput.click();
  else elements.jarFilesInput.click();
});
elements.jarDirectoryInput.addEventListener("change", () => {
  void scanJarFiles(elements.jarDirectoryInput.files);
  elements.jarDirectoryInput.value = "";
});
elements.jarFilesInput.addEventListener("change", () => {
  void scanJarFiles(elements.jarFilesInput.files);
  elements.jarFilesInput.value = "";
});
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
  } else if (event.altKey && event.key.toLocaleLowerCase() === "n") {
    event.preventDefault();
    startNewRecord();
  } else if (event.altKey && event.key.toLocaleLowerCase() === "r") {
    event.preventDefault();
    void reviewRecord();
  } else if (event.altKey && event.key.toLocaleLowerCase() === "q") {
    const focused = document.activeElement?.matches?.("[data-field]") ? document.activeElement.dataset.field : "";
    const key = focused || state.hoveredFieldKey;
    if (key) {
      event.preventDefault();
      toggleNotApplicable(key);
    }
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
