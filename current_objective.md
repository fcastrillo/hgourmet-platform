# Objective: HU-2.2 — CRUD de productos desde el panel

## Context

- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero crear, ver, editar y ocultar productos desde el panel de administración, para poder mantener el catálogo actualizado con información precisa de precios, disponibilidad e imágenes
- **Spec Level:** Standard
- **tdd_mode:** flexible (IMPLEMENT → TEST → REFACTOR)
- **git_strategy:** trunk (commits directos a `main`)

## Acceptance Criteria (BDD)

### Escenario 1: Crear producto exitosamente

> **Dado que** soy una administradora autenticada en el panel,
> **Cuando** completo el formulario de nuevo producto con datos válidos (nombre, precio, categoría, imagen) y presiono "Guardar",
> **Entonces** el producto se crea en la base de datos, la imagen se sube a Supabase Storage, y el producto aparece en la lista del panel y en el catálogo público.

### Escenario 2: Editar producto

> **Dado que** soy una administradora viendo la lista de productos,
> **Cuando** hago clic en "Editar" de un producto existente, modifico el precio y presiono "Guardar",
> **Entonces** el precio se actualiza en la base de datos y el cambio se refleja inmediatamente en la lista del panel.

### Escenario 3: Ocultar producto (edge case)

> **Dado que** soy una administradora y quiero retirar un producto del catálogo sin eliminarlo,
> **Cuando** desactivo el toggle "Visible" de un producto,
> **Entonces** el producto deja de mostrarse en el storefront público pero sigue visible en la lista del panel con un indicador de "Oculto".

### Escenario 4: Validación de datos (error)

> **Dado que** intento crear un producto con precio ≤ 0 o sin nombre,
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra mensajes de validación específicos y no crea el registro.

## Analysis

### Data Changes

- **No new tables or columns:** The `products` table already exists with all required fields.
- **Storage prerequisite:** Supabase Storage bucket `product-images` must exist with public read access (anon: read, auth: full CRUD). Verify via Supabase dashboard before starting.

### Component Classification

| Component | Type | Description |
|:----------|:-----|:------------|
| Products admin list page | `[SC]` | `/admin/productos/page.tsx` — reads searchParams, fetches paginated products |
| Product create page | `[SC]` | `/admin/productos/nuevo/page.tsx` — fetches categories, renders form |
| Product edit page | `[SC]` | `/admin/productos/[id]/editar/page.tsx` — fetches product + categories |
| ProductTable | `[CC]` | Table with search, pagination, ADR-009 icon actions, optimistic toggle |
| ProductForm | `[CC]` | Complex form with image upload, slug preview, validation |
| ImageUpload | `[CC]` | Image file input with preview, drag & drop, file validation |
| DeleteProductDialog | `[CC]` | Confirmation dialog following DeleteCategoryDialog pattern |
| Product CRUD actions | `[SA]` | createProduct, updateProduct, deleteProduct, toggleProductVisibility |
| Admin product queries | helper | fetchProductsAdmin (paginated), fetchProductByIdAdmin |

### Dependencies

- ✅ HU-2.1: Auth system with protected `/admin/*` routes
- ✅ HU-2.4: Categories CRUD (provides category select data for product form)
- ✅ HU-2.7: ADR-009 UI standard (icon buttons, inline toggle, optimistic updates)

### Architecture Decisions

1. **Separate pages for create/edit** (not modals): The product form includes image upload and 8+ fields — too complex for a modal. Create/edit are separate pages; the list page uses a table with inline actions.
2. **Server-side pagination:** Products can reach 300-1000 items. URL searchParams (`?page=N&search=query`) drive server-side filtering/pagination.
3. **Image upload via FormData:** The File object is sent as part of FormData to the server action, which handles the Supabase Storage upload. Avoids client-side Storage SDK calls and orphaned files.
4. **Toggle visibility inline (ADR-009):** The `is_visible` toggle follows the eye/eye-slash pattern from CategoryTable. The `is_featured` and `is_seasonal` flags are managed in the edit form (changed less frequently).

### Risk Areas

