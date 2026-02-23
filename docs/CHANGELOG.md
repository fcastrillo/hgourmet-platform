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

## [2026-02-23] — HU-4.3: Sección de recetas y tips

**Feature:** FEAT-4 — Contenido y Marketing Digital
**Benefit:** Los clientes de HGourmet pueden explorar un catálogo de recetas de repostería con ingredientes, pasos numerados y tips, todo desde el storefront público. El contenido publicado por las administradoras en el panel admin aparece inmediatamente en `/recetas` con paridad visual ≥90% respecto al prototipo de diseño.
**Changes:**
- Página `/recetas` con grid responsive (1/2/3 columnas) de `RecipeCard` con imagen `aspect-video`, excerpt y CTA dorado.
- Página `/recetas/[slug]` con hero panorámico, breadcrumb, ingredientes con ícono checkmark, pasos numerados en círculo dorado y card "Tip HGourmet" con fondo/borde dorado.
- `RecipeCard` [SC] con hover suave (sombra + escala imagen + color título).
- `not-found.tsx` para slugs inválidos o recetas despublicadas.
- Parser de Markdown (`recipe-parser.ts`) que extrae `## Ingredientes`, `## Preparación` y `## Tip HGourmet` con fallback seguro para contenido no estructurado.
- Query helpers tipados (`fetchPublishedRecipes`, `fetchPublishedRecipeBySlug`) siguiendo ADR-005.
- SEO completo: `generateMetadata` con Open Graph en el detalle.
- ADR-011: SVG Size Safety (atributos nativos `width`/`height` como doble seguro en Tailwind 4).
**Tests:** 17 nuevos tests (suite `hu-4.3-scenarios`) — total acumulado: 257

---

## [2026-02-23] — HU-2.8: Gestión de recetas desde el panel

**Feature:** FEAT-2 — Panel de Administración  
**Benefit:** Las administradoras pueden gestionar recetas de forma autónoma (crear, editar, publicar/despublicar, reordenar y eliminar) con carga de imagen a Storage y validaciones, dejando listo el backend para que HU-4.3 consuma el contenido en el storefront.  
**Changes:**
- CRUD de recetas en `/admin/recetas` con páginas de crear y editar.
- `RecipeTable` con estándar ADR-009 (icon buttons, toggle inline optimista, reordenamiento con controles).
- `RecipeForm` con textarea Markdown, validación de campos obligatorios y upload de portada a `recipe-images`.
- Server Actions y query helpers dedicados para `recipes`.
- Migración `004_recipes.sql` con `display_order`, índices y políticas RLS.
- Suite de integración `hu-2.8-scenarios` con cobertura BDD de flujo admin y edge cases.
**Tests:** 27 nuevos tests (1 suite: `hu-2.8-scenarios`) — total acumulado: 240

---

## [2026-02-23] — CHORE-1: Sprint Cosmético del Storefront

**Type:** Chore (Visual Polish)
**Benefit:** El storefront de HGourmet tiene ahora una presencia visual profesional: logo real de marca, hero inmersivo con imagen de repostería, navegación limpia (4 links + iconos), sección "Nuestras Categorías" decorativa, y títulos con palabra accent destacada. El hero es permanente (identidad de marca) y los banners se posicionan debajo como contenido promocional.
**Changes:**
- Logo real (`next/image`) en header (~40px) y footer (~60px, filtro invert para fondo oscuro)
- Hero full-bleed con imagen de fondo, overlay oscuro, logo monograma, copy aspiracional y CTA accent
- Nav desktop reestructurado: 4 links fijos (Inicio, Catálogo, Recetas, Contacto) + iconos búsqueda/usuario
- MobileNav reestructurado: 4 links principales + sub-sección categorías
- Componente `CategoryShowcase` con cards decorativas (emoji, nombre, conteo, hover effects)
- Query helper `fetchCategoriesWithCount` extraído a módulo reutilizable
- `ProductSection` con prop `accentWord` para títulos con palabra destacada en color primary
- Footer ampliado: logo, 4 links de navegación, transiciones consistentes
- Hero siempre visible + BannerCarousel como sección secundaria (ya no either/or)
**Tests:** 213 passing (0 new, 7 updated) — total acumulado: 213

---

## [2026-02-22] — HU-2.6: Gestión de marcas/proveedores

**Feature:** FEAT-2 — Panel de Administración
**Benefit:** Las administradoras pueden gestionar la lista de marcas y proveedores desde el panel (crear, editar, reordenar, activar/desactivar, eliminar), con upload de logos a Supabase Storage. Las marcas activas se muestran automáticamente en la sección "Nuestras Marcas" de la homepage, con enlaces opcionales al sitio web de cada marca.
**Changes:**
- Migración SQL `003_brands.sql`: tabla `brands` con RLS (anon lee solo activas, auth acceso completo)
- Storage bucket `brand-logos` con políticas de acceso (documentado en SETUP.md sección 5.4)
- Query helpers: `fetchActiveBrands` (storefront), `fetchAllBrandsAdmin`, `fetchBrandByIdAdmin`, `fetchMaxBrandDisplayOrder` (admin)
- 5 Server Actions: `createBrand` (con logo upload), `updateBrand` (con reemplazo de logo), `deleteBrand` (con limpieza de logo), `toggleBrandActive` (inline), `reorderBrands` (batch)
- `BrandTable` [CC] con ADR-009 (icon buttons, optimistic toggle, responsive desktop/mobile)
- `BrandForm` [CC] con upload de logo, preview, validación de nombre obligatorio, toggle is_active (ADR-010)
- `DeleteBrandDialog` [CC] con confirmación por nombre
- 3 páginas admin: lista (`/admin/marcas`), crear (`/admin/marcas/nuevo`), editar (`/admin/marcas/[id]/editar`)
- `BrandSection` [SC] en homepage: grilla responsive de logos con fallback a nombre si no hay logo
- Dashboard: cards de Marcas y Banners activadas (`ready: true`)
**Tests:** 24 nuevos tests (1 suite: hu-2.6-scenarios) — total acumulado: 211

