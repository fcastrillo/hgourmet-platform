# Product Backlog

> **Project:** hgourmet-platform
> **Last updated:** 2026-03-16
>
> This is the **Single Source of Truth** for the SAFe hierarchy.
> Structure: Epic → Feature (FEAT-N) → User Story (HU-N.M)

---

## Epic: HGourmet — Tienda Virtual MVP

> Trasladar la experiencia de compra de HGourmet a un canal digital que reduzca la dependencia del local físico, mantenga el volumen de ventas y posicione la marca como tienda gourmet de confianza en Mérida.

---

### FEAT-1: Catálogo Digital de Productos

> Estimate: L (rollup) | 6 stories: 2×M + 4×S, esfuerzo total ~7–9 días.

- **Hypothesis:** Si entregamos un catálogo digital navegable por categorías con fichas de producto completas (imagen, precio, disponibilidad), entonces los clientes de HGourmet podrán consultar productos de forma autónoma sin visitar la tienda física ni preguntar por WhatsApp, medido por ≥500 usuarios únicos y ≥300 productos publicados en el primer mes.
- **Status:** Delivered (6/6 stories delivered) ✅ (2026-02-26)
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
  - [x] HU-1.5: Categorías con imagen administrable y visual homologado (Medium) ✅ (2026-02-24)
    > Estimate: S (~4–8h) | Migración: agregar `image_url` a tabla `categories`. Nuevo bucket `category-images` en Supabase Storage. Extender `CategoryFormModal` para upload de imagen. Unificar visualización entre `CategoryShowcase` (homepage) y `CategoryCard` (catálogo) para mostrar imagen real o fallback a icono. Depende de ENABLER-2.
  - [x] HU-1.6: Filtros avanzados de precio y toggle de disponibilidad con feedback completo (Medium) ✅ (2026-02-26)
    > Estimate: S (~4–8h) | Evolución de HU-1.3 para soportar intención de filtro `desde/hasta` en precio (evitando comportamiento unilateral) y corregir feedback visual del switch `Solo en stock` (posición del thumb + estado). Debe mantener trazabilidad de filtros en URL (`searchParams`) y cobertura de pruebas de integración para prevenir regresiones.

---

### FEAT-2: Panel de Administración

- **Hypothesis:** Si entregamos un panel de administración intuitivo con gestión de productos y carga CSV, entonces las dueñas podrán mantener el catálogo actualizado de forma autónoma (sin soporte técnico) con una capacitación de ≤2 horas, medido por la capacidad de agregar/editar/ocultar productos sin asistencia externa.
- **Status:** Delivered (8/8 stories delivered)
- **Priority:** High
- **Stories:**
  - [x] HU-2.1: Autenticación de administradoras (High) ✅ (2026-02-22)
    > Estimate: S | Login con Magic Link (Email OTP), middleware de protección `/admin/*`, sesión server-side con `@supabase/ssr`, admin layout con sidebar, logout. ~1–2 días.
  - [x] HU-2.2: CRUD de productos desde el panel (High) ✅ (2026-02-22)
    > Estimate: M | Lista con paginación/búsqueda, formulario de creación/edición con upload de imagen a Supabase Storage, slug automático, toggles de visibilidad/featured/seasonal, eliminación con confirmación. ~3–4 días.
  - [x] HU-2.3: Importación masiva de productos vía CSV (High) ✅ (2026-02-23)
    > Estimate: L (~2–3 días) | Parser client-side con mapeo `departamento+categoría CSV → categoría curada` (7 categorías). Limpieza de precios formato `$1,135.00` → `numeric`. Validación por fila con reporte de errores (duplicados SKU, precios inválidos, categoría no mapeada). Preview antes de importar. Upsert idempotente por SKU (`clave1`). Template descargable. Inventario real: 3,382 productos en 18 departamentos. Depende de ENABLER-2. Ver ADR-003 actualizado.
    > Mejora futura identificada en operación real: habilitar descarga directa del log de errores del import desde la UI admin (evitar extracción manual y mejorar trazabilidad operativa).
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

> Estimate: M (rollup) | 4 stories: 3×S + 1×XS; esfuerzo total ~1–2.5 días por UI cross-page + validaciones + paridad visual.

