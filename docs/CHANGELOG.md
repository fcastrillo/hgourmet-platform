# Changelog

> Benefit-oriented history of delivered value.
> Each entry traces back to a User Story and its parent Feature.

---

## Format

```
## [YYYY-MM-DD] — HU-N.M: [Story Title]

**Feature:** FEAT-N — [Feature Name]
**Benefit:** [What value was delivered to the user]
**Changes:**
- [Summary of what was built/changed]
**Tests:** [Number of tests added]
```

---

## [2026-02-22] — HU-1.3: Búsqueda y filtrado de productos

**Feature:** FEAT-1 — Catálogo Digital de Productos
**Benefit:** Los clientes pueden buscar productos por nombre o descripción y filtrar por categoría directamente desde el catálogo, encontrando lo que necesitan en segundos sin navegar manualmente por todas las categorías.
**Changes:**
- Barra de búsqueda `[CC]` con debounce de 300ms en la página `/categorias`
- Filtro por categoría con chips horizontales scrollables en mobile
- Componente orquestador `SearchableProductCatalog` que combina búsqueda + filtro + grid de resultados
- Query helper `searchProducts` usando browser Supabase client con `ilike` en name/description
- Hook genérico `useDebounce` reutilizable
- Estado "sin resultados" con mensaje amigable y enlaces a categorías
- ADR-007: Client-Side Data Fetching for Interactive Features
**Tests:** 19 nuevos tests (3 suites: SearchBar, CategoryFilter, hu-1.3-scenarios) — total acumulado: 83

---

## [2026-02-21] — HU-1.2: Ficha de detalle de producto

**Feature:** FEAT-1 — Catálogo Digital de Productos
**Benefit:** Los clientes pueden ver la información completa de cualquier producto (imagen, precio, descripción, disponibilidad) y contactar directamente por WhatsApp con el nombre del producto pre-compuesto en el mensaje — todo desde una URL amigable e indexable por Google.
**Changes:**
- Página `/productos/[slug]` con Server Component, `generateMetadata` (SEO + Open Graph), y `generateStaticParams` omitido intencionalmente (SSR on-demand para catálogo dinámico)
- Componente `Breadcrumb` [SC] accesible con `aria-current="page"` en el ítem activo
- Componente `WhatsAppCTA` [CC] con mensaje pre-compuesto dinámico y estado `disabled` para productos agotados
- Helper `fetchProductBySlug` con join a `categories` (ADR-005: typed assertion)
- Página `not-found.tsx` con mensaje amigable y link al catálogo
- ADR-006: colores de marca de terceros (WhatsApp, social) via `style` inline
**Tests:** 28 nuevos tests (3 suites: `hu-1.2-scenarios`, `Breadcrumb`, `WhatsAppCTA`) — total acumulado: 64

---

## [2026-02-21] — HU-1.1: Navegación por categorías de productos

**Feature:** FEAT-1 — Catálogo Digital de Productos
**Benefit:** Los clientes pueden explorar el catálogo de HGourmet por categorías, ver productos con precios y disponibilidad, e identificar rápidamente productos agotados — todo desde cualquier dispositivo.
**Changes:**
- Scaffolded Next.js 15 project with TypeScript, TailwindCSS 4, and Supabase integration
- Created database schema (categories + products) with RLS policies and seed data
- Built storefront layout with responsive header (desktop nav + mobile hamburger), footer, and category navigation
- Implemented `/categorias` listing page with product counts per category
- Implemented `/categorias/[slug]` detail page with product grid, empty states, and 404 handling
- Created reusable components: ProductCard, CategoryCard, CategoryNotFound, HomepageHero
- Added homepage with hero section and CTA to catalog
- SEO metadata on all pages via generateMetadata
**Tests:** 36 integration tests across 7 test suites
