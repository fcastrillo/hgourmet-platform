# Product Backlog

> **Project:** hgourmet-platform
> **Last updated:** 2026-02-23
>
> This is the **Single Source of Truth** for the SAFe hierarchy.
> Structure: Epic → Feature (FEAT-N) → User Story (HU-N.M)

---

## Epic: HGourmet — Tienda Virtual MVP

> Trasladar la experiencia de compra de HGourmet a un canal digital que reduzca la dependencia del local físico, mantenga el volumen de ventas y posicione la marca como tienda gourmet de confianza en Mérida.

---

### FEAT-1: Catálogo Digital de Productos

> Estimate: L (rollup) | 5 stories: 2×M + 3×S, esfuerzo total ~6–8 días.

- **Hypothesis:** Si entregamos un catálogo digital navegable por categorías con fichas de producto completas (imagen, precio, disponibilidad), entonces los clientes de HGourmet podrán consultar productos de forma autónoma sin visitar la tienda física ni preguntar por WhatsApp, medido por ≥500 usuarios únicos y ≥300 productos publicados en el primer mes.
- **Status:** In Progress (4/5 stories delivered; HU-1.5 added as extension)
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
  - [ ] HU-1.5: Categorías con imagen administrable y visual homologado (Medium)
    > Estimate: S (~4–8h) | Migración: agregar `image_url` a tabla `categories`. Nuevo bucket `category-images` en Supabase Storage. Extender `CategoryFormModal` para upload de imagen. Unificar visualización entre `CategoryShowcase` (homepage) y `CategoryCard` (catálogo) para mostrar imagen real o fallback a icono. Depende de ENABLER-2.

---

### FEAT-2: Panel de Administración

- **Hypothesis:** Si entregamos un panel de administración intuitivo con gestión de productos y carga CSV, entonces las dueñas podrán mantener el catálogo actualizado de forma autónoma (sin soporte técnico) con una capacitación de ≤2 horas, medido por la capacidad de agregar/editar/ocultar productos sin asistencia externa.
- **Status:** In Progress (7/8 stories delivered)
- **Priority:** High
- **Stories:**
  - [x] HU-2.1: Autenticación de administradoras (High) ✅ (2026-02-22)
    > Estimate: S | Login con Magic Link (Email OTP), middleware de protección `/admin/*`, sesión server-side con `@supabase/ssr`, admin layout con sidebar, logout. ~1–2 días.
  - [x] HU-2.2: CRUD de productos desde el panel (High) ✅ (2026-02-22)
    > Estimate: M | Lista con paginación/búsqueda, formulario de creación/edición con upload de imagen a Supabase Storage, slug automático, toggles de visibilidad/featured/seasonal, eliminación con confirmación. ~3–4 días.
  - [ ] HU-2.3: Importación masiva de productos vía CSV (High)
    > Estimate: L (~2–3 días) | Parser client-side con mapeo `departamento+categoría CSV → categoría curada` (7 categorías). Limpieza de precios formato `$1,135.00` → `numeric`. Validación por fila con reporte de errores (duplicados SKU, precios inválidos, categoría no mapeada). Preview antes de importar. Upsert idempotente por SKU (`clave1`). Template descargable. Inventario real: 3,382 productos en 18 departamentos. Depende de ENABLER-2. Ver ADR-003 actualizado.
  - [x] HU-2.4: Gestión de categorías (Medium) ✅ (2026-02-22)
    > Estimate: S | CRUD de categorías, reordenamiento con controles ▲/▼, slug automático, protección FK contra eliminación con productos asociados. ~1 hora (AI-assisted).
  - [x] HU-2.5: Gestión de banners rotativos (Medium) ✅ (2026-02-22)
    > Estimate: M | CRUD de banners con upload de imagen a `banner-images`, reordenamiento, toggle activo/inactivo, integración con carrusel del storefront. ~4h (AI-assisted).
  - [x] HU-2.6: Gestión de marcas/proveedores (Low) ✅ (2026-02-22)
    > Estimate: S | CRUD de marcas con upload de logo a `brand-logos`, reordenamiento, toggle activo/inactivo, sección "Nuestras Marcas" en storefront. ~30 min (AI-assisted).
  - [x] HU-2.7: Icon buttons y toggle inline en CategoryTable (Low) ✅ (2026-02-22)
    > Estimate: XS | Reemplazar botones de texto por icon buttons con tooltip, agregar toggle de visibilidad inline (activar/desactivar sin modal), ajustar tests. ~30 min. Establece el estándar UI para futuras tablas admin (ADR-009).
  - [x] HU-2.8: Gestión de recetas desde el panel (Medium) ✅ (2026-02-23)
    > Estimate: S (~4–8h) | CRUD de recetas con textarea/editor Markdown, upload de imagen de portada a `recipe-images`, toggle publicar/despublicar, tabla con reordenamiento. Sigue estándar ADR-009. Paired con HU-4.3 (storefront).

