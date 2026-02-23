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

### Task 1: Integración del logo (~20 min)

- **Type:** [CC] (Image component)
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `public/images/logo.png` — copiar desde briefs/lovable-prototype
  - `src/components/storefront/Header.tsx` — reemplazar texto por `<Image>`
  - `src/components/storefront/Footer.tsx` — agregar logo
- **Verification:** `npm run dev` → verificar logo visible en header y footer

### Task 2: Hero con imagen de fondo (~40 min)

- **Type:** [SC] (Server Component)
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `public/images/hero-bg.jpg` — copiar desde briefs/lovable-prototype
  - `src/components/storefront/HomepageHero.tsx` — rediseñar con imagen de fondo, overlay, copy
- **Verification:** `npm run dev` → hero full-bleed con imagen, overlay y CTA

### Task 3: Reestructurar navegación del Header (~45 min)

- **Type:** [CC] (Client interactivity en MobileNav)
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/components/storefront/Header.tsx` — 4 links fijos + 2 iconos
  - `src/components/storefront/MobileNav.tsx` — misma estructura + sub-sección categorías
  - `src/app/(storefront)/layout.tsx` — ajustar props si necesario
- **Verification:** `npm run dev` → nav desktop con 4 links + iconos, mobile con menú reestructurado

### Task 4: Sección "Nuestras Categorías" (~45 min)

- **Type:** [SC] (Server Component)
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/components/storefront/CategoryShowcase.tsx` — nuevo componente decorativo
  - `src/app/(storefront)/page.tsx` — insertar entre hero y ProductSections
- **Verification:** `npm run dev` → sección con grid de categorías estilizadas

### Task 5: Polish general (~30 min)

- **Type:** [CC/SC] (mixed)
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/components/storefront/Footer.tsx` — logo + links Recetas/Contacto
  - `src/components/storefront/ProductSection.tsx` — título con palabra accent
  - `src/app/globals.css` — tokens si necesario
  - `src/app/(storefront)/page.tsx` — spacing entre secciones
- **Verification:** `npm run dev` → verificación visual completa del homepage

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

- [ ] All visual criteria verified manually
- [ ] No TypeScript errors
- [ ] Existing tests still pass (update if structure changed)
- [ ] Manual testing checklist verified
- [ ] CHANGELOG entry drafted