- **Hypothesis:** Si entregamos un canal de comunicación integrado con WhatsApp y redes sociales desde cada punto del catálogo, entonces los clientes podrán pasar de la consulta al pedido en un solo clic, medido por ≥50 pedidos confirmados vía WhatsApp originados desde la web en el primer mes.
- **Status:** Delivered (4/4 stories delivered) ✅ (2026-02-25)
- **Priority:** High
- **Stories:**
  - [x] HU-3.1: Botón fijo de WhatsApp en todo el sitio (High) ✅ (2026-02-23)
    > Estimate: XS | Componente flotante global en layout storefront con deep link `wa.me`, fallback por configuración inválida y ajuste visual; cambio acotado sin lógica de datos nueva.
  - [x] HU-3.2: CTA "Pide por WhatsApp" con contexto de producto (High) ✅ (2026-02-21)
    > Estimate: S | CTA contextual por producto con composición segura de mensaje y manejo de datos incompletos; requiere coordinación de UI + formato de enlace dinámico.
  - [x] HU-3.3: Página de contacto (Medium) ✅ (2026-02-23)
    > Estimate: S | Nueva ruta `/contacto` con layout completo, enlaces sociales, mapa placeholder y formulario con validaciones/estados; sin integración externa obligatoria en esta iteración.
  - [x] HU-3.4: Formulario de contacto con envío real vía WhatsApp (High) ✅ (2026-02-25)
    > Estimate: S (~4–8h) | Convertir el formulario de `/contacto` de estado simulado a envío real por deep link `wa.me` con mensaje prellenado (nombre, teléfono, email opcional y mensaje). Incluir validaciones de campos requeridos, encoding seguro del texto y manejo explícito de cancelación/error para evitar "success fake". Alineado con ADR-002.
    > Como cliente o visitante, quiero enviar el formulario de contacto y abrir WhatsApp con mensaje prellenado, para poder contactar a HGourmet en un solo flujo sin copiar información manualmente.
    > BDD mínimo: (1) Dado que completo campos válidos, cuando envío, entonces se abre `wa.me` con contexto prellenado; (2) Dado que faltan requeridos o falla apertura/cancelación, cuando intento enviar, entonces no se muestra éxito falso y se informa error recuperable.

---

### FEAT-4: Contenido y Marketing Digital

> Estimate: M (rollup) | 3 stories: 1×M + 1×S + 1×XS; esfuerzo total ~1–2 días por nuevas rutas de contenido + cierre visual de homepage.

- **Hypothesis:** Si entregamos herramientas de contenido de alto valor para el storefront (homepage optimizada y recetas/tips), entonces HGourmet podrá atraer tráfico recurrente y reforzar recordación de marca, medido por ≥80% de feedback positivo del contenido y mayor recurrencia de visitas en el primer trimestre.
- **Status:** Delivered (3/3 stories delivered) ✅ (2026-02-25)
- **Priority:** Medium
- **Stories:**
  - [x] HU-4.1: Página principal con banners rotativos y secciones destacadas (High) ✅ (2026-02-25)
    > Estimate: XS | Cierre visual sobre base ya implementada (paridad Lovable, ajustes de jerarquía y bloques de confianza) sin cambios de datos ni integraciones nuevas.
  - [x] HU-4.3: Sección de recetas y tips (Medium) ✅ (2026-02-23)
    > Estimate: M | Implementa nuevas rutas (`/recetas`, `/recetas/[slug]`), render SEO-friendly, manejo de estados de no disponible y dependencia de contenido administrable.
  - [x] HU-4.4: Sección de marcas HGourmet (logos de proveedores) (Low) ✅ (2026-02-22)
    > Estimate: S | Integración de sección pública de marcas activas con orden configurable desde admin; alcance acotado a homepage y estado vacío.

---

### Enablers (Technical / Infrastructure)