---

### FEAT-3: Canal de Comunicación y Conversión WhatsApp

> Estimate: M (rollup) | 3 stories: 2×S + 1×XS, esfuerzo total ~1–2 días.

- **Hypothesis:** Si entregamos un canal de comunicación integrado con WhatsApp y redes sociales desde cada punto del catálogo, entonces los clientes podrán pasar de la consulta al pedido en un solo clic, medido por ≥50 pedidos confirmados vía WhatsApp originados desde la web en el primer mes.
- **Status:** Partially Delivered (HU-3.2 CTA ya existe en ficha de producto)
- **Priority:** High
- **Stories:**
  - [ ] HU-3.1: Botón fijo de WhatsApp en todo el sitio (High)
    > Estimate: XS (~1–2h) | Componente `WhatsAppFloatingButton` [CC] posicionado bottom-right fijo. Usa `SOCIAL_LINKS.whatsapp` de `constants.ts`. Icono WhatsApp con animación sutil. Se agrega al layout del storefront. Referencia: prototipo Lovable `WhatsAppButton.tsx`.
    - **Como:** Cliente navegando el sitio
    - **Quiero:** ver un botón flotante de WhatsApp siempre visible
    - **Para poder:** contactar a HGourmet desde cualquier página con un solo clic
  - [x] HU-3.2: CTA "Pide por WhatsApp" con contexto de producto (High) ✅ (2026-02-21)
    > Estimate: S | Componente `WhatsAppCTA` [CC] con deep link `wa.me/{number}?text={message}` incluyendo nombre y precio del producto. Ya implementado en ficha de producto. Usa ADR-002 (WhatsApp Link en vez de API). Entregado como parte de HU-1.2.
  - [ ] HU-3.3: Página de contacto (Medium)
    > Estimate: S (~4–8h) | Ruta `/contacto`. Información de la tienda (dirección, teléfono, email, horario). Botones de redes sociales (WhatsApp, Facebook, Instagram). Mapa de ubicación (placeholder o Google Maps embed). Formulario de contacto con validación (nombre, email, mensaje). Server Action placeholder (toast de confirmación; integración Resend en iteración futura).
    - **Como:** Cliente o visitante del sitio
    - **Quiero:** ver la información de contacto de HGourmet y poder enviar un mensaje
    - **Para poder:** comunicarme con la tienda o visitarla físicamente

---

### FEAT-4: Contenido y Marketing Digital

> Estimate: S-M (rollup) | 3 stories: 1×M + 1×XS + 1×delivered, esfuerzo total ~1–2 días.

