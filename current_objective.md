# Objective: HU-4.1 — Pagina principal con banners rotativos y secciones destacadas

## Context
- **Feature:** FEAT-4 — Contenido y Marketing Digital
- **Story:** Como visitante del sitio, quiero ver una homepage clara, atractiva y bien estructurada, para poder ubicar rapidamente productos, categorias y propuestas de valor de HGourmet.
- **Spec Level:** Lite
- **Git Strategy:** trunk (work continues on `main`)
- **TDD Mode:** flexible (`IMPLEMENT → TEST → REFACTOR`)

## Validation Gate (Step 0 - @validate)

### Validation Report
=== VALIDATION REPORT ===
Target: HU-4.1 — Pagina principal con banners rotativos y secciones destacadas
Level: Standard (Simple Story)

✅ PRD: Vision, users, MVP IN/OUT and KPIs are complete.
✅ TECH_SPEC: Stack, Data Model, Authentication and RLS are complete.
✅ FEAT-4: Benefit hypothesis and HU linkage are complete.
✅ HU-4.1: C/Q/P format + 3 BDD scenarios including error path are present.
⚠️ HU-4.1: "Paridad visual" language is partially subjective; convert to observable checks in implementation tests/checklist.

RESULT: WARNINGS
ACTION: Proceed to planning and implementation. No BLOCKER found.

## Acceptance Criteria (BDD)

### Escenario 1: Homepage estable en multiples dispositivos
- **Dado que** ingreso a la homepage desde movil o desktop,
- **Cuando** carga la pagina,
- **Entonces** visualizo hero, banners activos y secciones destacadas sin errores de layout.

### Escenario 2: Render de banners segun estado y orden
- **Dado que** existen banners administrados en panel,
- **Cuando** se renderiza el carrusel,
- **Entonces** solo se muestran los banners activos y en el orden configurado.

### Escenario 3: Cierre de brecha visual de confianza (error UX)
- **Dado que** un visitante no encuentra senales claras de confianza,
- **Cuando** se evalua la paridad visual final contra Lovable,
- **Entonces** se incorporan o ajustan bloques de valor para cerrar la brecha respecto al diseno objetivo.

## Implementation Plan

### Task 1: Baseline visual + component map for homepage (~30 min)
- **Type:** [SC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(storefront)/page.tsx`, `src/components/storefront/HomepageHero.tsx`, `src/components/storefront/BannerCarousel.tsx`, `src/components/storefront/CategoryShowcase.tsx`, `src/components/storefront/BrandSection.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/homepage.test.tsx`

### Task 2: Unify Hero + active banners into one carousel surface (~45 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/storefront/BannerCarousel.tsx`, `src/components/storefront/HomepageHero.tsx`, `src/app/(storefront)/page.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/homepage.test.tsx`

### Task 3: Restore heading hierarchy and mixed-accent typography parity (~35 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/storefront/ProductSection.tsx`, `src/components/storefront/CategoryShowcase.tsx`, `src/components/storefront/BrandSection.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/homepage.test.tsx`

### Task 4: Add trust-value block "Por que elegirnos" on homepage (~45 min)
- **Type:** [SC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/storefront/WhyChooseSection.tsx` (new), `src/app/(storefront)/page.tsx`, `src/tests/integration/homepage.test.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/homepage.test.tsx`

### Task 5: Remove white-card artifact on category images (~45 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/storefront/CategoryImage.tsx`, `src/components/storefront/CategoryShowcase.tsx`, `src/components/storefront/CategoryCard.tsx` (if shared style is affected)
- **Verification:** `npm run test:run -- src/tests/integration/hu-1.5-scenarios.test.tsx`

### Task 6: Validate responsive visual consistency (desktop + mobile smoke) (~35 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/tests/integration/homepage.test.tsx`
- **Verification:** `npm run test:run -- src/tests/integration/homepage.test.tsx`

### Task 7: Final quality gate and build integrity (~20 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** none (repo-wide verification)
- **Verification:** `npm run lint && npm run test:run && npm run build`

## Database Changes
- No database changes required.
- No RLS or migration updates required.

## Infrastructure Prerequisites
- None. This objective does not require new buckets, env vars, or external services.

## Manual Testing Checklist
- [ ] Open `/` on desktop and verify a single hero/carrusel region is rendered above categories.
- [ ] With active banners in admin, verify hero appears as first slide and banners follow configured order.
- [ ] With no active banners, verify homepage shows only hero (no duplicate banner section below).
- [ ] Verify section title styling parity against target prototype (accent word + hierarchy) for:
  - [ ] "Nuestras Categorias"
  - [ ] "Lo mas vendido"
  - [ ] "Productos de temporada"
  - [ ] "Nuestras marcas"
  - [ ] "Por que elegirnos?"
- [ ] Verify category images do not show white rectangular artifact and blend correctly with card background.
- [ ] Verify "Por que elegirnos?" shows 3 trust cards with icon + title + descriptive copy.
- [ ] Smoke test mobile breakpoints (375px and 768px) for layout integrity (no overlap, clipping, or overflow).

## Definition of Done
- [ ] All BDD criteria have passing tests.
- [ ] No TypeScript errors.
- [ ] No RLS changes required (N/A confirmed).
- [ ] CHANGELOG entry drafted.
- [ ] All changes committed with `feat(HU-4.1):` convention.
- [ ] Tag `HU-4.1` created.
