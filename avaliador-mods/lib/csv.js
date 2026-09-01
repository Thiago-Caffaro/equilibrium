const ARRAY_FIELDS = new Set([
  "divisions",
  "tags",
  "supportedVersions",
  "loaders",
  "candidateMods"
]);

export const MOD_CSV_FIELDS = [
  "id",
  "name",
  "status",
  "evaluator",
  "sourceUrl",
  "projectUrl",
  "supportedVersions",
  "loaders",
  "divisions",
  "primaryFunction",
  "humanEvidence",
  "uniqueSystems",
  "overlaps",
  "dangerousCombinations",
  "scarcityImpact",
  "scarcityNotes",
  "automationImpact",
  "masteryGate",
  "progressionWindow",
  "worldgenImpact",
  "worldgenNotes",
  "multiplayerNotes",
  "performanceNotes",
  "rupturePotential",
  "integrationEffort",
  "requiredChanges",
  "testNeeds",
  "verdict",
  "verdictReason",
  "openQuestions",
  "notesMarkdown",
  "tags",
  "revision",
  "createdAt",
  "updatedAt",
  "updatedBy"
];

export const REFERENCE_CSV_FIELDS = [
  "id",
  "name",
  "referenceType",
  "status",
  "evaluator",
  "sourceUrl",
  "supportedVersions",
  "loaders",
  "whyStudy",
  "usefulPatterns",
  "pacingNotes",
  "gateNotes",
  "compositionNotes",
  "avoidPatterns",
  "candidateMods",
  "humanEvidence",
  "openQuestions",
  "notesMarkdown",
  "tags",
  "revision",
  "createdAt",
  "updatedAt",
  "updatedBy"
];

function escapeCell(value) {
  const text = Array.isArray(value)
    ? value.join(" | ")
    : value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  if (/[",\r\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function stringifyCsv(records, fields) {
  const lines = [fields.map(escapeCell).join(",")];
  for (const record of records) {
    lines.push(fields.map((field) => escapeCell(record[field])).join(","));
  }
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export function parseCsv(text) {
  const source = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"' && cell.length === 0) {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }

  const meaningful = rows.filter((candidate) => candidate.some((value) => value.trim() !== ""));
  if (meaningful.length === 0) return [];

  const headers = meaningful.shift().map((header) => header.trim());
  return meaningful.map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      const value = values[index] ?? "";
      record[header] = ARRAY_FIELDS.has(header)
        ? value.split("|").map((item) => item.trim()).filter(Boolean)
        : value;
    });
    return record;
  });
}