- **Hypothesis:** Si entregamos herramientas de contenido de alto valor para el storefront (homepage optimizada y recetas/tips), entonces HGourmet podrá atraer tráfico recurrente y reforzar recordación de marca, medido por ≥80% de feedback positivo del contenido y mayor recurrencia de visitas en el primer trimestre.
- **Status:** Partially Delivered (HU-4.1 y HU-4.4 parcialmente entregados)
- **Priority:** Medium
- **Stories:**
  - [~] HU-4.1: Página principal con banners rotativos y secciones destacadas (High) ~Parcial
    > Estimate: XS (~1h) | Homepage ya implementada con: `HomepageHero`, `BannerCarousel`, `CategoryShowcase`, `ProductSection` (destacados + temporada), `BrandSection`. Pendiente: validar paridad visual con prototipo Lovable, agregar sección "Por qué elegirnos" (3 cards) si aplica. Revisión final post-funcionalidades.
  - [ ] HU-4.3: Sección de recetas y tips (Medium)
    > Estimate: M (~1–2 días) | Migración SQL para tabla `recipes` (ya definida en TECH_SPEC). Rutas storefront: `/recetas` (grid de cards) + `/recetas/[slug]` (detalle con imagen, ingredientes, pasos, tip). Componentes: `RecipeCard` [SC], `RecipePage` [SC]. SEO con `generateMetadata`. Paired con HU-2.8 (admin CRUD). Referencia: prototipo Lovable `Recetas.tsx` + `RecetaDetail.tsx`.
    - **Como:** Cliente de HGourmet
    - **Quiero:** ver recetas y tips de repostería
    - **Para poder:** inspirarme con ideas y aprender técnicas usando los productos de la tienda
  - [x] HU-4.4: Sección de marcas HGourmet (logos de proveedores) (Low) ✅ (2026-02-22)
    > Estimate: S | `BrandSection` [SC] en homepage con logos de marcas/proveedores. CRUD admin ya entregado como HU-2.6. Entregado como parte de HU-2.6 + CHORE-1.

---

### Enablers (Technical / Infrastructure)

- [ ] ENABLER-1: Cloudflare Tunnel para preview en desarrollo (Low)
  > Estimate: XS (~30 min) | Instalar `cloudflared`, crear script `npm run tunnel` para exponer `localhost:3000` en URL pública temporal. Documentar en README. No requiere spec ni objetivo formal — es un chore de infraestructura.

- [ ] ENABLER-2: Schema Evolution + Curación de Categorías (High)
  > Estimate: S (~4h) | Migración SQL: agregar `image_url text` a `categories`, agregar `barcode text` y `sat_code text` a `products`. Crear las 7 categorías curadas en Supabase (reemplazando las 6 del prototipo). Documentar mapeo `dept+cat CSV → categoría curada` en el workspace de FEAT-1 cuando se ejecute este enabler. Actualizar `TECH_SPEC.md` con nuevos campos y ADR-003 revisado.

#### Decisión: 7 Categorías Curadas (2026-02-23)

Validado con las dueñas. Se curan 7 categorías orientadas al cliente a partir de los 18 departamentos del inventario (3,382 productos):

| # | Categoría | Sub-categorías | Mapeo de departamentos CSV |
|:-:|:--|:--|:--|
| 1 | **Utensilios** | Herramientas, Tapetes de silicón, Plumones, Cortadores, Raspas, Globos, Espátulas, Termómetro | Herramientas, Cortadores, Accesorios, Refrigeración |
| 2 | **Decoración** | Sprinkles, Domis, Duyas, Cake topper, Tag, Diamantina, Matizador, Hoja de oro, Colorantes, Velas, Mangas | Decoración, Colorantes, Velas |
| 3 | **Bases** | Cuadrada, Rectangular, Redonda, Monoporción, MDF, Delgadas, Doble listón, Blondas, Soportes | Pastel |
| 4 | **Desechables** | Bolsa celofán, Cajas, Bisagras, Domos, Vasos, Tapas, Papel horneable, Papel antigrasa, Capacillos, Aluminios, Charolas | Capacillos, Bolsas, Desechables, Caja |
| 5 | **Chocolates** | Amargo, Semiamargo, Leche, Blanco, Sin Azúcar, Chispas, Horneables, Cocoa, Granillos, Coberturas | (sub-set de Insumos CSV) |
| 6 | **Insumos** | Harinas, Fondant, Galletas, Merengues, Lácteos, Mantequillas, Granos, Azúcares, Polvos, Vainillas | Insumos, Extractos, INIX, Comida |
| 7 | **Moldes** | Redondos, Cuadrados, Corazón, Flaneras, Aros, Panqué, Donas, Pay, Tartaleta, Desmoldable, Rosca, Cupcake | Moldes |

