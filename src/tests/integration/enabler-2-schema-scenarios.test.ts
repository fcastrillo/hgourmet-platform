/**
 * ENABLER-2: Schema Evolution + Curación de Categorías
 * Integration contract tests for the category mapping resolution engine.
 *
 * These tests validate the core business rule: given a (departamento, categoria)
 * pair from a CSV row and a set of mapping rules, resolve the correct curated
 * category using the priority system (10=dept-base, 20=cat-override, 30=exact).
 *
 * No Supabase connection required — the resolver is pure TypeScript logic
 * that HU-2.3 will implement. Tests define the contract upfront.
 */

import { describe, it, expect } from "vitest";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MappingRule {
  mapping_version: string;
  departamento_raw: string; // lowercase normalized; '*' = wildcard
  categoria_raw: string; // lowercase normalized; '*' = wildcard
  curated_category: string;
  priority: 10 | 20 | 30;
  is_active: boolean;
}

type ResolveResult = string | "UNMAPPED";

// ─── Resolver (contract under test) ──────────────────────────────────────────
// This function will live in src/lib/import/resolveCategory.ts in HU-2.3.
// Defined inline here so tests can run immediately as a contract spec.

function resolveCategory(
  departamento: string,
  categoria: string,
  rules: MappingRule[],
  version: string
): ResolveResult {
  const dept = departamento.toLowerCase().trim();
  const cat = categoria.toLowerCase().trim();

  const activeRules = rules.filter(
    (r) => r.mapping_version === version && r.is_active
  );

  // Find all rules that match this (dept, cat) pair using wildcards
  const matches = activeRules.filter((r) => {
    const deptMatch = r.departamento_raw === "*" || r.departamento_raw === dept;
    const catMatch = r.categoria_raw === "*" || r.categoria_raw === cat;
    return deptMatch && catMatch;
  });

  if (matches.length === 0) return "UNMAPPED";

  // Highest priority wins
  matches.sort((a, b) => b.priority - a.priority);
  return matches[0].curated_category;
}

// ─── V1 Seed Rules (mirrors migration 005_enabler2_schema_evolution.sql) ─────

const V1_RULES: MappingRule[] = [
  // Department base (priority 10)
  { mapping_version: "v1", departamento_raw: "herramientas",   categoria_raw: "*", curated_category: "Utensilios",  priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "cortadores",     categoria_raw: "*", curated_category: "Utensilios",  priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "accesorios",     categoria_raw: "*", curated_category: "Utensilios",  priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "refrigeracion",  categoria_raw: "*", curated_category: "Insumos",     priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "decoracion",     categoria_raw: "*", curated_category: "Decoración",  priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "colorantes",     categoria_raw: "*", curated_category: "Decoración",  priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "velas",          categoria_raw: "*", curated_category: "Decoración",  priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "pastel",         categoria_raw: "*", curated_category: "Bases",       priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "capacillos",     categoria_raw: "*", curated_category: "Desechables", priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "bolsas",         categoria_raw: "*", curated_category: "Desechables", priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "desechables",    categoria_raw: "*", curated_category: "Desechables", priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "caja",           categoria_raw: "*", curated_category: "Desechables", priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "moldes",         categoria_raw: "*", curated_category: "Moldes",      priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "insumos",        categoria_raw: "*", curated_category: "Insumos",     priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "extractos",      categoria_raw: "*", curated_category: "Insumos",     priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "inix",           categoria_raw: "*", curated_category: "Insumos",     priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "comida",         categoria_raw: "*", curated_category: "Insumos",     priority: 10, is_active: true },
  { mapping_version: "v1", departamento_raw: "hgourmet",       categoria_raw: "*", curated_category: "Insumos",     priority: 10, is_active: true },
  // Category-only overrides (priority 20)
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "chispas",            curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "chocolate",          curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "cocoa",              curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "coberturas",         curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "granillos",          curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "semiamargo",         curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "amargo",             curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "leche",              curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "blanco",             curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "sin azucar",         curated_category: "Chocolates", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "tapetes de silicon", curated_category: "Utensilios", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "plumones",           curated_category: "Utensilios", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "raspas",             curated_category: "Utensilios", priority: 20, is_active: true },
  { mapping_version: "v1", departamento_raw: "*", categoria_raw: "espatulas",          curated_category: "Utensilios", priority: 20, is_active: true },
  // Exact dept+cat overrides (priority 30)
  { mapping_version: "v1", departamento_raw: "refrigeracion", categoria_raw: "lacteos",   curated_category: "Insumos",    priority: 30, is_active: true },
  { mapping_version: "v1", departamento_raw: "insumos",       categoria_raw: "lacteos",   curated_category: "Insumos",    priority: 30, is_active: true },
  { mapping_version: "v1", departamento_raw: "hgourmet",      categoria_raw: "chocolate", curated_category: "Chocolates", priority: 30, is_active: true },
];

// ─── BDD: Dado que / Cuando / Entonces ───────────────────────────────────────

