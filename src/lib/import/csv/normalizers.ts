/**
 * Normalizes a raw price string from HGourmet's inventory format.
 * Handles: "$1,135.00", "1135.00", "1135", "1.135,00" (not expected but safe).
 * Returns NaN if the string is not parseable as a positive number.
 */
export function normalizePrice(raw: string): number {
  if (!raw || raw.trim() === "") return NaN;
  // Remove currency symbols and thousands separators, keep decimal dot
  const cleaned = raw
    .trim()
    .replace(/\$/g, "")
    .replace(/,/g, ""); // assumes MXN format: $1,135.00 -> 1135.00
  return parseFloat(cleaned);
}

/**
 * Normalizes a departamento or categoria string for rule-engine matching.
 * Lowercases, trims, strips accents.
 */
export function normalizeCategoryKey(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Parses a truthy/falsy string from CSV into a boolean.
 * Accepts: "true", "1", "si", "sí", "yes" → true; everything else → false.
 */
export function parseBooleanField(raw: string): boolean {
  const val = raw?.trim().toLowerCase();
  return val === "true" || val === "1" || val === "si" || val === "sí" || val === "yes";
}

/**
 * Returns null for empty or whitespace-only strings, trimmed string otherwise.
 */
export function nullableString(raw: string): string | null {
  const trimmed = raw?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}
