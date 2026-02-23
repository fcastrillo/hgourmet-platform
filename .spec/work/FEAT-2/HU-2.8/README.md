# HU-2.8: Gestión de recetas desde el panel

> **Feature:** FEAT-2 — Panel de Administración  
> **Priority:** Medium  
> **Spec Level:** Lite

## User Story

- **Como:** administradora de HGourmet
- **Quiero:** crear, editar, publicar/despublicar, reordenar y eliminar recetas desde el panel
- **Para poder:** mantener la sección de recetas y tips actualizada sin depender de soporte técnico

---

## Acceptance Criteria

1. La tabla de recetas muestra imagen miniatura, título, fecha y estado de publicación con acciones inline de editar, publicar/despublicar y eliminar (estándar ADR-009).
2. El formulario de receta permite capturar título, contenido en Markdown, imagen de portada y estado de publicación.
3. Al guardar una receta, el sistema genera o actualiza `slug` automáticamente a partir del título y persiste en `recipes`.
4. La imagen de portada se carga en el bucket `recipe-images` y su URL se guarda en `image_url`.
5. El toggle de estado permite publicar/despublicar sin modal, con feedback inmediato en la tabla.
6. La tabla permite reordenar recetas por controles de subir/bajar.
7. Validaciones mínimas: título y contenido obligatorios; si faltan, no se guarda el registro.

---

## BDD Scenarios

### Escenario 1: Crear receta desde panel admin

> **Dado que** soy una administradora autenticada en `/admin/recetas`,  
> **Cuando** completo título, contenido e imagen y presiono "Guardar",  
> **Entonces** el sistema crea la receta, sube la imagen al bucket `recipe-images` y la muestra en la tabla con estado según el toggle.

### Escenario 2: Despublicar receta inline

> **Dado que** existe una receta publicada en la tabla,  
> **Cuando** hago clic en el ícono de despublicar,  
> **Entonces** el estado cambia a "Oculta" en la tabla sin abrir modal y la receta deja de estar disponible para el storefront público.

### Escenario 3: Validación de campos obligatorios (error)

> **Dado que** intento guardar una receta sin título o sin contenido,  
> **Cuando** envío el formulario,  
> **Entonces** el sistema muestra mensajes de validación, no crea/actualiza el registro y conserva los datos capturados para corregir.

---

## Technical Notes

- **Routes:** `/admin/recetas`, `/admin/recetas/nuevo`, `/admin/recetas/[id]/editar`
- **Components:** `RecipeTable` `[CC]`, `RecipeForm` `[CC]`, `DeleteRecipeDialog` `[CC]`
- **Server Actions:** `createRecipe`, `updateRecipe`, `deleteRecipe`, `toggleRecipePublished`, `reorderRecipes` `[SA]`
- **Queries:** `fetchAllRecipesAdmin`, `fetchRecipeByIdAdmin`, `fetchMaxRecipeDisplayOrder`
- **Database:** `supabase/migrations/004_recipes.sql` (incluye `display_order` + índices + RLS)
- **Dependency:** La visualización pública de recetas se implementa en `HU-4.3`.
