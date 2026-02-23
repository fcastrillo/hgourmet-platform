# Objective: HU-2.8 — Gestión de recetas desde el panel

## Context
- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero crear, editar, publicar/despublicar, reordenar y eliminar recetas desde el panel, para poder mantener la sección de recetas y tips actualizada sin depender de soporte técnico.
- **Spec Level:** Lite
- **Git Strategy:** trunk (work continues on `main`)
- **Dependencies:** HU-4.3 consumirá los datos publicados de `recipes` en storefront.
- **Risk Areas:** consistencia del reordenamiento, sincronía estado publicado vs. storefront, carga de imagen en bucket `recipe-images`, validaciones de contenido largo.

## Acceptance Criteria (BDD)
- **Dado que** soy una administradora autenticada en `/admin/recetas`,
  **Cuando** completo título, contenido e imagen y presiono "Guardar",
  **Entonces** el sistema crea la receta, sube la imagen al bucket `recipe-images` y la muestra en la tabla con estado según el toggle.
- **Dado que** existe una receta publicada en la tabla,
  **Cuando** hago clic en el ícono de despublicar,
  **Entonces** el estado cambia a "Oculta" en la tabla sin abrir modal y la receta deja de estar disponible para el storefront público.
- **Dado que** intento guardar una receta sin título o sin contenido (escenario de error),
  **Cuando** envío el formulario,
  **Entonces** el sistema muestra mensajes de validación, no crea/actualiza el registro y conserva los datos capturados para corregir.

## Implementation Plan

### Task 1: Preparar modelo y tipos de recetas para admin (~35 min) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/types/database.ts` (Recipe type + recipes table), `.spec/work/FEAT-2/HU-2.8/notes.md`
- **Commit:** feat(HU-2.8): add Recipe type to database.ts + workspace notes

### Task 2: Crear migración para orden explícito de recetas (~40 min) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `supabase/migrations/004_recipes.sql`
- **Note:** Migración idempotente; crea tabla si no existe y agrega `display_order` con backfill.

### Task 3: Implementar capa de datos server-side para recetas admin (~45 min) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/lib/supabase/queries/admin-recipes.ts`, `src/app/(admin)/admin/recetas/actions.ts`

### Task 4: Construir tabla admin de recetas con estándar ADR-009 (~55 min) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/RecipeTable.tsx`, `src/components/admin/DeleteRecipeDialog.tsx`

### Task 5: Crear formulario de receta con validaciones y upload (~55 min) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/RecipeForm.tsx`

### Task 6: Integrar páginas `/admin/recetas` y sidebar (~40 min) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(admin)/admin/recetas/page.tsx`, `src/app/(admin)/admin/recetas/nuevo/page.tsx`, `src/app/(admin)/admin/recetas/[id]/editar/page.tsx`, `src/components/admin/AdminSidebar.tsx`

### Task 7: Cobertura de pruebas BDD (27 escenarios) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/tests/integration/hu-2.8-scenarios.test.tsx`
- **Result:** 27/27 tests pasando

## Database Changes (if applicable)
```sql
-- HU-2.8: explicit ordering for admin recipes table
alter table public.recipes
add column if not exists display_order integer not null default 0;

create index if not exists idx_recipes_display_order
on public.recipes (display_order);

-- Optional backfill for existing rows
with ordered as (
  select id, row_number() over (order by created_at asc) - 1 as rn
  from public.recipes
)
update public.recipes r
set display_order = o.rn
from ordered o
where r.id = o.id;
```

## Infrastructure Prerequisites
- Validar existencia de bucket `recipe-images` en Supabase Storage.
- Confirmar políticas Storage: `anon read`, `authenticated upload/delete`.
- Si el entorno no tiene bucket/policies, documentar pasos en `docs/SETUP.md`.

## Manual Testing Checklist
- [ ] Iniciar sesión como admin y abrir `/admin/recetas`.
- [ ] Crear receta con título, contenido e imagen válida; verificar persistencia en tabla.
- [ ] Editar receta existente y confirmar actualización de título/slug/contenido.
- [ ] Publicar y despublicar desde acción inline; verificar badge y estado en tabla.
- [ ] Intentar guardar sin título o sin contenido y validar mensajes de error.
- [ ] Reordenar dos recetas y confirmar que el orden permanece tras recarga.
- [ ] Eliminar receta y verificar confirmación + desaparición en listado.
- [ ] Confirmar que una receta despublicada no aparece en `/recetas` pública.
- [ ] Confirmar que una receta publicada sí aparece en `/recetas` y `/recetas/[slug]`.

## Definition of Done
- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors
- [ ] RLS policies tested (if applicable)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.8):` convention
- [ ] Tag `HU-2.8` created
