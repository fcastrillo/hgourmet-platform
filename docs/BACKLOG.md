# Product Backlog

> **Project:** hgourmet-platform
> **Last updated:** 2026-02-22
>
> This is the **Single Source of Truth** for the SAFe hierarchy.
> Structure: Epic → Feature (FEAT-N) → User Story (HU-N.M)

---

## Epic: HGourmet — Tienda Virtual MVP

> Trasladar la experiencia de compra de HGourmet a un canal digital que reduzca la dependencia del local físico, mantenga el volumen de ventas y posicione la marca como tienda gourmet de confianza en Mérida.

---

### FEAT-1: Catálogo Digital de Productos

> Estimate: L (rollup) | 4 stories: 2×M + 2×S, esfuerzo total ~5–7 días.

- **Hypothesis:** Si entregamos un catálogo digital navegable por categorías con fichas de producto completas (imagen, precio, disponibilidad), entonces los clientes de HGourmet podrán consultar productos de forma autónoma sin visitar la tienda física ni preguntar por WhatsApp, medido por ≥500 usuarios únicos y ≥300 productos publicados en el primer mes.
- **Status:** Delivered ✅ (2026-02-21)
- **Priority:** High
- **Stories:**
  - [x] HU-1.1: Navegación por categorías de productos (High) ✅ (2026-02-21)
    > Estimate: M | Story fundacional: setup DB (migración, RLS, índices), Supabase client, 2 páginas, ProductCard reutilizable, responsive grid, empty states. ~2–3 días.
  - [x] HU-1.2: Ficha de detalle de producto (High) ✅ (2026-02-21)
    > Estimate: S | 1 página de detalle con generateMetadata (SEO/OG), breadcrumb, CTA WhatsApp. Reutiliza infraestructura de HU-1.1. ~4–8 horas.
  - [x] HU-1.3: Búsqueda y filtrado de productos (Medium) ✅ (2026-02-22)
    > Estimate: M | Barra de búsqueda CC con debounce, filtro por categoría, coordinación de estados, decisión ilike vs full-text search. ~1–2 días.
  - [x] HU-1.4: Sección "Lo más vendido" y "Productos de temporada" (Medium) ✅ (2026-02-21)
    > Estimate: S | 2 secciones con componente genérico, queries filtradas por is_featured/is_seasonal, reutiliza ProductCard. ~3–6 horas.

---

### FEAT-2: Panel de Administración

- **Hypothesis:** Si entregamos un panel de administración intuitivo con gestión de productos y carga CSV, entonces las dueñas podrán mantener el catálogo actualizado de forma autónoma (sin soporte técnico) con una capacitación de ≤2 horas, medido por la capacidad de agregar/editar/ocultar productos sin asistencia externa.
- **Status:** In Progress
- **Priority:** High
- **Stories:**
  - [ ] HU-2.1: Autenticación de administradoras (High)
    > Estimate: Pending | Login con Supabase Auth (email+password), middleware de protección `/admin/*`, sesión server-side con `@supabase/ssr`, logout. ~1–2 días.
  - [ ] HU-2.2: CRUD de productos desde el panel (High)
    > Estimate: Pending | Lista con paginación/búsqueda, formulario de creación/edición con upload de imagen a Supabase Storage, slug automático, toggles de visibilidad/featured/seasonal, eliminación con confirmación. ~3–4 días.
  - [ ] HU-2.3: Importación masiva de productos vía CSV (High)
    > Estimate: Pending | Sección de importación con template descargable, parsing client-side, previsualización, validación por fila, importación parcial, reporte de errores, idempotencia por SKU. ~2–3 días.
  - [ ] HU-2.4: Gestión de categorías (Medium)
    > Estimate: Pending | CRUD de categorías, reordenamiento (drag & drop o controles), slug automático, protección FK contra eliminación con productos asociados. ~1–2 días.
  - [ ] HU-2.5: Gestión de banners rotativos (Medium)
    > Estimate: Pending | CRUD de banners con upload de imagen a `banner-images`, reordenamiento, toggle activo/inactivo, integración con carrusel del storefront. ~1–2 días.
  - [ ] HU-2.6: Gestión de marcas/proveedores (Low)
    > Estimate: Pending | CRUD de marcas con upload de logo a `brand-logos`, reordenamiento, toggle activo/inactivo. ~0.5–1 día.

---

### FEAT-3: Canal de Comunicación y Conversión WhatsApp

- **Hypothesis:** Si entregamos un canal de comunicación integrado con WhatsApp y redes sociales desde cada punto del catálogo, entonces los clientes podrán pasar de la consulta al pedido en un solo clic, medido por ≥50 pedidos confirmados vía WhatsApp originados desde la web en el primer mes.
- **Status:** Pending
- **Priority:** High
- **Stories:**
  - [ ] HU-3.1: Botón fijo de WhatsApp en todo el sitio
  - [ ] HU-3.2: CTA "Pide por WhatsApp" con contexto de producto
  - [ ] HU-3.3: Página de contacto (WhatsApp, redes, horarios, mapa)

---

### FEAT-4: Contenido y Marketing Digital

- **Hypothesis:** Si entregamos herramientas de contenido (banners, recetas, boletín), entonces HGourmet podrá atraer tráfico recurrente y construir una base de suscriptores para comunicación directa, medido por ≥100 suscriptores al boletín y ≥80% de feedback positivo en el primer trimestre.
- **Status:** Pending
- **Priority:** Medium
- **Stories:**
  - [ ] HU-4.1: Página principal con banners rotativos y secciones destacadas
  - [ ] HU-4.2: Registro al boletín informativo
  - [ ] HU-4.3: Sección de recetas y tips
  - [ ] HU-4.4: Sección de marcas HGourmet (logos de proveedores)

---

## Completed

> Stories and Features move here when finished via `@finish-objective`.

- [x] HU-1.1: Navegación por categorías de productos ✅ (2026-02-21) — FEAT-1
- [x] HU-1.2: Ficha de detalle de producto ✅ (2026-02-21) — FEAT-1
- [x] HU-1.3: Búsqueda y filtrado de productos ✅ (2026-02-22) — FEAT-1
- [x] HU-1.4: Sección "Lo más vendido" y "Productos de temporada" ✅ (2026-02-21) — FEAT-1
- [x] **FEAT-1: Catálogo Digital de Productos** ✅ (2026-02-21) — 4/4 stories delivered
