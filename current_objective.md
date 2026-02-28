# Objective: HU-6.2 — Edición de recetas en campos estructurados (ingredientes, preparación, tip)

## Context
- **Feature:** FEAT-6 — Evolución UX del Panel de Administración
- **Story:** Como administradora, quiero editar recetas en campos independientes para ingredientes, preparación y tip HGourmet, para poder publicar contenido consistente sin depender de escribir Markdown manual.
- **Spec Level:** Standard
- **Branch:** `hu/6.2`
- **TDD Mode (`.spec/config.md`):** `flexible` (`IMPLEMENT → TEST → REFACTOR`)

## Acceptance Criteria (BDD)

1) Captura estructurada sin Markdown obligatorio
- **Dado que**: estoy creando o editando una receta en el panel admin
- **Cuando**: completo los campos de ingredientes, preparación y tip
- **Entonces**: la receta se guarda correctamente sin requerir sintaxis Markdown.

2) Compatibilidad con contenido legacy
- **Dado que**: existe una receta previa con contenido unificado en `content`
- **Cuando**: abro la receta para editar
- **Entonces**: el sistema preserva la información y permite migrarla a campos estructurados sin pérdida de datos.

3) Escenario de excepción (validación por sección)
- **Dado que**: envío el formulario con datos incompletos en secciones obligatorias
- **Cuando**: intento guardar la receta
- **Entonces**: se muestran errores de validación por campo y no se persiste contenido inválido.

## Validation Report (Step 0 — @validate embebido)

```
=== VALIDATION REPORT ===
Target: HU-6.2 — Edición de recetas en campos estructurados
Level: Standard

✅ PRD.md: visión, usuarios, alcance IN/OUT y KPIs completos.
✅ TECH_SPEC.md: stack, data model, auth y RLS/policies documentados.
✅ FEAT-6: hipótesis de beneficio completa y HU asociadas existentes.
✅ HU-6.2: formato Como/Quiero/Para poder + >=2 BDD + escenario de error.
⚠️ FEAT-6 hypothesis style: redacción causal válida, no sigue literal "Si entregamos..., entonces...".

RESULT: WARNINGS
ACTION: Continuar con @start-objective HU-6.2 (sin bloqueadores).
```

## Implementation Plan

### Task 1: Definir contrato de contenido estructurado y compatibilidad legacy ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/lib/recipe-content.ts` (new)
- **Commit:** d064b33

### Task 2: Preparar migración DB para campos separados en `recipes` ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `supabase/migrations/006_hu_6_2_recipes_structured_fields.sql` (new), `src/types/database.ts`
- **Commit:** 255c99d

### Task 3: Adaptar Server Actions de recetas para leer/escribir estructura nueva ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(admin)/admin/recetas/actions.ts`
- **Commit:** 4f39ab4

### Task 4: Refactor del formulario admin a 3 campos (ingredientes, preparación, tip) ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/RecipeForm.tsx`
- **Commit:** 5f83cbe

### Task 5: Storefront usa getRecipeSections() con fallback robusto ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(storefront)/recetas/[slug]/page.tsx`
- **Commit:** c7a812f

### Task 6 + 7: Tests de integración HU-6.2 (AC1/AC2/AC3) + actualización HU-2.8 ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/tests/integration/hu-6.2-scenarios.test.tsx` (new), `src/tests/integration/hu-2.8-scenarios.test.tsx`, `src/tests/integration/hu-4.3-scenarios.test.tsx`
- **Result:** 435/435 tests passing | 0 TypeScript errors
- **Commit:** 0014fb7, 40345a3

## Database Changes

```sql
-- HU-6.2: Structured recipe content while preserving legacy compatibility
ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS ingredients_text text,
  ADD COLUMN IF NOT EXISTS preparation_text text,
  ADD COLUMN IF NOT EXISTS tip_text text;

COMMENT ON COLUMN public.recipes.ingredients_text IS 'Recipe ingredients in plain text format (one item per line).';
COMMENT ON COLUMN public.recipes.preparation_text IS 'Recipe preparation steps in plain text format (one step per line or numbered).';
COMMENT ON COLUMN public.recipes.tip_text IS 'Optional HGourmet tip for recipe detail page.';
```

> Nota: `content` se mantiene para backward compatibility y fallback de render/migración progresiva.

## Infrastructure Prerequisites
- No se requieren nuevos buckets, credenciales ni variables de entorno.
- No requiere cambios en `docs/SETUP.md` para esta HU.

## Manual Testing Checklist
- [ ] En `/admin/recetas/nuevo`, validar que existen tres campos: Ingredientes, Preparación y Tip HGourmet (sin textarea único de markdown).
- [ ] Crear receta con campos válidos y confirmar redirección/listado correcto en `/admin/recetas`.
- [ ] Intentar guardar con Ingredientes o Preparación vacío y verificar mensajes de error por campo.
- [ ] Editar receta legacy (solo `content`) y verificar que no se pierde información al guardar.
- [ ] Revisar `/recetas/[slug]` de receta nueva y confirmar secciones separadas: Ingredientes, Preparación y Tip HGourmet.
- [ ] Revisar `/recetas/[slug]` de receta legacy y confirmar fallback estable sin ruptura visual.
- [ ] Validar toggle de publicación y reordenamiento siguen funcionando sin regresión.

## Definition of Done
- [x] All BDD criteria have passing tests (435/435)
- [x] No TypeScript errors (`tsc --noEmit` limpio)
- [x] RLS policies: sin cambios requeridos (nuevas columnas heredan políticas existentes de `recipes`)
- [ ] CHANGELOG entry drafted
- [x] All changes committed with `feat(HU-6.2):` / `fix(HU-6.2):` convention
- [ ] Tag `HU-6.2` created (se crea en `@finish-objective`)