---

## [2026-02-22] — HU-2.5: Gestión de banners rotativos

**Feature:** FEAT-2 — Panel de Administración
**Benefit:** Las administradoras pueden crear, editar, reordenar y activar/desactivar banners promocionales desde el panel. La página principal muestra un carrusel interactivo con auto-play y navegación por puntos que se alimenta de los banners activos, eliminando la necesidad de soporte técnico para mantener la portada actualizada con promociones y novedades.
**Changes:**
- Migración SQL `002_banners.sql`: tabla `banners` con RLS (anon lee solo activos, auth acceso completo)
- Storage bucket `banner-images` con políticas de acceso
- Query helpers: `fetchActiveBanners` (storefront), `fetchAllBannersAdmin`, `fetchBannerByIdAdmin`, `fetchMaxBannerDisplayOrder` (admin)
- 5 Server Actions: `createBanner` (con image upload), `updateBanner` (con reemplazo de imagen), `deleteBanner` (con limpieza de imagen), `toggleBannerActive` (inline), `reorderBanners` (batch)
- `BannerTable` [CC] con ADR-009 (icon buttons, optimistic toggle, responsive desktop/mobile)
- `BannerForm` [CC] con upload de imagen, preview, validación, toggle is_active (ADR-010)
- `DeleteBannerDialog` [CC] con confirmación por título
- 3 páginas admin: lista (`/admin/banners`), crear (`/admin/banners/nuevo`), editar (`/admin/banners/[id]/editar`)
- `BannerCarousel` [CC] con auto-play, dot navigation, pause on hover, link wrapping
- Integración en homepage: carrusel si hay banners activos, fallback a `HomepageHero` si no
**Tests:** 23 nuevos tests (1 suite: hu-2.5-scenarios) — total acumulado: 187

---

## [2026-02-22] — HU-2.2: CRUD de productos desde el panel

**Feature:** FEAT-2 — Panel de Administración
**Benefit:** Las administradoras pueden crear, editar, ocultar y eliminar productos del catálogo directamente desde el panel de administración, con upload de imágenes a Supabase Storage, slugs automáticos, paginación server-side y búsqueda. La gestión del catálogo es completamente autónoma sin soporte técnico.
**Changes:**
- Query helpers server-side: `fetchProductsAdmin` (paginados con búsqueda), `fetchProductsCountAdmin`, `fetchProductByIdAdmin`
- 4 Server Actions: `createProduct` (slug auto + image upload), `updateProduct` (con reemplazo de imagen), `deleteProduct` (con limpieza de imagen), `toggleProductVisibility` (inline)
- `ProductTable` [CC] con búsqueda debounced, paginación URL-driven, ADR-009 icon actions, toggle optimista de visibilidad
- `ProductForm` [CC] con upload de imagen integrado (preview, validación tipo/tamaño), 4 toggles (available, visible, featured, seasonal), preview de slug
- `DeleteProductDialog` [CC] con confirmación por nombre del producto
- 3 páginas Server Component: lista (`/admin/productos`), crear (`/admin/productos/nuevo`), editar (`/admin/productos/[id]/editar`)
- ADR-010: React state-driven toggle styling (Tailwind 4 `peer-checked` incompatibility fix)
**Tests:** 29 nuevos tests (1 suite: hu-2.2-scenarios) — total acumulado: 164

---

## [2026-02-22] — HU-2.7: Icon buttons y toggle inline en CategoryTable

**Feature:** FEAT-2 — Panel de Administración
**Benefit:** Las administradoras pueden activar/desactivar categorías con un solo clic directamente desde la tabla, sin abrir modales. Los botones de acción compactos (iconos con tooltip) reducen el espacio visual y agilizan la gestión. Este patrón se convierte en el estándar UI para todas las tablas de administración futuras (ADR-009).
**Changes:**
- Server Action `toggleCategoryActive` para cambio inline de `is_active` sin pasar por el formulario completo
- Icon buttons con Heroicons outline (pencil, eye/eye-slash, trash) y tooltip nativo (`title`) en tabla desktop
- Toggle inline con actualización optimista (`useTransition` + `activeOverrides` state) — feedback visual inmediato sin esperar respuesta del servidor
- Mobile: icon buttons con label visible y targets de toque de 44px
- Accesibilidad: `aria-label` en todos los botones de acción (Editar, Activar/Desactivar, Eliminar)
- ADR-009: Admin Table UI Standard — establece convenciones para futuras tablas
**Tests:** 12 nuevos tests (total 32 en suite hu-2.4-scenarios) — total acumulado: 137

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
