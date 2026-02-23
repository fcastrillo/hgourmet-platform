# Objective: CHORE-1 — Sprint Cosmético del Storefront

## Context

- **Type:** Chore (Visual Polish) — fuera de jerarquía SAFe
- **Ref:** FEAT-1 delivered; polish visual antes de avanzar a FEAT-3/4
- **Spec Level:** Lite
- **TDD Mode:** flexible (IMPLEMENT → TEST → REFACTOR)
- **Estimated Duration:** ~3-4 horas (5 tareas)

## Acceptance Criteria (Visual)

### Scenario 1: Logo real en header y footer

- **Dado que:** el usuario accede a cualquier página del storefront
- **Cuando:** observa el header y el footer
- **Entonces:** ve el logo gráfico de HGourmet (no texto plano), con dimensiones adecuadas (~40px header, ~60px footer) y alt text accesible

### Scenario 2: Hero con imagen de fondo

- **Dado que:** el usuario accede al homepage sin banners activos
- **Cuando:** se renderiza el hero
- **Entonces:** ve una imagen de repostería a pantalla completa con overlay oscuro, título aspiracional, subtítulo y CTA "Explora nuestro catálogo"

### Scenario 3: Navegación reestructurada

- **Dado que:** el usuario accede al storefront en desktop
- **Cuando:** observa el header
- **Entonces:** ve 4 links principales (Inicio, Catálogo, Recetas, Contacto) y 2 iconos (búsqueda, usuario), sin categorías inline

### Scenario 4: Sección "Nuestras Categorías"

- **Dado que:** el usuario accede al homepage
- **Cuando:** hace scroll debajo del hero/banner
- **Entonces:** ve una sección "Nuestras Categorías" con cards decorativas (icono, nombre, conteo) en grid responsive, con hover effects

### Scenario 5: Polish general y consistencia

- **Dado que:** el usuario navega el storefront
- **Cuando:** interactúa con footer, secciones y transiciones
- **Entonces:** encuentra logo en footer, spacing uniforme entre secciones, hover effects consistentes y títulos con palabra accent destacada

## Implementation Plan

### Task 1: Integración del logo (~20 min) ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/storefront/Header.tsx`, `src/components/storefront/Footer.tsx`, `src/tests/integration/storefront-layout.test.tsx`, `public/images/logo.png`, `public/images/hero-bg.jpg`
- **Commit:** `9cbdb8c`

### Task 2: Hero con imagen de fondo (~40 min) ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/storefront/HomepageHero.tsx`, `src/tests/integration/homepage.test.tsx`
- **Commit:** `624aaaa`

### Task 3: Reestructurar navegación del Header (~45 min) ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/storefront/Header.tsx`, `src/components/storefront/MobileNav.tsx`, `src/tests/integration/storefront-layout.test.tsx`, `src/tests/integration/hu-1.1-scenarios.test.tsx`
- **Commit:** `29aba73`

### Task 4: Sección "Nuestras Categorías" (~45 min) ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/storefront/CategoryShowcase.tsx` (new), `src/lib/supabase/queries/categories.ts` (new), `src/app/(storefront)/page.tsx`, `src/app/(storefront)/categorias/page.tsx`
- **Commit:** `2fcb6b5`

### Task 5: Polish general (~30 min) ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/storefront/Footer.tsx`, `src/components/storefront/ProductSection.tsx`, `src/app/(storefront)/page.tsx`
- **Commit:** `c6f9bec`

## Completion

- **Date:** 2026-02-23
- **Estimated Duration:** ~3-4 horas (5 tareas)
- **Actual Duration:** ~10 min (11:09 → 11:19, AI-assisted)
- **Variance:** Estimated Medium (~3-4h), actual ~10 min — ~18-24x faster with AI assistance
- **Files modified:** 16 files (409 insertions, 114 deletions)
- **Tests added:** 0 new tests; 213 existing tests updated and passing

## Deviations & Decisions

- **Added:** 2 unplanned tasks during user review:
  - Hero + Banner coexistence: changed either/or to "Hero always visible + banners below" (commit `dcd4476`)
  - Banner carousel full-bleed alignment to match hero width (commit `c1a25a4`)
- **Added:** Extracted `fetchCategoriesWithCount` from inline query in `categorias/page.tsx` to reusable helper `src/lib/supabase/queries/categories.ts` (refactoring opportunity discovered during Task 4)
- **Changed:** None of the 5 planned tasks changed scope
- **Skipped:** None
- **Key Decisions:**
  - Hero as permanent brand anchor (never replaced by banners) — promotional banners are secondary, positioned below hero
  - `accentWord` prop pattern in `ProductSection` for highlighted title words
  - Emoji-based category icons via slug mapping (temporary until image_url field is added to categories)
- **Escalated ADRs:** None (all decisions are tactical/visual, no architectural impact)
- **Lesson:** Visual polish chores benefit from live user review after each task — the hero/banner coexistence issue was only visible in context, not in the plan.

## User Feedback — Backlog Candidates

During manual review, the user identified 3 items for future work:

1. **Categories with administrable images + visual homologation** (homepage vs catalog page) → proposed as HU-1.5 in FEAT-1
2. **Recipe admin module** → proposed as HU-2.8 in FEAT-2 (paired with existing HU-4.3 storefront)
3. **Contact form** → already covered by existing HU-3.3 in FEAT-3