- [x] ENABLER-1: Cloudflare Tunnel para preview en desarrollo (Low) ✅ (2026-02-26)
  > Estimate: XS (~30–45 min) | Instalar `cloudflared`, crear script `npm run tunnel` para exponer `localhost:3000` en URL pública temporal y preparar subdominio de demo (ej. `demo.hgourmet.com.mx`) separado de producción (`hgourmet.com.mx`).
  > **Hipótesis de beneficio:** Si habilitamos un canal de preview público y estable para la versión local, entonces podremos acelerar validaciones con stakeholders y reducir fricción antes de publicar a `main`, medido por al menos 1 demo externa funcional por iteración y decisión explícita de estrategia de deployment/Git (trunk→feature) acordada antes del siguiente objetivo funcional.
  > **BDD mínimo:** (1) Dado que el entorno local está levantado, cuando ejecuto `npm run tunnel`, entonces obtengo una URL pública accesible para compartir demo; (2) Dado que stakeholders acceden al preview, cuando revisamos el flujo principal, entonces se registran VoBo/ajustes previos a merge en `main`; (3) Dado que el túnel falla o expira, cuando intento reutilizar la URL, entonces se informa recuperación operativa (reinicio de túnel y actualización de enlace) sin bloquear el trabajo local.
  > **Estado actual:** scripts + documentación implementados, conector registrado y DNS operativo para `demo.hgourmet.com.mx`. Flujo vigente: demo desde ramas feature por túnel, producción desde `main` en `www.hgourmet.com.mx` (sin usar Vercel Preview por rama en esta etapa).

- [x] ENABLER-2: Schema Evolution + Curación de Categorías (High) ✅ (2026-02-23)
  > Estimate: S (~4h) | Migración SQL `005_enabler2_schema_evolution.sql`: `categories.image_url`, `products.barcode` + `sat_code`, tablas staging (`import_batches`, `product_import_raw`, `category_mapping_rules`, `product_import_issues`), RLS admin-only, índices de reproceso, seed de 35 reglas V1. `TECH_SPEC.md` actualizado (data model + ADR-003 revisado). Desbloquea: HU-1.5 y HU-2.3.

- [x] ENABLER-3: Hardening del importador CSV (confiabilidad + trazabilidad) (High) ✅ (2026-02-26)
  > Estimate: M (~1–2 días) | Prioridad actual: eliminar fallos silenciosos y asegurar trazabilidad total por fila. Implementar política **best-effort** (si falla un batch, degradar a fila individual y continuar), registrar issue técnico por fila fallida (DB insert/update), y corregir métricas reales de `created/updated/skipped/errored` para que siempre cumplan `created + updated + skipped + errored = totalRows`. Mantener mejoras de throughput como secundarias/no bloqueantes.

#### Decisión: 7 Categorías Curadas (2026-02-23)

Validado con las dueñas. Se curan 7 categorías orientadas al cliente a partir de los 18 departamentos del inventario (3,382 productos): **Utensilios, Decoración, Bases, Desechables, Chocolates, Insumos, Moldes**.

Para evitar sobrecargar el backlog, el detalle operativo vive en `.spec/work/ENABLERS/ENABLER-2`:

- `.spec/work/ENABLERS/ENABLER-2/README.md` (arquitectura de datos y plan de ejecución)
- `.spec/work/ENABLERS/ENABLER-2/CATEGORY_MAPPING_V1.md` (tabla completa `departamento+categoria -> categoria_curada`)
- `.spec/work/ENABLERS/ENABLER-2/CSV_STAGING_STRATEGY.md` (qué columnas se conservan en staging vs dominio)

Detalle de hardening/trazabilidad del importador:

- `.spec/work/ENABLERS/ENABLER-3/README.md`

---

### Chores (Technical / Visual)

- [x] CHORE-1: Sprint cosmético del storefront (Medium) ✅ (2026-02-23)
  > Estimate: S (~4h) | Hero con imagen de fondo, logo real, nav reestructurado, sección categorías estilizada, polish general. ~10 min (AI-assisted).

- [x] CHORE-2: Sprint de polish final pre-demo (Low) ✅ (2026-02-25)
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

### FEAT-6: Evolución UX del Panel de Administración

> Estimate: M (rollup) | 2 stories: 2×S; esfuerzo total ~1–2 días.

