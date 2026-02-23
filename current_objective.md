# Objective: HU-4.3 — Sección de recetas y tips

## Context

- **Feature:** FEAT-4 — Contenido y Marketing Digital
- **Story:** Como cliente de HGourmet, quiero ver recetas y tips de repostería, para poder inspirarme con ideas y aprender técnicas usando los productos de la tienda.
- **Spec Level:** Standard
- **TDD Mode:** flexible
- **Estimated Duration:** 6-8 horas

## Visual Contract (Lovable Parity)

- **Reference Prototype:** `briefs/lovable-prototype/src/pages/Recetas.tsx`, `briefs/lovable-prototype/src/pages/RecetaDetail.tsx`
- **Target Similarity:** >= 90% de similitud visual percibida en estructura, jerarquía y componentes clave (no pixel-perfect).
- **Reference Evidence:** `assets/image-85cb8f46-e43b-4bf0-890a-110ca9738680.png`, `assets/image-f8024e2b-9ba3-4f12-90a1-fbeabc14582e.png`, `assets/image-481ba6ee-f144-421d-88b1-9713530877b7.png`
- **Non-goals:** No se exige replicar exactamente tipografía/fotografía ni micro-espaciados al pixel.

### Required Visual Invariants

1. Listado `/recetas` con encabezado centrado: "Recetas & Tips", resaltando "Tips" en dorado.
2. Grid responsive de cards: 1 columna en mobile, 2 en tablet y 3 en desktop.
3. Card con imagen superior `aspect-video`, título destacado, excerpt breve y CTA "Ver receta" en estilo dorado suave.
4. Estado hover de card y CTA con transición suave (sombra/transform/color), sin cambios bruscos.
5. Detalle `/recetas/[slug]` con breadcrumb visible: Inicio > Recetas > título.
6. Hero image del detalle en formato panorámico con bordes redondeados.
7. Sección "Ingredientes" y "Preparación" con jerarquía tipográfica consistente al prototipo.
8. Pasos de preparación numerados en círculo dorado.
9. Card "Tip HGourmet" destacada con borde/fondo dorado suave e ícono contextual.
10. CTA final "Ver todas las recetas" centrado y visualmente consistente.

### Content Rendering Contract

- El campo `recipes.content` (Markdown) debe soportar estructura semántica equivalente para similitud visual:
  - `## Ingredientes` + lista de elementos
  - `## Preparación` + lista ordenada de pasos
  - `## Tip HGourmet` + párrafo de recomendación
- Si una receta no cumple la estructura esperada (fallback), se renderiza contenido de forma segura sin romper layout ni navegación.

## Acceptance Criteria (BDD)

### Scenario 1: Listado público de recetas publicadas

- **Dado que:** existen recetas publicadas en la base de datos
- **Cuando:** ingreso a `/recetas`
- **Entonces:** veo un listado con cards que incluyen título, imagen y acceso al detalle

### Scenario 2: Detalle de receta por slug con SEO

- **Dado que:** selecciono una receta válida y publicada
- **Cuando:** abro `/recetas/[slug]`
- **Entonces:** visualizo contenido completo con SEO correcto y navegación funcional

### Scenario 3: Acceso a slug inválido o no publicado (error)

- **Dado que:** intento abrir una receta inexistente o no publicada
- **Cuando:** el sistema resuelve la ruta
- **Entonces:** se muestra estado de no disponible sin filtrar contenido privado

## Implementation Plan

### Task 1: Implementar queries storefront de recetas publicadas ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/lib/supabase/queries/recipes.ts`, `src/lib/recipe-parser.ts`
- **Commit:** 2585f4f

### Task 2: Crear componente de card reutilizable para receta ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/storefront/RecipeCard.tsx`
- **Commit:** 2585f4f

### Task 3: Implementar página `/recetas` con grid, empty state y orden por display_order ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(storefront)/recetas/page.tsx`
- **Commit:** 2585f4f

### Task 4: Implementar detalle `/recetas/[slug]` con `generateMetadata` y render de contenido ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(storefront)/recetas/[slug]/page.tsx`
- **Commit:** 2585f4f

### Task 5: Implementar fallback de error para slugs inválidos/no publicados ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(storefront)/recetas/[slug]/not-found.tsx`
- **Commit:** 2585f4f

### Task 6: Definir pruebas de integración para criterios BDD HU-4.3 ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/tests/integration/hu-4.3-scenarios.test.tsx`
- **Result:** 17/17 tests passing
- **Commit:** 2585f4f

### Task 7: Ejecutar validaciones finales de calidad y regresión básica ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Result:** 257/257 tests passing (suite completa)
- **Fix extra:** `storefront-layout.test.tsx` tagline regex — pre-existing mismatch, not HU-4.3
- **Commit:** 2585f4f

### Task 8: Validación de paridad visual contra Lovable y ajuste final ✅

- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Result:** 10/10 invariantes visuales cubiertos en código

## Database Changes

No se requieren cambios de base de datos para HU-4.3.

Se reutiliza el esquema y RLS ya entregados en `supabase/migrations/004_recipes.sql`:

- Tabla `recipes` con `slug`, `content`, `is_published`, `display_order`
- Política anon solo lectura de recetas publicadas (`is_published = true`)
- Acceso completo para rol `authenticated` (panel admin)

## Infrastructure Changes

- **New environment variables:** None
- **New external services:** None
- **New storage/buckets:** None (usa `recipe-images` ya definido)
- **New auth configuration:** None
- **SETUP.md update required:** No

## Manual Testing Checklist

- [ ] Como visitante, abrir `/recetas` y validar que solo aparecen recetas publicadas con imagen/título y enlace al detalle.
- [ ] Abrir una receta publicada desde el listado y validar contenido completo, navegación y metadatos SEO básicos (title/description).
- [ ] Navegar directo a un slug inexistente (`/recetas/slug-invalido`) y validar estado not found sin fuga de contenido.
- [ ] Despublicar una receta desde `/admin/recetas`, volver al storefront y confirmar que desaparece del listado público.
- [ ] Publicar nuevamente la receta y confirmar que reaparece respetando el orden esperado.
- [ ] Comparar visualmente `/recetas` con el prototipo de referencia y confirmar cumplimiento de los 10 invariantes visuales definidos.
- [ ] Comparar visualmente `/recetas/[slug]` con el prototipo y confirmar breadcrumb, jerarquía de secciones, pasos numerados, card de tip y CTA final.
- [ ] Verificar fallback visual para receta con contenido no estructurado (sin romper layout ni estilos base).

## Definition of Done

- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors
- [ ] RLS policies tested (if applicable)
- [ ] Visual Contract cumplido (>= 90% similitud percibida contra referencias Lovable)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-4.3):` convention
- [ ] Tag `HU-4.3` created