**Nota:** Productos de marca propia (dept HGOURMET, 27 productos) se distribuyen en la categoría que corresponda según su tipo.

---

### Chores (Technical / Visual)

- [x] CHORE-1: Sprint cosmético del storefront (Medium) ✅ (2026-02-23)
  > Estimate: S (~4h) | Hero con imagen de fondo, logo real, nav reestructurado, sección categorías estilizada, polish general. ~10 min (AI-assisted).

- [ ] CHORE-2: Sprint de polish final pre-demo (Low)
  > Estimate: S (~4h) | Revisión visual integral post-funcionalidades. Ajustes tipográficos, spacing, responsive, empty states, loading states. Se ejecuta después de completar todos los tracks funcionales.

---

### FEAT-5: Carrito de Compras, Checkout WhatsApp y Newsletter (Roadmap — Out of MVP)

> **Status:** Backlog (siguiente fase, post-MVP funcional)

- **Hypothesis:** Si entregamos un carrito de compras con checkout vía WhatsApp y captura de newsletter, entonces los clientes podrán armar pedidos más completos y mantenerse en contacto con promociones, medido por un aumento de ≥30% en ticket promedio y crecimiento sostenido de suscriptores.
- **Priority:** High (next phase)
- **Stories (draft):**
  - [ ] HU-5.1: Carrito de compras en el storefront
    > CartContext con estado en memoria, CartDrawer lateral, agregar/quitar/editar cantidad, badge en header.
  - [ ] HU-5.2: Checkout vía WhatsApp con pedido pre-formateado
    > Botón "Enviar pedido por WhatsApp" que genera mensaje con lista de productos, cantidades, precios y total.
  - [ ] HU-5.3: Persistencia del carrito (localStorage)
    > El carrito sobrevive al cierre del navegador. Limpieza automática después de N días.
  - [ ] HU-5.4: Registro al boletín informativo + gestión admin
    > Captura de email en Footer [CC] con validación y deduplicación. Server Action de suscripción y vista admin `/admin/boletin` con exportación CSV para campañas.

---

## Completed

> Stories and Features move here when finished via `@finish-objective`.
- FEAT-1
  - [x] HU-1.1: Navegación por categorías de productos ✅ (2026-02-21) — FEAT-1
  - [x] HU-1.2: Ficha de detalle de producto ✅ (2026-02-21) — FEAT-1
  - [x] HU-1.3: Búsqueda y filtrado de productos ✅ (2026-02-22) — FEAT-1
  - [x] HU-1.4: Sección "Lo más vendido" y "Productos de temporada" ✅ (2026-02-21) — FEAT-1
- FEAT-2
  - [x] HU-2.1: Autenticación de administradoras ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.4: Gestión de categorías ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.2: CRUD de productos desde el panel ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.7: Icon buttons y toggle inline en CategoryTable ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.5: Gestión de banners rotativos ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.6: Gestión de marcas/proveedores ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.8: Gestión de recetas desde el panel ✅ (2026-02-23) — FEAT-2
- FEAT-3
  - [x] HU-3.2: CTA "Pide por WhatsApp" con contexto de producto ✅ (2026-02-21)
- FEAT-4
  - [x] HU-4.4: Sección de marcas HGourmet ✅ (2026-02-22) — FEAT-4
- Chores (Technical / Visual)
  - [x] CHORE-1: Sprint cosmético del storefront ✅ (2026-02-23)
