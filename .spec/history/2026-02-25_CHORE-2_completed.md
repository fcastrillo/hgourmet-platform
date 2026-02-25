# Objective: CHORE-2 — Sprint de polish final pre-demo

## Context
- **Track:** Chores (Technical / Visual)
- **Objective:** Como visitante del storefront, quiero una experiencia visual consistente con el prototipo en catálogo y recetas, para poder entender y navegar el contenido con mayor claridad y confianza antes de la demo.
- **Spec Level:** Lite
- **Git Strategy:** trunk (work continues on `main`)
- **TDD Mode:** flexible (`IMPLEMENT → TEST → REFACTOR`)

## Validation Gate (Step 0 - @validate style)

### Validation Report
=== VALIDATION REPORT ===
Target: CHORE-2 — Sprint de polish final pre-demo
Level: Standard (chore visual, excepción controlada a flujo HU-N.M)

✅ PRD: Vision, Users, MVP Scope y KPIs completos.
✅ TECH_SPEC: Stack, Data Model, Auth y RLS completos.
✅ BACKLOG: CHORE-2 existe y está priorizado para cierre post-funcional.
✅ current_objective: no hay objetivo activo previo.
⚠️ CHORE-2 no está modelado como HU formal; se define BDD verificable en este objetivo para mantener trazabilidad.

RESULT: WARNINGS
ACTION: Proceed to planning. No BLOCKER found.

## Acceptance Criteria (BDD)

### Escenario 1: Catálogo con jerarquía visual homologada
- **Dado que** ingreso a `/categorias` en desktop,
- **Cuando** renderiza el encabezado principal,
- **Entonces** visualizo título "Nuestro Catálogo" con palabra acentuada en color `accent` y spacing equivalente al patrón visual del prototipo.

### Escenario 2: Filtros de catálogo visibles y consistentes
- **Dado que** ingreso a `/categorias`,
- **Cuando** exploro el bloque de filtros,
- **Entonces** encuentro controles visibles para categoría, rango de precio y disponibilidad, con estado activo/inactivo claramente distinguible.

### Escenario 3: Título de recetas con acento visual correcto
- **Dado que** ingreso a `/recetas`,
- **Cuando** visualizo el encabezado de página,
- **Entonces** la palabra "Tips" usa `accent` (no `primary`) y mantiene contraste/jerarquía consistente con el resto del storefront.

## Implementation Plan

### Task 1: Definir layout objetivo de catálogo (header + zona de filtros) (~35 min)
- **Type:** [SC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(storefront)/categorias/page.tsx`, `src/components/storefront/SearchableProductCatalog.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/hu-1.3-scenarios.test.tsx`

### Task 2: Implementar sidebar visual de filtros (categoría, precio, disponibilidad) (~55 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/storefront/SearchableProductCatalog.tsx`, `src/components/storefront/CategoryFilter.tsx`, `src/components/storefront/SearchBar.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/hu-1.3-scenarios.test.tsx`

### Task 3: Homologar acento de títulos faltantes (Catálogo y Recetas) (~25 min)
- **Type:** [SC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(storefront)/categorias/page.tsx`, `src/app/(storefront)/recetas/page.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/hu-4.3-scenarios.test.tsx`

### Task 4: Ajustar spacing y ritmo vertical en catálogo/recetas (~35 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(storefront)/categorias/page.tsx`, `src/components/storefront/SearchableProductCatalog.tsx`, `src/app/(storefront)/recetas/page.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/homepage.test.tsx src/tests/integration/hu-1.3-scenarios.test.tsx`

### Task 5: Cobertura de regresión visual/funcional mínima (~45 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/tests/integration/hu-1.3-scenarios.test.tsx`, `src/tests/integration/hu-4.3-scenarios.test.tsx` (ajustes puntuales), `src/tests/integration/homepage.test.tsx` (si aplica)
- **Verification:** `npm run test:run`

### Task 6: Quality gate final de CHORE-2 (~20 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** none
- **Verification:** `npm run test:run && npx tsc --noEmit`

## Database Changes
- No database changes required.
- No RLS or migration updates required.

## Infrastructure Prerequisites
- None. This objective does not require new buckets, env vars, or external services.

## Manual Testing Checklist
- [x] En `/categorias`, confirmar título "Nuestro Catálogo" con palabra acentuada dorada.
- [x] Confirmar presencia visual de filtros: categoría, precio y disponibilidad.
- [x] Validar que los filtros mantienen estilo consistente en desktop y mobile.
- [x] En `/recetas`, confirmar `Recetas & Tips` con "Tips" en `accent`.
- [x] Revisar spacing vertical en encabezados y bloques (sin solapamientos/recortes).
- [x] Smoke test responsive en 375px, 768px y desktop.

## Definition of Done
- [x] All BDD criteria have passing tests.
- [x] No TypeScript errors.
- [x] No RLS changes required (N/A confirmed).
- [x] CHANGELOG entry drafted.
- [x] All changes committed with `chore(CHORE-2):` convention.
- [x] Tag `CHORE-2` created.

## Completion
- **Date:** 2026-02-25
- **Estimated Duration:** S (~4h)
- **Actual Duration:** ~20 min (from `11:44:05` to `12:03:48`, local git timestamps)
- **Variance:** Estimated ~4h vs actual ~20 min (~12x faster with AI-assisted iterative polish)
- **Files modified:** `src/app/(storefront)/categorias/page.tsx`, `src/app/(storefront)/recetas/page.tsx`, `src/app/globals.css`, `src/components/storefront/SearchableProductCatalog.tsx`, `src/lib/supabase/queries/search.ts`, `src/tests/integration/hu-1.3-scenarios.test.tsx`, `src/tests/setup.ts`
- **Tests added:** 0 new suites (regression updated in `hu-1.3-scenarios` and global test setup)

## Deviations & Decisions
- **Added:** Extensión funcional del query de búsqueda (`priceMax`, `availableOnly`) y hardening de compatibilidad mobile para estilos nativos de controles.
- **Changed:** La implementación de layout responsive evolucionó de utilidades Tailwind a estrategia runtime (`matchMedia` + inline style) para garantizar consistencia cross-browser.
- **Skipped:** No se modificaron `CategoryFilter.tsx` ni `SearchBar.tsx`; la orquestación de filtros quedó consolidada en `SearchableProductCatalog.tsx`.
- **Key Decisions:** Priorizar confiabilidad visual inmediata en navegador real sobre pureza de estilo utilitario cuando Tailwind/CSS mostró comportamiento inconsistente por dispositivo.
- **Escalated ADRs:** None
- **Lesson:** En polish visual pre-demo, validar temprano en navegador/dispositivo real reduce retrabajo frente a suposiciones de responsive.
