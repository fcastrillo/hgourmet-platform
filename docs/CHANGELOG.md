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

## [2026-02-22] — HU-2.4: Gestión de categorías

**Feature:** FEAT-2 — Panel de Administración
**Benefit:** Las administradoras pueden crear, editar, reordenar y ocultar categorías del catálogo desde el panel, organizando la navegación del storefront sin intervención técnica. La protección FK impide eliminar categorías con productos asociados, evitando pérdida de datos accidental.
**Changes:**
- Utilidad `slugify()` reutilizable para generación automática de slugs URL-friendly
- Queries admin server-side: `fetchAllCategoriesAdmin` (con conteo de productos), `fetchCategoryByIdAdmin`, `fetchMaxDisplayOrder`
- 4 Server Actions: `createCategory` (slug auto + display_order MAX+1), `updateCategory`, `deleteCategory` (con validación FK), `reorderCategories`
- Página `/admin/categorias` [SC] con tabla desktop + cards mobile responsive
- `CategoryFormModal` [CC] con preview de slug en tiempo real y toggle is_active
- `DeleteCategoryDialog` [CC] con protección FK: muestra conteo de productos y bloquea eliminación
- Controles ▲/▼ para reordenamiento sin drag & drop (accesible y simple)
- Dashboard actualizado: tarjeta de Categorías muestra "Gestionar →" en lugar de "Próximamente →"
**Tests:** 22 nuevos tests (1 suite: hu-2.4-scenarios) — total acumulado: 125

---

## [2026-02-22] — HU-2.1: Autenticación de administradoras

**Feature:** FEAT-2 — Panel de Administración
**Benefit:** Las administradoras de HGourmet pueden acceder de forma segura al panel de gestión mediante Magic Link (Email OTP), sin necesidad de recordar contraseñas. Las rutas `/admin/*` están protegidas y el storefront público permanece accesible sin autenticación.
**Changes:**
- Middleware de Next.js para refresh de sesión Supabase en cada request y protección de rutas `/admin/*`
- Página de login con formulario de email y flujo de Magic Link (`signInWithOtp`)
- Route handler `/auth/callback` para intercambio de código OTP por sesión
- Admin layout con sidebar de navegación (Dashboard, Productos, Categorías, Banners, Marcas) y botón de cerrar sesión
- Dashboard placeholder con tarjetas de secciones futuras
- Server Action `signOut` para invalidar sesión
- ADR-008: Email OTP (Magic Link) for Admin Authentication
**Tests:** 10 nuevos tests (1 suite: hu-2.1-scenarios) — total acumulado: 103

---

## [2026-02-21] — HU-1.4: Sección "Lo más vendido" y "Productos de temporada"

**Feature:** FEAT-1 — Catálogo Digital de Productos
**Benefit:** Los clientes pueden descubrir rápidamente los productos más populares y las novedades estacionales desde la página principal, sin necesidad de buscar manualmente por categorías. Cada sección enlaza a una vista completa con todos los productos de ese tipo.
**Changes:**
- Componente genérico `ProductSection` [SC] reutilizable para ambas secciones (featured y seasonal), con lógica de ocultamiento cuando no hay productos
- 4 query helpers server-side: `fetchFeaturedProducts`, `fetchSeasonalProducts` (limitadas para homepage) y variantes `fetchAll*` (sin límite para páginas "Ver todos")
- Homepage integrado con secciones "Lo más vendido" y "Productos de temporada" con fetch concurrente via `Promise.all`
- Páginas `/productos/destacados` y `/productos/temporada` con breadcrumb, SEO metadata y empty state
- Grid responsive: 2 columnas mobile, 3 tablet, 4 desktop
**Tests:** 10 nuevos tests (1 suite: hu-1.4-scenarios) — total acumulado: 93

---

## [2026-02-21] — FEAT-1: Catálogo Digital de Productos ✅

**Benefit:** El catálogo completo de HGourmet está disponible en línea: navegación por categorías, fichas de producto con SEO, búsqueda con debounce, filtro por categoría, y secciones de productos destacados/temporada. 4/4 historias entregadas.
**Total Tests:** 93 integration tests across 14 suites

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
