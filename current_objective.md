# Objective: HU-2.7 — Icon buttons y toggle inline en CategoryTable

## Context
- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero ver acciones compactas con iconos y poder activar/desactivar categorías inline, para poder gestionar categorías de forma más ágil sin abrir modales innecesarios
- **Spec Level:** Lite
- **Note:** Esta HU establece el nuevo estándar de UI para las pantallas de administración subsecuentes (HU-2.5, HU-2.6, etc.). Los patrones aquí definidos (icon buttons con tooltip, toggle inline, aria-labels) deben replicarse en futuras tablas de administración.

## Acceptance Criteria (BDD)

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

## Implementation Plan

### Task 1: Crear server action `toggleCategoryActive` ✅
- **Type:** [SA]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(admin)/admin/categorias/actions.ts`

### Task 2: Modificar CategoryTable — Icon buttons + toggle inline ✅
- **Type:** [CC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/CategoryTable.tsx`

### Task 3: Actualizar tests de integración ✅
- **Type:** [TEST]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/tests/integration/hu-2.4-scenarios.test.tsx`

## Database Changes
N/A — No se requieren cambios de base de datos.

## Manual Testing Checklist
- [ ] Desktop: La columna Acciones muestra 3 icon buttons (pencil, eye, trash) con tooltip nativo al hacer hover
- [ ] Desktop: Click en pencil abre modal de edición (misma funcionalidad)
- [ ] Desktop: Click en eye (categoría activa) → cambia a eye-slash, badge cambia a "Inactiva"
- [ ] Desktop: Click en eye-slash (categoría inactiva) → cambia a eye, badge cambia a "Activa"
- [ ] Desktop: Click en trash abre dialog de confirmación (misma funcionalidad)
- [ ] Mobile: Cards muestran icon buttons con labels visibles
- [ ] Mobile: Toggle funciona igual que en desktop
- [ ] Tests: `npx vitest run hu-2.4` pasa al 100%

## Definition of Done
- [x] All BDD criteria have passing tests
- [x] No TypeScript errors
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.7):` convention
- [ ] Tag `HU-2.7` created