- **Hypothesis:** Si entregamos un dashboard administrativo con métricas accionables y una edición de recetas en campos estructurados, entonces las administradoras podrán operar el panel con menor fricción y menor curva de aprendizaje, medido por reducción de dudas operativas en capacitación y menor tiempo promedio para actualizar contenido.
- **Status:** Delivered (2/2 stories delivered) ✅ (2026-02-28)
- **Priority:** High
- **Stories:**
  - [x] HU-6.1: Dashboard administrativo completo con estado operativo del negocio ✅ (2026-02-28)
    > Como administradora, quiero ver en el dashboard tarjetas de métricas clave y actividad reciente consistente con el prototipo validado, para poder entender el estado del catálogo sin navegar múltiples pantallas.
    > Criterios (resumen): (1) mostrar KPIs relevantes y confiables del panel; (2) incluir lista de actividad reciente (ej. últimos productos/recetas actualizados); (3) mantener degradación controlada ante estados vacíos/fallas parciales; (4) respetar jerarquía visual y consistencia de diseño del admin.
    > BDD mínimo: (1) Dado que soy una administradora autenticada, cuando entro a `/admin`, entonces veo KPIs clave (productos, categorías, recetas y marcas/banners) con valores consistentes con la base de datos; (2) Dado que existen altas/ediciones recientes, cuando cargo el dashboard, entonces veo una lista de últimos cambios con fecha y estado; (3) Dado que no hay actividad reciente o falla una fuente secundaria, cuando renderiza el dashboard, entonces se muestra estado vacío/degradación controlada sin bloquear la operación.
    > Casos de prueba sugeridos: contrato de datos para KPIs (conteos correctos por entidad), integración de render del dashboard con estado vacío/no vacío.
  - [x] HU-6.2: Edición de recetas en campos estructurados (ingredientes, preparación, tip) ✅ (2026-02-28)
    > Como administradora, quiero editar recetas en campos separados para ingredientes, preparación y tip HGourmet, para no depender de escribir Markdown manual y reducir errores de formato.
    > Criterios (resumen): (1) reemplazar campo único "Contenido" por tres campos independientes; (2) persistir estructura en DB/API sin perder compatibilidad con recetas existentes; (3) render público mantiene secciones "Ingredientes", "Preparación" y "Tip HGourmet" con formato consistente; (4) validaciones claras por sección obligatoria/opcional.
    > BDD mínimo: (1) Dado que estoy creando o editando una receta en admin, cuando capturo ingredientes, preparación y tip en sus campos, entonces la receta se guarda sin requerir sintaxis Markdown; (2) Dado que existe una receta legacy con contenido en markdown, cuando la edito, entonces el sistema preserva/convierte su contenido para no perder información; (3) Dado que visito la receta en storefront, cuando se renderiza el detalle, entonces se muestran separadas las secciones de ingredientes, preparación y tip con jerarquía visual correcta.
    > Casos de prueba sugeridos: integración de formulario admin (crear/editar), migración/compatibilidad de registros legacy, render storefront por secciones y validación de fallback.

---

### FEAT-7: Analítica y Trazabilidad de Conversión

> Estimate: M (rollup) | 4 stories: 3×S + 1×XS; esfuerzo total ~1.5–2.5 días.

