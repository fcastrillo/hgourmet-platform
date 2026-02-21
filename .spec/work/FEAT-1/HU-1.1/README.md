# HU-1.1: Navegación por categorías de productos

**Feature:** FEAT-1 — Catálogo Digital de Productos

## User Story

- **Como:** Cliente de HGourmet (repostero, estudiante o ama de casa)
- **Quiero:** Navegar por las categorías de productos (Chocolate, Harinas, Sprinkles, Moldes, Materia Prima, Accesorios)
- **Para poder:** Encontrar rápidamente los insumos que necesito sin recorrer todo el catálogo

## Acceptance Criteria

### Criteria List

1. La página de catálogo muestra todas las categorías activas ordenadas por `display_order`
2. Cada categoría muestra su nombre y cantidad de productos disponibles
3. Al seleccionar una categoría, se muestran únicamente los productos visibles (`is_visible = true`) de esa categoría
4. Los productos se muestran en tarjetas con: imagen, nombre, precio y estado de disponibilidad
5. Las categorías inactivas (`is_active = false`) no aparecen en la navegación
6. La navegación es responsiva y funciona correctamente en dispositivos móviles (≥320px)
7. Los productos no disponibles (`is_available = false`) se muestran con indicador visual de "Agotado"

### BDD Scenarios

#### Scenario 1: Navegación exitosa por categoría

- **Dado que:** Existen 3 categorías activas ("Chocolate", "Harinas", "Moldes") con productos visibles
- **Cuando:** El cliente accede a la página de catálogo
- **Entonces:** Se muestran las 3 categorías ordenadas por `display_order`, cada una con su nombre y la cantidad de productos disponibles

#### Scenario 2: Filtrado de productos al seleccionar categoría

- **Dado que:** La categoría "Chocolate" tiene 5 productos visibles y 2 ocultos
- **Cuando:** El cliente selecciona la categoría "Chocolate"
- **Entonces:** Se muestran únicamente los 5 productos visibles en formato de tarjeta con imagen, nombre, precio y disponibilidad

#### Scenario 3: Producto agotado visible con indicador

- **Dado que:** El producto "Chocolate Belga 1kg" tiene `is_available = false` e `is_visible = true`
- **Cuando:** El cliente navega a la categoría que contiene ese producto
- **Entonces:** El producto se muestra con un badge visual "Agotado" y el botón de acción (WhatsApp) está deshabilitado o ausente

#### Scenario 4: Categoría sin productos

- **Dado que:** La categoría "Sprinkles" está activa pero no tiene productos visibles
- **Cuando:** El cliente selecciona la categoría "Sprinkles"
- **Entonces:** Se muestra un mensaje amigable "No hay productos disponibles en esta categoría por el momento" en lugar de una página vacía

#### Scenario 5: Categoría inactiva no visible (Error/Excepción)

- **Dado que:** La categoría "Temporada Navideña" tiene `is_active = false`
- **Cuando:** El cliente accede a la página de catálogo o intenta navegar directamente a `/categorias/temporada-navidena`
- **Entonces:** La categoría no aparece en el menú de navegación, y el acceso directo por URL retorna una página 404

## Technical Notes

- **Component type:**
  - Página de categorías (`/categorias`): `[SC]` Server Component — renderizado con SEO
  - Página de categoría individual (`/categorias/[slug]`): `[SC]` Server Component — lista de productos por categoría
  - Menú de navegación de categorías: `[SC]` Server Component
  - Tarjeta de producto (grid): `[SC]` Server Component
- **Database changes:** No — usa tablas `categories` y `products` existentes
- **RLS impact:** Sí — requiere política SELECT anon en `categories` (todas las activas) y en `products` (solo `is_visible = true`)

## Dependencies

- Base de datos Supabase inicializada con tablas `categories` y `products`
- Políticas RLS configuradas según TECH_SPEC.md
- Al menos una categoría con productos de prueba para validar