- **Image upload:** First implementation of Storage upload in the project. Must handle file size limits, type validation, and upload errors.
- **Slug uniqueness:** Must validate slug doesn't already exist. Handle edge cases (two products named the same).
- **Pagination state:** Search + pagination interaction must be smooth (resetting to page 1 on new search).

## Implementation Plan

### Task 1: Admin product query helpers ✅

- **Type:** `[SC]` helper
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/lib/supabase/queries/admin-products.ts`
- **Verification:** 164/164 tests passing

### Task 2: Product server actions ✅

- **Type:** `[SA]`
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(admin)/admin/productos/actions.ts`
- **Verification:** 164/164 tests passing

### Task 3: DeleteProductDialog component ✅

- **Type:** `[CC]`
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/DeleteProductDialog.tsx`
- **Verification:** 164/164 tests passing

### Task 4: ProductTable component ✅

- **Type:** `[CC]`
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/ProductTable.tsx`
- **Verification:** 164/164 tests passing

### Task 5: ProductForm component ✅

- **Type:** `[CC]`
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/ProductForm.tsx`
- **Verification:** 164/164 tests passing

### Task 6: Admin product pages ✅

- **Type:** `[SC]`
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/app/(admin)/admin/productos/page.tsx`
  - `src/app/(admin)/admin/productos/nuevo/page.tsx`
  - `src/app/(admin)/admin/productos/[id]/editar/page.tsx`
- **Note:** AdminSidebar already had active Link to `/admin/productos` — no update needed.
- **Verification:** 164/164 tests passing

### Task 7: Integration tests — BDD scenarios ✅

- **Type:** `[TEST]`
- **Cycle:** TEST ✅
- **Files modified:** `src/tests/integration/hu-2.2-scenarios.test.tsx`
- **Results:** 29 tests passing (all 4 BDD scenarios + additional coverage)
- **Verification:** 164/164 tests passing (no regressions)

## Database Changes

No schema changes required. The `products` table and all required columns already exist.

**Pre-requisite (manual):** Verify that the Supabase Storage bucket `product-images` exists with these policies:
- anon: public read (SELECT)
- authenticated: full CRUD (INSERT, SELECT, UPDATE, DELETE)

If the bucket does not exist, create it via Supabase dashboard before starting Task 2.

## Manual Testing Checklist

- [ ] Navigate to `/admin/productos` — empty state shown if no products
- [ ] Click "Nuevo producto" → create form appears with all fields
- [ ] Fill valid data (name, price, category, image) → save → product appears in list
- [ ] Verify slug was generated automatically from the name
- [ ] Verify image appears as thumbnail in the list
- [ ] Click pencil icon on a product → edit form opens with pre-filled data
- [ ] Change price → save → new price reflected in list
- [ ] Click eye icon (toggle visibility) → badge changes to "Oculto" optimistically
- [ ] Verify hidden product does NOT appear in public storefront (`/categorias/[slug]`)
- [ ] Click eye-slash icon again → product becomes visible again in storefront
- [ ] Click trash icon → confirmation dialog appears with product name
- [ ] Confirm deletion → product removed from list
- [ ] Try to create product with empty name → validation error shown
- [ ] Try to create product with price = 0 → validation error shown
- [ ] Try to create product without category → validation error shown
- [ ] Search for product by name → list filters correctly
- [ ] Navigate through pages if more than 10 products exist
- [ ] Test on mobile viewport — cards layout with touch-friendly buttons

## Definition of Done

- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] RLS policies verified (authenticated user can CRUD products)
- [ ] Image upload to `product-images` bucket works
- [ ] ADR-009 pattern followed (icon buttons, optimistic toggle, responsive)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.2):` convention
- [ ] Tag `HU-2.2` created

## Deviations

1. **AdminSidebar already had active links:** The plan included updating AdminSidebar, but it already had active `<Link>` components pointing to `/admin/productos`. No update was needed.
2. **noValidate on form:** Added `noValidate` to the `<form>` element in ProductForm to prevent HTML5 native validation from blocking our custom validation (discovered during testing when `min="0.01"` on the price input prevented `onSubmit` from firing for value "0").
3. **ImageUpload as separate component:** Was merged directly into ProductForm instead of creating a standalone `ImageUpload.tsx`, as the upload logic is tightly coupled to the form's FormData flow and a separate component added unnecessary indirection.
