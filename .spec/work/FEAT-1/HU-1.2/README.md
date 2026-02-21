# HU-1.2: Ficha de detalle de producto

**Feature:** FEAT-1 — Catálogo Digital de Productos

## User Story

- **Como:** Cliente de HGourmet
- **Quiero:** Ver la ficha completa de un producto con su imagen, descripción, precio y disponibilidad
- **Para poder:** Tomar una decisión de compra informada antes de contactar por WhatsApp

## Acceptance Criteria

### Criteria List

1. La ficha de producto muestra: imagen principal, nombre, descripción completa, precio en MXN y estado de disponibilidad
2. La URL del producto es amigable y usa el slug (`/productos/[slug]`)
3. La página incluye metadatos SEO (title, description, Open Graph) generados dinámicamente
4. Si el producto está disponible, se muestra un CTA claro para contactar por WhatsApp
5. Si el producto no está disponible, se muestra el badge "Agotado" y el CTA está deshabilitado
6. La página muestra la categoría del producto como breadcrumb de navegación
7. La imagen del producto se carga de forma optimizada (Next.js Image con lazy loading)

### BDD Scenarios

#### Scenario 1: Visualización completa de producto disponible

- **Dado que:** El producto "Chocolate Belga 1kg" existe con `is_visible = true`, `is_available = true`, precio $350.00, e imagen cargada
- **Cuando:** El cliente accede a `/productos/chocolate-belga-1kg`
- **Entonces:** Se muestra la ficha con imagen optimizada, nombre "Chocolate Belga 1kg", precio "$350.00 MXN", descripción completa, badge "Disponible", y un botón "Pide por WhatsApp"

#### Scenario 2: Producto con metadatos SEO correctos

- **Dado que:** El producto "Harina de Almendra 500g" tiene nombre, descripción e imagen
- **Cuando:** Un motor de búsqueda o red social rastrea la URL `/productos/harina-de-almendra-500g`
- **Entonces:** La página contiene meta tags con `og:title`, `og:description`, `og:image` y `<title>` generados a partir de los datos del producto

#### Scenario 3: Navegación con breadcrumb

- **Dado que:** El producto "Molde Silicona Rosas" pertenece a la categoría "Moldes"
- **Cuando:** El cliente visualiza la ficha del producto
- **Entonces:** Se muestra un breadcrumb "Inicio > Moldes > Molde Silicona Rosas" con enlaces activos a cada nivel

#### Scenario 4: Producto no disponible

- **Dado que:** El producto "Sprinkles Arcoíris" tiene `is_available = false`
- **Cuando:** El cliente accede a la ficha del producto
- **Entonces:** Se muestra la ficha completa con un badge "Agotado" visible, y el botón de WhatsApp está deshabilitado o no se muestra

#### Scenario 5: Producto no visible o inexistente (Error/Excepción)

- **Dado que:** El producto "Producto Interno Test" tiene `is_visible = false`, o el slug solicitado no existe en la base de datos
- **Cuando:** El cliente accede directamente a `/productos/producto-interno-test` o a un slug inválido
- **Entonces:** Se muestra una página 404 con mensaje amigable y enlace para volver al catálogo

## Technical Notes

- **Component type:**
  - Página de detalle (`/productos/[slug]`): `[SC]` Server Component — SEO critical, `generateMetadata`
  - Imagen del producto: Next.js `<Image>` con `priority` para LCP
  - Botón WhatsApp CTA: `[CC]` Client Component — composición dinámica de mensaje
  - Breadcrumb: `[SC]` Server Component
- **Database changes:** No — usa tabla `products` con join a `categories` para el breadcrumb
- **RLS impact:** Sí — política SELECT anon en `products` con filtro `is_visible = true`

## Dependencies

- HU-1.1 completada (navegación por categorías para breadcrumb y contexto)
- Supabase Storage configurado con bucket `product-images` y política de lectura pública
