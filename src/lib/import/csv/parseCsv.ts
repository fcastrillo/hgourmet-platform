import type { CsvRawRow, NormalizedRow, ParseResult, RowIssue } from "./types";
import { CSV_REQUIRED_COLUMNS } from "./types";
import {
  normalizePrice,
  normalizeCategoryKey,
  parseBooleanField,
  nullableString,
} from "./normalizers";

/**
 * Parses raw CSV text into a ParseResult.
 * Assumptions:
 *   - First row is the header.
 *   - Delimiter is comma (,).
 *   - Encoding is UTF-8.
 *   - Missing optional fields default to empty string.
 */
export function parseCsvText(csvText: string): ParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return { validRows: [], issues: [] };
  }

  const headers = parsecsv_line(lines[0]).map((h) =>
    normalizeCategoryKey(h.trim()),
  );

  const validRows: ParseResult["validRows"] = [];
  const issues: RowIssue[] = [];

  for (let i = 1; i < lines.length; i++) {
    const sourceRow = i + 1; // 1-indexed, row 1 is header
    const cells = parsecsv_line(lines[i]);
    const raw = buildRawRow(headers, cells);

    // Check required columns
    const missingFields: string[] = [];
    for (const col of CSV_REQUIRED_COLUMNS) {
      if (!raw[col] || raw[col].trim() === "") {
        missingFields.push(col);
      }
    }

    if (missingFields.length > 0) {
      issues.push({
        sourceRow,
        code: "MISSING_FIELD",
        detail: `Campos obligatorios vacíos: ${missingFields.join(", ")}`,
      });
      continue;
    }

    const price = normalizePrice(raw.precio);
    if (isNaN(price) || price <= 0) {
      issues.push({
        sourceRow,
        code: "INVALID_PRICE",
        detail: `Precio inválido: "${raw.precio}". Debe ser un número mayor a 0.`,
      });
      continue;
    }

    const normalized: NormalizedRow = {
      name: raw.nombre.trim(),
      description: nullableString(raw.descripcion),
      price,
      departamento: normalizeCategoryKey(raw.departamento),
      categoria: normalizeCategoryKey(raw.categoria),
      sku: nullableString(raw.clave1),
      barcode: nullableString(raw.clave2),
      sat_code: nullableString(raw.codigo_sat),
      is_available: raw.disponible ? parseBooleanField(raw.disponible) : true,
      is_featured: parseBooleanField(raw.destacado),
      is_seasonal: parseBooleanField(raw.temporada),
    };

    validRows.push({ sourceRow, data: normalized });
  }

  return { validRows, issues };
}

/**
 * Parses a single CSV line respecting double-quoted fields.
 */
function parsecsv_line(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/**
 * Builds a CsvRawRow from header array + cell array.
 * Missing headers get empty string.
 */
function buildRawRow(headers: string[], cells: string[]): CsvRawRow {
  const get = (key: string) => {
    const idx = headers.indexOf(key);
    return idx >= 0 ? (cells[idx] ?? "") : "";
  };

  return {
    nombre: get("nombre"),
    descripcion: get("descripcion"),
    precio: get("precio"),
    departamento: get("departamento"),
    categoria: get("categoria"),
    clave1: get("clave1"),
    clave2: get("clave2"),
    codigo_sat: get("codigo_sat"),
    disponible: get("disponible"),
    destacado: get("destacado"),
    temporada: get("temporada"),
  };
}
