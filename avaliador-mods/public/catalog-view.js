export function normalizeCatalogView(value) {
  return value === "cards" ? "cards" : "table";
}

export function initialRecordId(records, preferredId) {
  if (!Array.isArray(records) || records.length === 0) return null;
  if (preferredId && records.some((record) => record.id === preferredId)) return preferredId;
  return records[0]?.id || null;
}
