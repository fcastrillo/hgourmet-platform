# HU-1.6: Filtros avanzados de precio y toggle de disponibilidad con feedback completo

**Feature:** FEAT-1 — Catálogo Digital de Productos

## User Story

- **Como:** Cliente de HGourmet navegando el catálogo
- **Quiero:** Filtrar por precio mínimo o máximo y entender claramente el estado del filtro de disponibilidad
- **Para poder:** Encontrar productos relevantes con menor fricción y mayor confianza en los controles de filtrado

## Acceptance Criteria

### Criteria List

1. El filtro de precio permite aplicar intención `Hasta` (precio máximo) y `Desde` (precio mínimo) de forma explícita.
2. El modo activo de precio (`Hasta`/`Desde`) es visible en UI y consistente con el resultado de productos filtrados.
3. Al usar `Desde $X`, el listado muestra únicamente productos con precio `>= X`; al usar `Hasta $X`, muestra productos con precio `<= X`.
4. El toggle `Solo en stock` refleja el estado con feedback visual completo: color activo + desplazamiento del thumb + estado accesible (`aria-checked`).
5. Activar/desactivar `Solo en stock` actualiza correctamente los resultados sin efectos colaterales sobre otros filtros (búsqueda/categoría/precio).
6. El estado de filtros (modo precio, valor precio y disponibilidad) se serializa en URL (`searchParams`) y se restaura al recargar.

### BDD Scenarios

#### Scenario 1: Cliente filtra por precio mínimo (Desde)

- **Dado que:** Estoy en `/catalogo` con productos de diferentes rangos de precio
- **Cuando:** Selecciono el modo `Desde` y ajusto el valor a `$750`
- **Entonces:** Solo se muestran productos con precio mayor o igual a `750`

#### Scenario 2: Cliente filtra por precio máximo (Hasta)

- **Dado que:** Estoy en `/catalogo` con productos de diferentes rangos de precio
- **Cuando:** Selecciono el modo `Hasta` y ajusto el valor a `$750`
- **Entonces:** Solo se muestran productos con precio menor o igual a `750`

#### Scenario 3: Toggle de disponibilidad comunica estado y filtra resultados

- **Dado que:** El switch `Solo en stock` está apagado
- **Cuando:** Lo activo
- **Entonces:** El thumb se desplaza a la derecha, el control cambia a estado visual activo y el listado mantiene solo productos disponibles

#### Scenario 4: Persistencia de filtros en URL y recarga

- **Dado que:** Tengo activos `modo=Desde`, `precio=750` y `soloEnStock=true`
- **Cuando:** Recargo la página o comparto la URL y se vuelve a abrir
- **Entonces:** El catálogo restaura el mismo estado de filtros y resultados equivalentes

## Technical Notes

- **Component type:**
  - `CatalogFilters`: `[CC]` Client Component (estado UI, interacción de slider/toggle y serialización de query params)
  - Página de catálogo (`/catalogo`): `[SC]` Server Component (lectura de `searchParams` y fetch filtrado)
  - Lógica de fetch/parse de filtros: `[SA]` o capa server-side existente según arquitectura actual
- **Database changes:** No (sin migraciones; solo ajustes de lógica de filtrado y contrato UI).
- **RLS impact:** No (no cambia política de acceso; solo cambia criterio de consulta en storefront público).

## Dependencies

- HU-1.3 completada (base de búsqueda y filtrado existente).
- CHORE-2 completada (paridad visual general del storefront).
