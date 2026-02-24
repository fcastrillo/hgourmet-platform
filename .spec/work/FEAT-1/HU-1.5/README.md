# HU-1.5: Categorías con imagen administrable y visual homologado

**Feature:** FEAT-1 — Catálogo Digital de Productos

## User Story

- **Como:** Administradora de HGourmet
- **Quiero:** Cargar y mantener una imagen por categoría desde el panel admin
- **Para poder:** Mostrar categorías consistentes y atractivas en homepage y catálogo sin depender de cambios en código

## Acceptance Criteria

### Criteria List

1. El formulario de categoría en admin permite subir/actualizar imagen en el bucket `category-images`.
2. Al guardar una categoría con imagen válida, se persiste `image_url` en la tabla `categories`.
3. `CategoryShowcase` (homepage) y `CategoryCard` (catálogo) usan la misma regla visual: si existe `image_url`, mostrarla; si no, mostrar fallback (icono + fondo).
4. La experiencia visual mantiene paridad de layout entre homepage y catálogo (bordes, proporciones, estados hover y accesibilidad básica).
5. Si falla la carga de imagen o URL no válida, el frontend usa fallback sin romper el layout.
6. Solo usuarios administradores autenticados pueden subir o reemplazar imágenes de categoría.

### BDD Scenarios

#### Scenario 1: Admin sube imagen y se refleja en storefront

- **Dado que:** Soy una administradora autenticada y existe una categoría activa sin imagen
- **Cuando:** Subo una imagen válida en `CategoryFormModal` y guardo la categoría
- **Entonces:** Se actualiza `image_url` en la categoría y la imagen se muestra tanto en `CategoryShowcase` como en `CategoryCard`

#### Scenario 2: Categoría sin imagen usa fallback homogéneo

- **Dado que:** Existe una categoría activa con `image_url` vacío o nulo
- **Cuando:** Un cliente visita homepage o catálogo
- **Entonces:** Ambas vistas renderizan el mismo fallback visual (icono + estilo base) sin diferencias de comportamiento

#### Scenario 3: Error de carga o URL rota no rompe UI (Error/Excepción)

- **Dado que:** Una categoría tiene `image_url` inválido o la imagen no se puede cargar
- **Cuando:** El cliente visualiza la categoría en homepage o catálogo
- **Entonces:** El componente cae a fallback de forma segura, sin errores visibles ni quiebres de maquetación

## Technical Notes

- **Component type:**
  - `CategoryFormModal`: `[CC]` Client Component (selección de archivo + estado local de formulario)
  - Acciones de persistencia categoría/imagen: `[SA]` Server Actions
  - `CategoryShowcase`: `[SC]` Server Component
  - `CategoryCard`: `[SC]` Server Component
- **Database changes:** No nuevas migraciones para esta HU (la columna `categories.image_url` ya fue agregada por ENABLER-2).
- **RLS impact:** No cambios adicionales; se reutiliza política existente (anon lectura, authenticated escritura).
- **Infrastructure prerequisite:** Bucket `category-images` disponible y público para lectura.

## Dependencies

- ENABLER-2 completado (schema + storage base para categorías con imagen).
- HU-2.4 completada (CRUD de categorías base en admin).