describe("ENABLER-2 — Category mapping resolution engine (V1)", () => {

  describe("Criterio 1 — Base por departamento (priority 10)", () => {
    it("Dado que el departamento es Refrigeracion, cuando no hay override, entonces resuelve a Insumos", () => {
      expect(resolveCategory("Refrigeracion", "Lacteos", V1_RULES, "v1")).toBe("Insumos");
    });

    it("Dado que el departamento es Moldes, cuando la categoria no tiene override, entonces resuelve a Moldes", () => {
      expect(resolveCategory("Moldes", "Silicona", V1_RULES, "v1")).toBe("Moldes");
    });

    it("Dado que el departamento es Pastel, entonces resuelve a Bases", () => {
      expect(resolveCategory("Pastel", "Harina", V1_RULES, "v1")).toBe("Bases");
    });

    it("Dado que el departamento es Herramientas, entonces resuelve a Utensilios", () => {
      expect(resolveCategory("Herramientas", "Espátula", V1_RULES, "v1")).toBe("Utensilios");
    });

    it("normaliza mayúsculas y espacios del CSV sin fallar", () => {
      expect(resolveCategory("  INSUMOS  ", "Granel", V1_RULES, "v1")).toBe("Insumos");
    });
  });

  describe("Criterio 2 — Override por categoría (priority 20 > 10)", () => {
    it("Dado que la categoria es Chocolate (insumos dept), cuando existe override de categoria, entonces resuelve a Chocolates", () => {
      // dept-base diría Insumos (priority 10), pero cat-override dice Chocolates (priority 20)
      expect(resolveCategory("Insumos", "Chocolate", V1_RULES, "v1")).toBe("Chocolates");
    });

    it("Dado que la categoria es Cocoa (decoracion dept), entonces resuelve a Chocolates por override", () => {
      expect(resolveCategory("Decoracion", "Cocoa", V1_RULES, "v1")).toBe("Chocolates");
    });

    it("Dado que la categoria es Espatulas (accesorios dept), entonces resuelve a Utensilios por override", () => {
      expect(resolveCategory("Accesorios", "Espatulas", V1_RULES, "v1")).toBe("Utensilios");
    });

    it("Dado que la categoria es Chispas (hgourmet dept), entonces resuelve a Chocolates por override", () => {
      expect(resolveCategory("HGOURMET", "Chispas", V1_RULES, "v1")).toBe("Chocolates");
    });
  });

  describe("Criterio 3 — Override exacto dept+cat (priority 30 > 20 > 10)", () => {
    it("Dado que dept=Refrigeracion y cat=Lacteos, cuando existe override exacto, entonces resuelve a Insumos (no Chocolates por leche)", () => {
      // Cat-override 'leche' → Chocolates (priority 20) existiría si cat fuera 'leche',
      // pero aquí cat='lacteos' y el exact override dice Insumos (priority 30).
      expect(resolveCategory("Refrigeracion", "Lacteos", V1_RULES, "v1")).toBe("Insumos");
    });

    it("Dado que dept=HGOURMET y cat=Chocolate, cuando existe override exacto, entonces resuelve a Chocolates (mismo resultado que cat-override, pero por exacto)", () => {
      expect(resolveCategory("HGOURMET", "Chocolate", V1_RULES, "v1")).toBe("Chocolates");
    });

    it("Dado que dept=Insumos y cat=Lacteos, entonces resuelve a Insumos por override exacto", () => {
      expect(resolveCategory("Insumos", "Lacteos", V1_RULES, "v1")).toBe("Insumos");
    });
  });

  describe("Criterio 4 — UNMAPPED cuando ninguna regla aplica", () => {
    it("Dado que el departamento y categoria son desconocidos, entonces retorna UNMAPPED", () => {
      expect(resolveCategory("NuevoDept", "NuevaCat", V1_RULES, "v1")).toBe("UNMAPPED");
    });

    it("Dado que la version de mapeo no coincide, entonces retorna UNMAPPED", () => {
      expect(resolveCategory("Insumos", "Chocolate", V1_RULES, "v2")).toBe("UNMAPPED");
    });

    it("Dado que la regla está inactiva, entonces no se aplica y retorna UNMAPPED", () => {
      const rulesWithInactive: MappingRule[] = [
        { mapping_version: "v1", departamento_raw: "moldes", categoria_raw: "*", curated_category: "Moldes", priority: 10, is_active: false },
      ];
      expect(resolveCategory("Moldes", "Aluminio", rulesWithInactive, "v1")).toBe("UNMAPPED");
    });
  });

  describe("Criterio 5 — Versionado permite coexistir V1 y V2 sin romper historial", () => {
    it("Dado que existen reglas V1 y V2, cuando se resuelve con V1, entonces solo aplican reglas V1", () => {
      const mixedRules: MappingRule[] = [
        ...V1_RULES,
        // V2 reclasifica Refrigeracion -> Bases (hipotético)
        { mapping_version: "v2", departamento_raw: "refrigeracion", categoria_raw: "*", curated_category: "Bases", priority: 10, is_active: true },
      ];
      expect(resolveCategory("Refrigeracion", "Queso", mixedRules, "v1")).toBe("Insumos");
      expect(resolveCategory("Refrigeracion", "Queso", mixedRules, "v2")).toBe("Bases");
    });
  });

  describe("Criterio 6 — Separación staging/dominio (documental)", () => {
    it("los campos del CSV que van a staging pero NO a products están identificados", () => {
      // Este test documenta la intención del diseño: los campos de staging
      // no deben aparecer en la tabla products del dominio.
      const stagingOnlyFields = [
        "departamento", "categoria", "inventariable", "unidad",
        "costo", "precio1", "imp_iva_8", "imp_iva_16", "granel", "existencia",
      ];
      const domainFields = [
        "sku", "barcode", "name", "price", "sat_code", "image_url",
        "category_id", "is_available", "is_visible",
      ];
      // Ningún campo de staging debe estar en dominio
      const overlap = stagingOnlyFields.filter((f) => domainFields.includes(f));
      expect(overlap).toHaveLength(0);
    });
  });
});