- **Para**: dueñas de HGourmet y equipo comercial
- **Que**: buscan medir el rendimiento del storefront y rastrear mejor la intención de compra por WhatsApp
- **Esta épica**: provee instrumentación de analítica web, registro estructurado de interacciones de WhatsApp y navegación de marcas orientada a conversión
- **Esperamos**: mejorar visibilidad del embudo digital y reducir fricción en la exploración por marca
- **Sabremos que hemos tenido éxito cuando**: se registren eventos clave de navegación/contacto en analítica y base de datos, y aumente la tasa de sesiones que pasan de marca a búsqueda de productos
- **Hypothesis:** Si entregamos analítica web + trazabilidad de interacciones de WhatsApp + navegación de marcas orientada a búsqueda, entonces HGourmet podrá medir mejor el embudo y convertir más sesiones en conversaciones comerciales, medido por mayor tasa de clics a WhatsApp y sesiones con búsqueda por marca.
- **Status:** In Progress (3/4 stories delivered) 🚧 (2026-03-16)
- **Priority:** High
- **Stories:**
  - [x] HU-7.1: Integrar Google Analytics para tracking del storefront (High) ✅ (2026-03-16)
    > Estimate: S (~4–6h) | Instrumentar Google Analytics (GA4) en el sitio para medir pageviews y eventos clave de interacción (búsqueda, clic de WhatsApp, navegación por categorías/marcas), respetando buenas prácticas de carga y configuración por ambiente.
    > Como: dueña de HGourmet
    > Quiero: contar con métricas confiables del comportamiento de usuarios en el sitio
    > Para poder: tomar decisiones de contenido, catálogo y campañas basadas en datos reales.
    > Criterios (lista):
    > (1) Configurar GA4 de forma centralizada y reusable.
    > (2) Registrar pageview en todas las rutas públicas relevantes.
    > (3) Registrar eventos de conversión clave (clic a WhatsApp, búsqueda de productos).
    > (4) Evitar duplicidad de eventos por navegación client-side.
    > BDD mínimo:
    > (1) Dado que un usuario navega por el storefront, cuando cambia de página, entonces se registra un pageview en GA4 con la ruta correcta.
    > (2) Dado que un usuario hace clic en un CTA de WhatsApp o usa la búsqueda, cuando se dispara la interacción, entonces se registra el evento correspondiente con parámetros mínimos definidos.
    > (3) Dado que la app corre en ambiente sin clave de analítica, cuando renderiza el storefront, entonces no falla la experiencia y se registra degradación controlada.
  - [ ] HU-7.2: Registrar interacciones de WhatsApp en tabla de trazabilidad (High)
    > Estimate: S (~6–8h) | Crear/usar tabla de tracking para persistir interacciones originadas en formulario de contacto e interés en producto, incluyendo metadata mínima (tipo de interacción, producto opcional, timestamp, canal, contexto de página) para análisis posterior.
    > Como: administradora de HGourmet
    > Quiero: tener un registro histórico de las interacciones que abren conversación por WhatsApp
    > Para poder: medir intención de compra, detectar productos de alto interés y priorizar seguimiento comercial.
    > Criterios (lista):
    > (1) Persistir en DB eventos de contacto desde formulario y CTA de producto.
    > (2) Definir campos obligatorios y opcionales para trazabilidad.
    > (3) Garantizar que el envío a WhatsApp no dependa de la persistencia (best-effort con manejo de errores).
    > (4) Mantener cumplimiento de seguridad/acceso según lineamientos actuales del proyecto.
    > BDD mínimo:
    > (1) Dado que un usuario envía el formulario de contacto con datos válidos, cuando se procesa la acción, entonces se guarda un registro de interacción `contact_form` con su contexto y luego se abre WhatsApp.
    > (2) Dado que un usuario hace clic en "Pide por WhatsApp" desde un producto, cuando se ejecuta la acción, entonces se guarda un registro `product_interest` con identificador del producto y contexto de página.
    > (3) Dado que falla el guardado en tabla, cuando el usuario intenta contactar por WhatsApp, entonces el sistema mantiene un flujo recuperable sin bloquear la conversión.
  - [x] HU-7.3: Navegación por marca con búsqueda automática en catálogo (Medium) ✅ (2026-03-16)
    > Estimate: XS (~2–4h) | Ajustar links de marcas para que apunten por defecto a `/categorias?q={nombreMarca}` sin hardcode manual por marca y sin abrir nueva ventana/pestaña, asegurando consistencia de navegación interna.
    > Como: cliente del storefront
    > Quiero: que al seleccionar una marca me lleve directamente a los productos filtrados por esa marca
    > Para poder: encontrar rápido lo que busco sin pasos adicionales ni cambios de contexto.
    > Criterios (lista):
    > (1) Generar URL de búsqueda de marca de forma dinámica a partir del nombre de la marca.
    > (2) Usar navegación interna del sitio (misma pestaña/ventana).
    > (3) Codificar correctamente nombres de marca con espacios o caracteres especiales.
    > (4) Mantener compatibilidad con comportamiento actual de listado de marcas.
    > BDD mínimo:
    > (1) Dado que una marca está visible en la sección de marcas, cuando hago clic en su link, entonces navego a `/categorias?q=<marca>` en la misma pestaña.
    > (2) Dado que el nombre de la marca contiene espacios o caracteres especiales, cuando se genera el link, entonces la URL queda correctamente codificada y la búsqueda devuelve resultados esperados.
    > (3) Dado que una marca no tiene productos asociados, cuando navego por su link, entonces veo estado vacío de búsqueda sin error de navegación.
  - [x] HU-7.4: Mapa visible e interactivo en página de contacto (High) ✅ (2026-03-16)
    > Estimate: S (~4–6h) | Reemplazar placeholder del mapa en `/contacto` por mapa real embebido (Google Maps), manteniendo performance, accesibilidad básica y fallback visual ante bloqueo/carga fallida.
    > Como: cliente o visitante
    > Quiero: visualizar la ubicación real de HGourmet en la página de contacto
    > Para poder: ubicar el local rápidamente y decidir cómo llegar o contactar.
    > Criterios (lista):
    > (1) Mostrar mapa real en la sección de contacto con ubicación correcta del negocio.
    > (2) Permitir interacción mínima esperada (zoom, paneo y apertura de ubicación en Google Maps).
    > (3) Mantener diseño responsive sin romper layout en móvil y desktop.
    > (4) Definir fallback legible si el mapa no carga o está bloqueado por red/política.
    > BDD mínimo:
    > (1) Dado que entro a `/contacto`, cuando la página termina de cargar, entonces veo un mapa real con el pin de la dirección de HGourmet.
    > (2) Dado que estoy en un dispositivo móvil, cuando visualizo la sección del mapa, entonces el componente se adapta sin desbordes ni superposición de elementos.
    > (3) Dado que el embed del mapa falla, cuando renderiza la sección de ubicación, entonces se muestra fallback informativo con enlace directo a Google Maps.

