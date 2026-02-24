# HU-4.4: Seccion de marcas HGourmet (logos de proveedores)

> **Feature:** FEAT-4 - Contenido y Marketing Digital
> **Priority:** Low
> **Spec Level:** Lite
> **Status:** Delivered (2026-02-22)

## User Story

- **Como:** visitante del sitio
- **Quiero:** identificar las marcas/proveedores presentes en HGourmet
- **Para poder:** aumentar confianza en la calidad y variedad de la oferta

---

## Acceptance Criteria

1. La homepage muestra logos de marcas activas definidas en administracion.
2. Cambios de orden o estado en admin se reflejan en storefront al recargar.
3. Si no hay marcas activas, la seccion mantiene estabilidad visual sin fallas.

---

## BDD Scenarios

### Escenario 1: Visualizacion de marcas activas

> **Dado que** hay marcas activas en administracion,
> **Cuando** carga la homepage,
> **Entonces** se muestran logos activos en la seccion de marcas.

### Escenario 2: Sincronizacion tras cambios en admin

> **Dado que** se actualiza el orden o estado de una marca en admin,
> **Cuando** recargo el storefront,
> **Entonces** la seccion refleja el cambio.

### Escenario 3: Estado vacio de marcas (error/contenido vacio)

> **Dado que** no existen marcas activas,
> **Cuando** se renderiza la seccion,
> **Entonces** el storefront mantiene estabilidad visual sin fallas.

---

## Technical Notes

- **Component:** `BrandSection` `[SC]` en homepage.
- **Dependency:** HU-2.6 (CRUD admin de marcas/proveedores).
