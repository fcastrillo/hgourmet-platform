# HU-4.3: Seccion de recetas y tips

> **Feature:** FEAT-4 - Contenido y Marketing Digital
> **Priority:** Medium
> **Spec Level:** Lite
> **Status:** Delivered (2026-02-23)

## User Story

- **Como:** cliente de HGourmet
- **Quiero:** consultar recetas y tips de reposteria en el storefront
- **Para poder:** inspirarme, aprender y usar mas productos del catalogo en preparaciones reales

---

## Acceptance Criteria

1. La ruta `/recetas` muestra un listado de recetas publicadas con cards (titulo, imagen y acceso al detalle).
2. La ruta `/recetas/[slug]` muestra contenido completo de receta con SEO y navegacion funcional.
3. Los slugs inexistentes o no publicados muestran estado de no disponible sin exponer contenido privado.

---

## BDD Scenarios

### Escenario 1: Listado de recetas publicadas

> **Dado que** existen recetas publicadas,
> **Cuando** entro a `/recetas`,
> **Entonces** veo un listado con cards que incluyen titulo, imagen y acceso al detalle.

### Escenario 2: Detalle de receta valida

> **Dado que** selecciono una receta valida,
> **Cuando** abro `/recetas/[slug]`,
> **Entonces** visualizo contenido completo con SEO correcto y navegacion funcional.

### Escenario 3: Slug inexistente o no publicado (error)

> **Dado que** intento acceder a un slug inexistente o no publicado,
> **Cuando** se resuelve la ruta,
> **Entonces** el sistema muestra estado de no disponible sin filtrar contenido privado.

---

## Technical Notes

- **Routes:** `/recetas` y `/recetas/[slug]`.
- **Components:** `RecipeCard` `[SC]`, pagina de detalle de receta `[SC]`.
- **Dependencies:** tabla `recipes` y flujo admin de HU-2.8.
