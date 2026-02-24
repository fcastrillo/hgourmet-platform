import type { NormalizedRow, ParseResult, RowIssue, ValidatedRow } from "./types";
import type { MappingRule } from "./mapping";
import { resolveCategory } from "./mapping";

interface ValidationInput {
  parsedRows: ParseResult["validRows"];
  parseIssues: RowIssue[];
  rules: MappingRule[];
  existingSkus: Set<string>;
  categoryIdsByName: Map<string, string>; // curated name -> category.id
}

export interface ValidationResult {
  validatedRows: ValidatedRow[];
  issues: RowIssue[];
}

/**
 * Second-pass validation:
 *   1. Resolve departamento+categoria → curated category.
 *   2. Confirm curated category exists in DB (category_id lookup).
 *   3. Flag duplicate SKUs against the existing product set.
 *
 * Rows that fail any check are not included in validatedRows.
 * Parse-level issues from the first pass are forwarded as-is.
 */
export function validateRows(input: ValidationInput): ValidationResult {
  const {
    parsedRows,
    parseIssues,
    rules,
    existingSkus,
    categoryIdsByName,
  } = input;

  const issues: RowIssue[] = [...parseIssues];
  const validatedRows: ValidatedRow[] = [];

  for (const { sourceRow, data } of parsedRows) {
    // DUPLICATE_SKU check
    if (data.sku && existingSkus.has(data.sku)) {
      issues.push({
        sourceRow,
        code: "DUPLICATE_SKU",
        detail: `SKU duplicado: "${data.sku}" ya existe en el catálogo y será omitido.`,
      });
      continue;
    }

    // Category mapping
    const resolution = resolveCategory(data.departamento, data.categoria, rules);
    if (!resolution.matched) {
      issues.push({
        sourceRow,
        code: "UNMAPPED_CATEGORY",
        detail: `Sin regla de mapeo para departamento="${data.departamento}" + categoría="${data.categoria}".`,
      });
      continue;
    }

    // Category ID lookup
    const categoryId = categoryIdsByName.get(resolution.curatedCategory);
    if (!categoryId) {
      issues.push({
        sourceRow,
        code: "UNMAPPED_CATEGORY",
        detail: `Categoría curada "${resolution.curatedCategory}" no existe en el catálogo. Créala primero.`,
      });
      continue;
    }

    validatedRows.push({
      sourceRow,
      data: { ...data, category_id: categoryId } as NormalizedRow & { category_id: string },
    });
  }

  return { validatedRows, issues };
}
