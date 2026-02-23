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

## Database Changes

> No database changes needed — purely visual/CSS work.

## Manual Testing Checklist

- [ ] Logo visible en header (desktop + mobile)
- [ ] Logo visible en footer
- [ ] Hero muestra imagen de fondo con overlay y copy (cuando no hay banners)
- [ ] Nav desktop: 4 links + 2 iconos, sin categorías inline
- [ ] Nav mobile: menú hamburguesa con 4 links + sub-sección categorías
- [ ] Sección "Nuestras Categorías" visible debajo del hero/banner
- [ ] Cards de categorías con hover effect
- [ ] Spacing uniforme entre secciones del homepage
- [ ] Títulos con palabra accent destacada
- [ ] Responsive: todo funciona en mobile, tablet y desktop

## Definition of Done

- [x] All visual criteria verified manually
- [x] No TypeScript errors
- [x] Existing tests still pass (213/213)
- [ ] Manual testing checklist verified
- [ ] CHANGELOG entry drafted