---

## Completed

> Stories and Features move here when finished via `@finish-objective`.
- FEAT-1
  - [x] HU-1.1: Navegación por categorías de productos ✅ (2026-02-21) — FEAT-1
  - [x] HU-1.2: Ficha de detalle de producto ✅ (2026-02-21) — FEAT-1
  - [x] HU-1.3: Búsqueda y filtrado de productos ✅ (2026-02-22) — FEAT-1
  - [x] HU-1.4: Sección "Lo más vendido" y "Productos de temporada" ✅ (2026-02-21) — FEAT-1
  - [x] HU-1.5: Categorías con imagen administrable y visual homologado ✅ (2026-02-24) — FEAT-1
  - [x] HU-1.6: Filtros avanzados de precio y toggle de disponibilidad con feedback completo ✅ (2026-02-26) — FEAT-1
- FEAT-2
  - [x] HU-2.1: Autenticación de administradoras ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.4: Gestión de categorías ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.2: CRUD de productos desde el panel ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.3: Importación masiva de productos vía CSV ✅ (2026-02-23) — FEAT-2
  - [x] HU-2.7: Icon buttons y toggle inline en CategoryTable ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.5: Gestión de banners rotativos ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.6: Gestión de marcas/proveedores ✅ (2026-02-22) — FEAT-2
  - [x] HU-2.8: Gestión de recetas desde el panel ✅ (2026-02-23) — FEAT-2
- FEAT-3
  - [x] HU-3.1: Botón fijo de WhatsApp en todo el sitio ✅ (2026-02-23)
  - [x] HU-3.2: CTA "Pide por WhatsApp" con contexto de producto ✅ (2026-02-21)
  - [x] HU-3.3: Página de contacto ✅ (2026-02-23)
  - [x] HU-3.4: Formulario de contacto con envío real vía WhatsApp ✅ (2026-02-25)
- FEAT-4
  - [x] HU-4.1: Página principal con banners rotativos y secciones destacadas ✅ (2026-02-25) — FEAT-4
  - [x] HU-4.3: Sección de recetas y tips ✅ (2026-02-23) — FEAT-4
  - [x] HU-4.4: Sección de marcas HGourmet ✅ (2026-02-22) — FEAT-4
- FEAT-7
  - [x] HU-7.1: Integrar Google Analytics para tracking del storefront ✅ (2026-03-16) — FEAT-7
  - [x] HU-7.3: Navegación por marca con búsqueda automática en catálogo ✅ (2026-03-16) — FEAT-7
  - [x] HU-7.4: Mapa visible e interactivo en página de contacto ✅ (2026-03-16) — FEAT-7
- Chores (Technical / Visual)
  - [x] CHORE-1: Sprint cosmético del storefront ✅ (2026-02-23)
  - [x] CHORE-2: Sprint de polish final pre-demo ✅ (2026-02-25)
