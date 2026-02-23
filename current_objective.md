# Objective: HU-2.6 — Gestión de marcas/proveedores

## Context
- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero gestionar la lista de marcas y proveedores que se muestran en la sección "Nuestras Marcas" del sitio, para poder destacar las marcas con las que trabaja la tienda y actualizar la lista cuando se agreguen nuevos proveedores
- **Spec Level:** Lite
- **Reference Implementation:** HU-2.5 (banners) — mismo patrón CRUD + Storage + reorder + toggle
- **UI Standard:** ADR-009 (icon buttons, inline toggle, optimistic updates)

## Acceptance Criteria (BDD)

### Escenario 1: Crear marca exitosamente
> **Dado que** soy una administradora autenticada,
> **Cuando** creo una nueva marca con nombre "Wilton", logo y website, y presiono "Guardar",
> **Entonces** la marca se crea, el logo se sube a Supabase Storage, y la marca aparece en la sección "Nuestras Marcas" del storefront.

### Escenario 2: Desactivar marca
> **Dado que** quiero dejar de mostrar una marca temporalmente,
> **Cuando** desactivo el toggle "Activa" de la marca,
> **Entonces** la marca deja de mostrarse en el storefront pero permanece en la lista del panel.

### Escenario 3: Marca sin nombre (error)
> **Dado que** intento crear una marca sin nombre,
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra un mensaje de validación "El nombre es obligatorio" y no crea el registro.

## Implementation Plan

### Task 1: Database Migration + Types ✅
- **Type:** [DB]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `supabase/migrations/003_brands.sql` (created)
  - `src/types/database.ts` (modified — added brands table + Brand export)

### Task 2: Storage Setup Documentation ✅
- **Type:** [DOCS]
- **Cycle:** IMPLEMENT ✅ → REFACTOR ✅
- **Files modified:**
  - `docs/SETUP.md` (modified — added section 5.4 brand-logos bucket)

### Task 3: Query Helpers ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/lib/supabase/queries/admin-brands.ts` (created)
  - `src/lib/supabase/queries/brands.ts` (created)

### Task 4: Server Actions ✅
- **Type:** [SA]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/app/(admin)/admin/marcas/actions.ts` (created)

### Task 5: BrandTable Component ✅
- **Type:** [CC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/components/admin/BrandTable.tsx` (created)

### Task 6: BrandForm Component ✅
- **Type:** [CC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/components/admin/BrandForm.tsx` (created)

### Task 7: DeleteBrandDialog Component ✅
- **Type:** [CC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/components/admin/DeleteBrandDialog.tsx` (created)

### Task 8: Admin Pages ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/app/(admin)/admin/marcas/page.tsx` (created)
  - `src/app/(admin)/admin/marcas/nuevo/page.tsx` (created)
  - `src/app/(admin)/admin/marcas/[id]/editar/page.tsx` (created)

### Task 9: Admin Navigation Update ✅
- **Type:** [CC]
- **Cycle:** IMPLEMENT ✅ → REFACTOR ✅
- **Files modified:**
  - `src/app/(admin)/admin/page.tsx` (modified — Marcas + Banners cards ready: true)

### Task 10: Integration Tests ✅
- **Type:** [TEST]
- **Cycle:** IMPLEMENT ✅ → REFACTOR ✅
- **Files modified:**
  - `src/tests/integration/hu-2.6-scenarios.test.tsx` (created)
- **Result:** 24 tests passing

## Database Changes

```sql
-- Migration: 003_brands
-- HU-2.6: Gestión de marcas/proveedores

CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_brands_display_order ON brands(display_order);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands_anon_select" ON brands
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "brands_auth_all" ON brands
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

## Infrastructure Prerequisites

- **Supabase Storage bucket `brand-logos`:** Must be created manually before testing image upload. Instructions added to `docs/SETUP.md` section 5.4.

## Manual Testing Checklist
- [ ] Navigate to `/admin/marcas` — empty state shown with CTA
- [ ] Click "Nueva marca" → redirected to `/admin/marcas/nuevo`
- [ ] Submit form without name → validation error "El nombre es obligatorio."
- [ ] Create brand "Wilton" with logo and website → brand appears in list
- [ ] Verify logo uploaded to `brand-logos` bucket in Supabase Dashboard
- [ ] Edit brand — change name, change logo → updates saved correctly
- [ ] Toggle is_active inline (eye icon) → badge changes optimistically
- [ ] Verify inactive brand does NOT appear on storefront (`/`)
- [ ] Reorder brands with ▲/▼ → order persists after reload
- [ ] Delete brand → confirmation dialog → brand removed, logo deleted from storage
- [ ] Responsive: verify mobile card layout at < 768px

## Definition of Done
- [x] All BDD criteria have passing tests (24/24)
- [x] No TypeScript errors (in new files)
- [ ] RLS policies tested (via manual checklist)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.6):` convention
- [ ] Tag `HU-2.6` created
