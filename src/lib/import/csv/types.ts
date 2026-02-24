// Issue codes for row-level validation errors (mirrors product_import_issues.issue_code)
export type IssueCode =
  | "INVALID_PRICE"
  | "MISSING_FIELD"
  | "UNMAPPED_CATEGORY"
  | "DUPLICATE_SKU";

// Raw row as parsed from CSV (all strings, pre-normalization)
export interface CsvRawRow {
  nombre: string;
  descripcion: string;
  precio: string;
  departamento: string;
  categoria: string;
  clave1: string; // SKU — idempotency key
  clave2: string; // barcode
  codigo_sat: string;
  disponible: string;
  destacado: string;
  temporada: string;
}

// Required columns in the CSV template (lowercase, no accents for matching)
export const CSV_REQUIRED_COLUMNS: Array<keyof CsvRawRow> = [
  "nombre",
  "precio",
  "departamento",
  "categoria",
  "clave1",
];

// A single validation issue attached to a row
export interface RowIssue {
  sourceRow: number;
  code: IssueCode;
  detail: string;
}

// A CSV row after normalization (price as number, booleans parsed)
export interface NormalizedRow {
  name: string;
  description: string | null;
  price: number;
  departamento: string; // normalized lowercase for mapping
  categoria: string; // normalized lowercase for mapping
  sku: string | null;
  barcode: string | null;
  sat_code: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_seasonal: boolean;
}

// Result of resolving a row's category through the mapping engine
export type CategoryResolution =
  | { matched: true; curatedCategory: string }
  | { matched: false };

// A validated row ready for upsert — includes category_id resolved from DB
export interface ValidatedRow {
  sourceRow: number;
  data: NormalizedRow & { category_id: string };
}

// Summary returned to the UI after a full import run
export interface ImportSummary {
  batchId: string;
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  errored: number;
  issues: RowIssue[];
}

// Intermediate parse result (before mapping / before upsert)
export interface ParseResult {
  validRows: Array<{ sourceRow: number; data: NormalizedRow }>;
  issues: RowIssue[];
}
