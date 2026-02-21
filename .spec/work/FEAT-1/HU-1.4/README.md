# HU-1.4: Sección "Lo más vendido" y "Productos de temporada"

**Feature:** FEAT-1 — Catálogo Digital de Productos

## User Story

- **Como:** Cliente de HGourmet
- **Quiero:** Ver secciones destacadas con los productos más vendidos y los productos de temporada
- **Para poder:** Descubrir rápidamente los productos populares y las novedades estacionales sin buscar manualmente

## Acceptance Criteria

### Criteria List

1. La página principal muestra una sección "Lo más vendido" con productos que tengan `is_featured = true`
2. La página principal muestra una sección "Productos de temporada" con productos que tengan `is_seasonal = true`
3. Ambas secciones muestran máximo 8 productos cada una (configurable)
4. Los productos se muestran en formato de tarjeta con imagen, nombre, precio y disponibilidad
5. Solo se muestran productos visibles (`is_visible = true`) en ambas secciones
6. Si no hay productos marcados para una sección, esa sección no se renderiza (no muestra contenedor vacío)
7. Cada sección incluye un enlace "Ver todos" que lleva a la vista filtrada correspondiente
8. Las secciones son responsivas y muestran entre 2 (mobile) y 4 (desktop) tarjetas por fila

### BDD Scenarios

#### Scenario 1: Sección "Lo más vendido" con productos

- **Dado que:** Existen 10 productos con `is_featured = true` e `is_visible = true`
- **Cuando:** El cliente accede a la página principal
- **Entonces:** Se muestra la sección "Lo más vendido" con los primeros 8 productos destacados, cada uno con imagen, nombre, precio y badge de disponibilidad

#### Scenario 2: Sección "Productos de temporada" con productos

- **Dado que:** Existen 5 productos con `is_seasonal = true` e `is_visible = true`
- **Cuando:** El cliente accede a la página principal
- **Entonces:** Se muestra la sección "Productos de temporada" con los 5 productos estacionales visibles en formato de tarjeta

#### Scenario 3: Sección sin productos no se renderiza

- **Dado que:** No existen productos con `is_seasonal = true` e `is_visible = true`
- **Cuando:** El cliente accede a la página principal
- **Entonces:** La sección "Productos de temporada" no aparece en la página (ni título, ni contenedor vacío), y el resto del layout no se ve afectado

#### Scenario 4: Enlace "Ver todos" navega a vista filtrada

- **Dado que:** La sección "Lo más vendido" muestra 8 de 12 productos destacados
- **Cuando:** El cliente hace clic en "Ver todos" de la sección "Lo más vendido"
- **Entonces:** Se navega a una vista que muestra los 12 productos destacados con el mismo formato de tarjeta

#### Scenario 5: Producto destacado oculto no aparece (Error/Excepción)

- **Dado que:** Un producto tiene `is_featured = true` pero `is_visible = false`
- **Cuando:** El cliente accede a la página principal
- **Entonces:** Ese producto NO aparece en la sección "Lo más vendido", respetando el filtro de visibilidad sobre el flag de destacado

## Technical Notes

- **Component type:**
  - Sección "Lo más vendido": `[SC]` Server Component — consulta filtrada por `is_featured`
  - Sección "Productos de temporada": `[SC]` Server Component — consulta filtrada por `is_seasonal`
  - Tarjeta de producto (reutilizable): `[SC]` Server Component — misma tarjeta de HU-1.1
  - Enlace "Ver todos": `[SC]` Server Component — link estático
- **Database changes:** No — usa campos `is_featured` e `is_seasonal` existentes en tabla `products`
- **RLS impact:** No adicional — reutiliza política SELECT anon con filtro `is_visible = true`

## Dependencies

- HU-1.1 completada (componente tarjeta de producto reutilizable)
- Productos de prueba marcados con `is_featured` e `is_seasonal` para validar
