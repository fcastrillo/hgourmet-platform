# HU-2.4: Gestión de categorías

> **Feature:** FEAT-2 — Panel de Administración
> **Priority:** Medium

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** crear, editar, reordenar y ocultar categorías de productos desde el panel
- **Para poder:** organizar el catálogo según las necesidades del negocio sin intervención técnica

---

## Acceptance Criteria

1. La lista de categorías muestra nombre, slug, orden de visualización y estado (activa/inactiva).
2. El formulario de creación/edición incluye: nombre, descripción (opcional), y toggle is_active.
3. El slug se genera automáticamente a partir del nombre.
4. Se puede reordenar categorías mediante drag & drop o controles de subir/bajar.
5. Ocultar una categoría (is_active = false) la retira de la navegación pública pero no elimina sus productos.
6. No se puede eliminar una categoría que tenga productos asociados (FK RESTRICT).

---

## BDD Scenarios

### Escenario 1: Crear categoría exitosamente

> **Dado que** soy una administradora autenticada,
> **Cuando** creo una nueva categoría con nombre "Especias" y presiono "Guardar",
> **Entonces** la categoría se crea con slug "especias", display_order asignado automáticamente, y aparece en la lista del panel y en la navegación del storefront.

### Escenario 2: Reordenar categorías

> **Dado que** soy una administradora y quiero reordenar las categorías,
> **Cuando** cambio el orden de "Moldes" de posición 4 a posición 2,
> **Entonces** las posiciones de las categorías intermedias se ajustan automáticamente y el orden se refleja en la navegación pública.

### Escenario 3: Eliminar categoría con productos asociados (error)

> **Dado que** intento eliminar la categoría "Chocolate" que tiene 15 productos asociados,
> **Cuando** confirmo la eliminación,
> **Entonces** el sistema bloquea la operación y muestra "No se puede eliminar: 15 productos asociados. Mueva o elimine los productos primero."

---

## Technical Notes

- **Components:** Category list `[SC]`, Category form `[CC]`, Reorder controls `[CC]`, Category CRUD actions `[SA]`
- **FK constraint:** `products.category_id → categories.id ON DELETE RESTRICT`
- **Slug generation:** Automática desde el nombre (slugify)
- **Display order:** Asignar `MAX(display_order) + 1` al crear
