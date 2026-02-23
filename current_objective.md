# Objective: HU-2.5 — Gestión de banners rotativos

## Context
- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero crear, editar, reordenar y activar/desactivar banners promocionales desde el panel, para poder mantener la página principal actualizada con promociones y novedades sin soporte técnico
- **Spec Level:** Standard

## Acceptance Criteria (BDD)

### Escenario 1: Crear banner exitosamente
> **Dado que** soy una administradora autenticada,
> **Cuando** creo un nuevo banner con título "Promoción Navidad", imagen y link a la categoría de temporada, y presiono "Guardar",
> **Entonces** el banner se crea, la imagen se sube a Supabase Storage, y el banner aparece en el carrusel de la página principal.

### Escenario 2: Desactivar banner
> **Dado que** quiero desactivar un banner porque la promoción terminó,
> **Cuando** desactivo el toggle "Activo" del banner,
> **Entonces** el banner deja de mostrarse en el carrusel público pero permanece en la lista del panel para reactivación futura.

### Escenario 3: Banner sin imagen (error)
> **Dado que** intento crear un banner sin subir una imagen,
> **Cuando** envío el formulario,
> **Entonces** el sistema muestra un mensaje de validación "La imagen es obligatoria" y no crea el banner.

### Criterios adicionales (lista)
1. La lista de banners muestra título, imagen (miniatura), link destino, orden y estado (activo/inactivo).
2. El formulario de creación/edición incluye: título, subtítulo (opcional), imagen (upload a bucket `banner-images`), link URL (opcional), y toggle is_active.
3. Se puede reordenar los banners mediante controles de subir/bajar.
4. Las imágenes se suben a Supabase Storage bucket `banner-images`.
5. Solo los banners con is_active = true se muestran en el carrusel de la página principal.

## Implementation Plan

### Task 1: Database Migration — Tabla `banners` + RLS ✅
- **Type:** [DB]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `supabase/migrations/002_banners.sql`
- **Details:**
  - CREATE TABLE `banners` (id uuid PK, title text, subtitle text, image_url text NOT NULL, link_url text, is_active boolean NOT NULL default true, display_order integer NOT NULL default 0, created_at timestamptz NOT NULL default now())
  - Index on `display_order`
  - RLS enabled: `banners_anon_select` (anon SELECT where is_active = true), `banners_auth_all` (authenticated ALL)
- **Verification:** Run SQL in Supabase Dashboard → verify table exists with `SELECT * FROM banners`

### Task 2: Infrastructure — Storage Bucket `banner-images` ✅
- **Type:** [DB]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `docs/SETUP.md`
- **Details:**
  - Create public bucket `banner-images` in Supabase Dashboard → Storage
  - Policies: SELECT for anon+authenticated, INSERT/UPDATE/DELETE for authenticated only
  - File size limit: 5 MB (same as product-images)
- **Verification:** Upload a test image to bucket via Dashboard → verify public URL works

### Task 3: TypeScript Types — Banner ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/types/database.ts`
- **Details:**
  - Add `banners` table definition to `Database["public"]["Tables"]` following exact pattern of `categories`
  - Export `Banner` type alias
- **Verification:** `npx tsc --noEmit` passes

### Task 4: Data Access Layer — Queries ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/lib/supabase/queries/admin-banners.ts`
  - `src/lib/supabase/queries/banners.ts`
- **Details:**
  - `admin-banners.ts`: `fetchAllBannersAdmin()`, `fetchBannerByIdAdmin(id)`, `fetchMaxBannerDisplayOrder()` — follow `admin-categories.ts` pattern
  - `banners.ts`: `fetchActiveBanners()` — for storefront carousel, ordered by display_order, filtered by is_active = true
- **Verification:** `npx tsc --noEmit` passes

### Task 5: Server Actions — Banner CRUD + Image Upload ✅
- **Type:** [SA]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/app/(admin)/admin/banners/actions.ts`
- **Details:**
  - `uploadBannerImage(supabase, file)` — upload to `banner-images` bucket, UUID filename, return public URL (follow `productos/actions.ts` pattern)
  - `deleteBannerImage(supabase, imageUrl)` — remove from Storage
  - `createBanner(formData)` — validate image required, title optional, upload image, insert record with auto display_order
  - `updateBanner(id, formData)` — handle image replacement (delete old + upload new) or keep existing
  - `deleteBanner(id)` — delete from DB + delete image from Storage
  - `toggleBannerActive(id, isActive)` — inline toggle (ADR-009)
  - `reorderBanners(orderedIds)` — batch update display_order
  - All return `ActionResult`, all call `revalidateBannerPaths()`
- **Verification:** `npx tsc --noEmit` passes

### Task 6: BannerTable Component ✅
- **Type:** [CC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/components/admin/BannerTable.tsx`
- **Details:**
  - Follow `CategoryTable.tsx` pattern exactly (ADR-009):
    - Optimistic toggle with `useTransition` + `activeOverrides` state map
    - Icon buttons: pencil (edit), eye/eye-slash (toggle active), trash (delete)
    - Native tooltips via `title` + `aria-label`
    - Responsive: desktop table `hidden md:block` + mobile cards `md:hidden`
    - Mobile: icon buttons with visible labels, `min-h-[44px]` touch targets
  - Columns: Imagen (thumbnail 64x64), Título, Link, Orden, Estado (badge), Acciones
  - Reorder controls (▲/▼) in Orden column
  - Image thumbnail with `<img>` or `next/image`
  - Empty state when no banners exist
