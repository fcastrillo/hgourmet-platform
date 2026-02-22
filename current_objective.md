# Objective: HU-2.4 — Gestión de categorías

## Context
- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero crear, editar, reordenar y ocultar categorías de productos desde el panel, para poder organizar el catálogo según las necesidades del negocio sin intervención técnica
- **Spec Level:** Standard
- **Git Strategy:** trunk (commits directos a `main`)
- **TDD Mode:** flexible (`IMPLEMENT → TEST → REFACTOR`)

## Acceptance Criteria (BDD)

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

## Implementation Plan

### Task 1: Utility — Slugify helper (~10 min)
- **Type:** [UTIL]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/lib/slugify.ts` (create)
- **Details:** Función `slugify(name: string): string` que convierte un nombre a slug URL-friendly (lowercase, sin acentos, espacios → guiones, sin caracteres especiales). Se reutilizará en HU-2.2 y HU-2.5.
- **Verification:** `npx vitest run slugify` (o test inline)

### Task 2: Admin queries — Fetch categories for admin panel (~15 min)
- **Type:** [SC] Server-side queries
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/lib/supabase/queries/admin-categories.ts` (create)
- **Details:**
  - `fetchAllCategoriesAdmin()`: Todas las categorías (sin filtro `is_active`), ordenadas por `display_order ASC`. Incluye conteo de productos asociados via subquery o join.
  - `fetchCategoryByIdAdmin(id)`: Una categoría por ID.
- **Verification:** Verificar que las queries devuelven datos correctos con el servidor de desarrollo.

### Task 3: Server Actions — Category CRUD + reorder (~40 min)
- **Type:** [SA] Server Actions
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/app/(admin)/admin/categorias/actions.ts` (create)
- **Details:**
  - `createCategory(formData)`: Valida nombre obligatorio, genera slug con `slugify()`, asigna `display_order = MAX + 1`, inserta en BD. Retorna `{ success, error? }`.
  - `updateCategory(id, formData)`: Actualiza nombre (regenera slug si nombre cambia), descripción, is_active. Retorna `{ success, error? }`.
  - `deleteCategory(id)`: Verifica conteo de productos asociados. Si > 0, retorna error con mensaje y conteo. Si 0, elimina. Retorna `{ success, error? }`.
  - `reorderCategories(orderedIds: string[])`: Recibe array de IDs en el nuevo orden, actualiza `display_order` de cada uno en una transacción. Retorna `{ success, error? }`.
  - Todas las acciones llaman `revalidatePath('/admin/categorias')` y `revalidatePath('/')` para invalidar cache del storefront.
- **Verification:** Probar cada action desde la UI en Task 6.

### Task 4: Category list page (~30 min)
- **Type:** [SC] Server Component (page)
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/app/(admin)/admin/categorias/page.tsx` (create)
- **Details:**
  - Server Component que llama a `fetchAllCategoriesAdmin()`.
  - Renderiza encabezado "Categorías" con botón "Nueva categoría".
  - Pasa datos a `<CategoryTable>` (Client Component).
  - Maneja empty state: "No hay categorías. Crea la primera."
- **Verification:** `npm run dev` → navegar a `/admin/categorias`.

### Task 5: CategoryTable component con reorder (~45 min)
- **Type:** [CC] Client Component
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/components/admin/CategoryTable.tsx` (create)
- **Details:**
  - Tabla con columnas: Orden, Nombre, Slug, Productos (conteo), Estado, Acciones.
  - Controles de reorden: botones ▲/▼ por fila (sin drag & drop para mantener simplicidad). Al mover, llama a `reorderCategories()` server action.
  - Badge "Activa" (verde) / "Inactiva" (gris) según `is_active`.
  - Botones de acción: Editar (abre modal), Eliminar (abre confirmación).
  - Responsive: en mobile se usa layout de cards en lugar de tabla.
- **Verification:** Verificar visualmente la tabla con datos seed.

### Task 6: CategoryFormModal component (~40 min)
- **Type:** [CC] Client Component
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/components/admin/CategoryFormModal.tsx` (create)
- **Details:**
  - Modal/dialog para crear y editar categorías.
  - Campos: nombre (required), descripción (optional textarea), is_active (toggle/switch).
  - Preview del slug generado automáticamente mientras se escribe el nombre (client-side slugify).
  - Validación client-side: nombre obligatorio.
  - Submit llama a `createCategory()` o `updateCategory()` según contexto.
  - Estados: idle, submitting, success (cierra modal), error (muestra mensaje).
  - Usa `useActionState` o `useTransition` para manejar la transición.
- **Verification:** Probar flujo completo crear → ver en lista → editar → ver cambios.

### Task 7: Delete confirmation with FK protection (~20 min)
- **Type:** [CC] Client Component
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:**
  - `src/components/admin/DeleteCategoryDialog.tsx` (create)
- **Details:**
  - Dialog de confirmación antes de eliminar.
  - Muestra nombre de la categoría y advierte que la acción es irreversible.
  - Al confirmar, llama a `deleteCategory(id)`.
  - Si retorna error (productos asociados), muestra: "No se puede eliminar: N productos asociados. Mueva o elimine los productos primero."
  - Si éxito, cierra dialog y la lista se refresca via `revalidatePath`.
- **Verification:** Intentar eliminar categoría con productos → ver mensaje de error. Eliminar categoría sin productos → éxito.

### Task 8: Integration tests (~30 min)
- **Type:** [TEST]
- **Cycle:** TEST
- **Files:**
  - `src/tests/integration/categories-admin.test.ts` (create)
- **Details:**
  - Test de server actions: createCategory con datos válidos, createCategory con nombre vacío, deleteCategory con FK, reorderCategories.
  - Test de slugify: caracteres especiales, acentos, espacios múltiples.
- **Verification:** `npx vitest run categories-admin`

### Task 9: Manual testing and polish (~15 min)
- **Type:** [MANUAL]
- **Cycle:** VERIFY
- **Files:** N/A
- **Details:** Ejecución del checklist manual completo.
- **Verification:** Todos los ítems del checklist marcados.

## Database Changes

No se requieren cambios en la base de datos. La tabla `categories` ya existe con todos los campos necesarios (`name`, `slug`, `description`, `display_order`, `is_active`, `created_at`) y las RLS policies están configuradas (anon: SELECT, authenticated: full CRUD).

La restricción FK `products.category_id → categories.id ON DELETE RESTRICT` ya está en vigor.

## Manual Testing Checklist

- [ ] Navegar a `/admin/categorias` — la lista muestra las categorías existentes con nombre, slug, orden y estado
- [ ] Hacer clic en "Nueva categoría" — se abre el modal de creación
- [ ] Crear categoría "Especias" — aparece en la lista con slug "especias" y orden correcto
- [ ] Editar la categoría creada — cambiar nombre y descripción — cambios se guardan correctamente
- [ ] Toggle is_active a false — la categoría muestra badge "Inactiva" y no aparece en el storefront
- [ ] Reordenar una categoría (mover arriba/abajo) — el orden se actualiza y se refleja en la lista
- [ ] Intentar eliminar categoría con productos — se muestra error con conteo de productos
- [ ] Eliminar categoría sin productos — eliminación exitosa
- [ ] Verificar que el storefront refleja los cambios (navegación por categorías actualizada)

## Definition of Done

- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors
- [ ] RLS policies tested (categories: anon SELECT, authenticated CRUD)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.4):` convention
- [ ] Tag `HU-2.4` created
