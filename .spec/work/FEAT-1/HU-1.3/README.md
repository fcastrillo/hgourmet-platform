# HU-1.3: Búsqueda y filtrado de productos

**Feature:** FEAT-1 — Catálogo Digital de Productos

## User Story

- **Como:** Cliente de HGourmet
- **Quiero:** Buscar productos por nombre o descripción y filtrar por categoría y disponibilidad
- **Para poder:** Encontrar rápidamente un producto específico sin navegar manualmente por todas las categorías

## Acceptance Criteria

### Criteria List

1. Existe una barra de búsqueda accesible desde la parte superior del catálogo
2. La búsqueda por texto filtra productos por coincidencia parcial en nombre y descripción (case-insensitive)
3. Los resultados se muestran en tiempo real conforme el usuario escribe (debounce de 300ms)
4. Se puede combinar la búsqueda de texto con filtro de categoría
5. Solo se muestran productos visibles (`is_visible = true`) en los resultados
6. Si no hay resultados, se muestra un mensaje claro con sugerencia de ajustar los términos
7. La búsqueda funciona correctamente en dispositivos móviles con teclado virtual activo

### BDD Scenarios

#### Scenario 1: Búsqueda por nombre exitosa

- **Dado que:** Existen 3 productos visibles que contienen "chocolate" en su nombre
- **Cuando:** El cliente escribe "chocolate" en la barra de búsqueda
- **Entonces:** Se muestran los 3 productos que coinciden, en formato de tarjeta con imagen, nombre, precio y disponibilidad, en menos de 500ms

#### Scenario 2: Búsqueda combinada con filtro de categoría

- **Dado que:** Existen 5 productos con "molde" en su nombre, 3 en categoría "Moldes" y 2 en "Accesorios"
- **Cuando:** El cliente escribe "molde" y selecciona el filtro de categoría "Moldes"
- **Entonces:** Se muestran únicamente los 3 productos de la categoría "Moldes" que coinciden con el término

#### Scenario 3: Búsqueda con debounce

- **Dado que:** El cliente está en la página de catálogo
- **Cuando:** El cliente escribe "cho" rápidamente seguido de "colate" (formando "chocolate")
- **Entonces:** La búsqueda se ejecuta una sola vez después de 300ms de inactividad, no en cada tecla presionada

#### Scenario 4: Sin resultados encontrados (Error/Excepción)

- **Dado que:** No existen productos con el término "unicornio" en nombre ni descripción
- **Cuando:** El cliente escribe "unicornio" en la barra de búsqueda
- **Entonces:** Se muestra un mensaje "No encontramos productos para 'unicornio'. Intenta con otro término o explora nuestras categorías" con enlaces a las categorías activas

#### Scenario 5: Búsqueda excluye productos ocultos

- **Dado que:** Existe un producto "Chocolate Interno" con `is_visible = false` y un producto "Chocolate Belga" con `is_visible = true`
- **Cuando:** El cliente busca "chocolate"
- **Entonces:** Solo aparece "Chocolate Belga" en los resultados; "Chocolate Interno" nunca se muestra

## Technical Notes

- **Component type:**
  - Barra de búsqueda: `[CC]` Client Component — requiere `useState` para input y debounce
  - Filtro de categoría (dropdown/chips): `[CC]` Client Component — estado de selección
  - Resultados de búsqueda: `[SC]` Server Component con revalidación o `[CC]` si se opta por filtrado client-side
- **Database changes:** No — consultas sobre tabla `products` existente. Evaluar uso de `ilike` o Supabase full-text search (`to_tsvector`)
- **RLS impact:** No adicional — reutiliza política SELECT anon con filtro `is_visible = true`

## Dependencies

- HU-1.1 completada (estructura de categorías y tarjetas de producto)
- Datos de prueba suficientes para validar búsqueda (≥10 productos en múltiples categorías)