- **Verification:** `npx tsc --noEmit` passes

### Task 7: BannerForm + DeleteBannerDialog Components ✅
- **Type:** [CC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/components/admin/BannerForm.tsx`
  - `src/components/admin/DeleteBannerDialog.tsx`
- **Details:**
  - `BannerForm`: Follow `ProductForm.tsx` pattern for image upload:
    - Fields: título, subtítulo (optional), imagen (upload), link URL (optional), is_active toggle (ADR-010 React state pattern)
    - Image preview with FileReader
    - Validation: image required for creation, optional for edit (keep existing)
    - Submit via FormData to server action
  - `DeleteBannerDialog`: Follow `DeleteCategoryDialog.tsx` / `DeleteProductDialog.tsx` pattern
    - Confirmation modal with banner title
    - Calls `deleteBanner` server action
- **Verification:** `npx tsc --noEmit` passes

### Task 8: Admin Banner Pages ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/app/(admin)/admin/banners/page.tsx`
  - `src/app/(admin)/admin/banners/nuevo/page.tsx`
  - `src/app/(admin)/admin/banners/[id]/editar/page.tsx`
- **Details:**
  - `page.tsx`: RSC — fetch all banners, render `<BannerTable />`, "Nuevo banner" button
  - `nuevo/page.tsx`: RSC — render `<BannerForm />` for creation
  - `[id]/editar/page.tsx`: RSC — fetch banner by ID, render `<BannerForm banner={data} />`
  - Follow existing patterns from `categorias/page.tsx` and `productos/` pages
- **Verification:** Dev server renders pages at `/admin/banners`, `/admin/banners/nuevo`

### Task 9: Banner Carousel — Storefront Integration ✅
- **Type:** [CC] + [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/components/storefront/BannerCarousel.tsx`
  - `src/app/(storefront)/page.tsx`
- **Details:**
  - `BannerCarousel.tsx` [CC]: Auto-play carousel with:
    - Slide transition (CSS transform/opacity)
    - Dot indicators for navigation
    - Pause on hover
    - Touch/swipe support (optional, nice-to-have)
    - Responsive image sizing
    - Link wrapping when banner has `link_url`
    - Fallback to `HomepageHero` when no active banners
  - `page.tsx` [SC]: Fetch active banners via `fetchActiveBanners()`, pass to `BannerCarousel`
  - If no active banners → render existing `HomepageHero` as fallback
- **Verification:** Homepage shows carousel with active banners, auto-plays, dots navigate

### Task 10: Tests — Server Actions + Components ✅
- **Type:** [TEST]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:**
  - `src/tests/integration/hu-2.5-scenarios.test.tsx` (23 tests, all passing)
- **Details:**
  - **banner-actions.test.ts**: Test createBanner (with image validation), toggleBannerActive, deleteBanner
  - **banner-table.test.tsx**: Test optimistic toggle renders correctly, reorder controls, empty state
  - **banner-form.test.tsx**: Test image required validation, form submission, image preview
  - Follow existing test patterns in `src/tests/`
- **Verification:** `npm test` passes with all new tests green

### Task 11: SETUP.md Update + Manual Testing ✅
- **Type:** [DB]
- **Cycle:** IMPLEMENT ✅ → REFACTOR ✅
- **Files modified:**
  - `docs/SETUP.md`
- **Details:**
  - Add section 3.7 for `002_banners.sql` migration documentation
  - Move `banner-images` from "Future buckets" to implemented buckets section
  - Add banner-specific RLS documentation
- **Verification:** SETUP.md accurately reflects all infrastructure changes

## Database Changes

### Migration: `supabase/migrations/002_banners.sql`

```sql
-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for ordering
CREATE INDEX idx_banners_display_order ON banners (display_order);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Anon: read active banners only
CREATE POLICY banners_anon_select ON banners
  FOR SELECT TO anon
  USING (is_active = true);

-- Authenticated: full access
CREATE POLICY banners_auth_all ON banners
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
```

## Manual Testing Checklist
- [ ] Navigate to `/admin/banners` — page loads with empty state or existing banners
- [ ] Click "Nuevo banner" — form page loads
- [ ] Create banner with title, image, and link — verify it saves and appears in list
- [ ] Try to create banner without image — validation error "La imagen es obligatoria" appears
- [ ] Edit an existing banner — change title, verify update persists
- [ ] Edit banner and replace image — old image removed, new image uploaded
- [ ] Toggle banner active/inactive via eye icon — badge and icon update optimistically
- [ ] Reorder banners with ▲/▼ controls — order changes persist after reload
- [ ] Delete a banner — confirmation dialog appears, banner removed from list and image deleted from storage
- [ ] Navigate to homepage (`/`) — active banners appear in carousel
- [ ] Verify carousel auto-plays and dot indicators work
- [ ] Deactivate all banners — homepage shows fallback `HomepageHero`
- [ ] Test responsive: mobile cards layout, touch targets ≥ 44px

## Definition of Done
- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] RLS policies tested (anon sees active only, authenticated has full access)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.5):` convention
- [ ] Tag `HU-2.5` created
