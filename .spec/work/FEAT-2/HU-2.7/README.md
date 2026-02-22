# HU-2.7: Icon buttons y toggle inline en CategoryTable

> **Feature:** FEAT-2 — Panel de Administración
> **Priority:** Low
> **Spec Level:** Lite

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** ver acciones compactas con iconos y poder activar/desactivar categorías inline
- **Para poder:** gestionar categorías de forma más ágil sin abrir modales innecesarios

---

## Acceptance Criteria

1. La columna "Acciones" de la tabla desktop muestra tres icon buttons (pencil, eye/eye-slash, trash) con tooltip nativo en lugar de botones de texto.
2. Al hacer clic en el icono de ojo en una categoría activa, se desactiva (`is_active=false`) y el icono cambia a eye-slash sin recargar la página.
3. Al hacer clic en el icono de ojo-tachado en una categoría inactiva, se activa (`is_active=true`) y el icono cambia a eye sin recargar la página.
4. En la vista mobile, las acciones mantienen formato táctil adecuado (iconos con label o labels visibles).
5. Los tests de integración pasan usando `aria-label="Editar"`, `aria-label="Activar"/"Desactivar"`, `aria-label="Eliminar"`.

---

## BDD Scenarios

### Escenario 1: Icon buttons en tabla desktop

> **Dado que** estoy en la tabla de categorías desktop,
> **Cuando** veo la columna "Acciones",
> **Entonces** veo tres icon buttons (pencil, eye/eye-slash, trash) con tooltip nativo en lugar de botones de texto.

### Escenario 2: Toggle desactivar categoría activa

> **Dado que** una categoría está activa (is_active=true),
> **Cuando** hago clic en el icono de ojo,
> **Entonces** la categoría se desactiva (is_active=false) y el icono cambia a eye-slash sin recargar la página.

### Escenario 3: Toggle activar categoría inactiva

> **Dado que** una categoría está inactiva (is_active=false),
> **Cuando** hago clic en el icono de ojo-tachado,
> **Entonces** la categoría se activa (is_active=true) y el icono cambia a eye sin recargar la página.

### Escenario 4: Acciones en vista mobile

> **Dado que** estoy en la vista mobile,
> **Cuando** veo las cards de categorías,
> **Entonces** las acciones mantienen formato táctil adecuado (con label o iconos con label).

### Escenario 5: Tests de integración compatibles

> **Dado que** los tests de integración buscan botones por aria-label,
> **Cuando** ejecuto la suite de tests,
> **Entonces** todos los tests pasan usando aria-label="Editar", aria-label="Activar"/"Desactivar", aria-label="Eliminar".

---

## Technical Notes

- **Components:** CategoryTable `[CC]` (modify), toggleCategoryActive `[SA]` (new server action)
- **Scope:** Cosmético + 1 server action nueva. No cambia lógica de negocio existente.
- **Icons:** Heroicons outline (misma librería SVG usada en el proyecto)
