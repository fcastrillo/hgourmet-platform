import type { CategoryResolution } from "./types";

export interface MappingRule {
  departamento_raw: string;
  categoria_raw: string;
  curated_category: string;
  priority: number;
}

/**
 * Resolves a (departamento, categoria) pair to a curated category name
 * using the versioned rule engine from category_mapping_rules.
 *
 * Resolution order (highest priority wins):
 *   30 = exact dept+cat override
 *   20 = category-only override  (departamento_raw = '*')
 *   10 = department base          (categoria_raw    = '*')
 *
 * '*' is the wildcard — matches any value on that axis.
 */
export function resolveCategory(
  departamento: string,
  categoria: string,
  rules: MappingRule[],
): CategoryResolution {
  const candidates = rules.filter((r) => {
    const deptMatch =
      r.departamento_raw === "*" || r.departamento_raw === departamento;
    const catMatch =
      r.categoria_raw === "*" || r.categoria_raw === categoria;
    return deptMatch && catMatch;
  });

  if (candidates.length === 0) {
    return { matched: false };
  }

  // Pick the rule with the highest priority
  candidates.sort((a, b) => b.priority - a.priority);
  return { matched: true, curatedCategory: candidates[0].curated_category };
}
