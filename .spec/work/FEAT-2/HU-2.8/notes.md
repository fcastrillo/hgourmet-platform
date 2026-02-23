# HU-2.8 — Gestión de recetas desde el panel

> Workspace de implementación. Artefacto auxiliar del `current_objective.md`.

## Design Decisions

### Patrón de rutas
Consistente con `marcas` y `banners`:
```
/admin/recetas             → RecipesAdminPage [SC]  → RecipeTable [CC]
/admin/recetas/nuevo       → NuevaRecetaPage [SC]   → RecipeForm [CC]
/admin/recetas/[id]/editar → EditarRecetaPage [SC]  → RecipeForm [CC]
```

### DB delta
La tabla `recipes` existe (visible en la aplicación corriente). Solo falta
el campo `display_order` para habilitar reordenamiento en el panel admin.
Migración: `supabase/migrations/004_recipes.sql`.

### Markdown
Se usa `<textarea>` nativa (sin editor externo) para contenido Markdown.
El storefront (HU-4.3) se encargará del renderizado. Este panel solo
persiste el texto plano/Markdown como `content`.

### Slug auto-generado
Función `toSlug(title)` en `src/lib/utils.ts` (o inline en actions.ts)
convierte título → slug lowercase con guiones. Al editar, el slug no se
regenera automáticamente para evitar cambiar URLs ya publicadas.

### ADR-009 compliance
Tabla con icon buttons, optimistic toggle en `is_published`, reordenamiento
con `display_order`. Badge: "Visible" (is_published=true) / "Oculta".

## Files Created
- `supabase/migrations/004_recipes.sql`
- `src/types/database.ts` (add recipes table + Recipe type)
- `src/lib/supabase/queries/admin-recipes.ts`
- `src/app/(admin)/admin/recetas/actions.ts`
- `src/components/admin/RecipeTable.tsx`
- `src/components/admin/DeleteRecipeDialog.tsx`
- `src/components/admin/RecipeForm.tsx`
- `src/app/(admin)/admin/recetas/page.tsx`
- `src/app/(admin)/admin/recetas/nuevo/page.tsx`
- `src/app/(admin)/admin/recetas/[id]/editar/page.tsx`
- `src/components/admin/AdminSidebar.tsx` (updated)
- `src/tests/integration/hu-2.8-scenarios.test.tsx`
