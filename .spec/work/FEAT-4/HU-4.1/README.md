# HU-4.1: Pagina principal con banners rotativos y secciones destacadas

> **Feature:** FEAT-4 - Contenido y Marketing Digital
> **Priority:** High
> **Spec Level:** Lite
> **Status:** Partial (base funcional implementada; pendiente cierre visual)

## User Story

- **Como:** visitante del sitio
- **Quiero:** ver una homepage clara, atractiva y bien estructurada
- **Para poder:** ubicar rapidamente productos, categorias y propuestas de valor de HGourmet

---

## Acceptance Criteria

1. La homepage muestra hero, banners activos y secciones destacadas sin errores de layout en movil y desktop.
2. El carrusel respeta solo banners activos y el orden configurado desde administracion.
3. La implementacion mantiene paridad visual con el prototipo Lovable (estructura, jerarquia visual y bloques de valor).
4. Si hay brecha de UX detectada, se incorporan o ajustan bloques de confianza (por ejemplo, "Por que elegirnos").

---

## BDD Scenarios

### Escenario 1: Homepage estable en multiples dispositivos

> **Dado que** ingreso a la homepage desde movil o desktop,
> **Cuando** carga la pagina,
> **Entonces** visualizo hero, banners activos y secciones destacadas sin errores de layout.

### Escenario 2: Render de banners segun estado y orden

> **Dado que** existen banners administrados en panel,
> **Cuando** se renderiza el carrusel,
> **Entonces** solo se muestran los banners activos y en el orden configurado.

### Escenario 3: Cierre de brecha visual de confianza (error UX)

> **Dado que** un visitante no encuentra senales claras de confianza (escenario de error de UX),
> **Cuando** se evalua la paridad visual final contra Lovable,
> **Entonces** se incorporan o ajustan bloques de valor para cerrar la brecha respecto al diseno objetivo.

---

## Technical Notes

- **Route:** `/` (homepage storefront).
- **Components:** `HomepageHero`, `BannerCarousel`, `CategoryShowcase`, `ProductSection`, `BrandSection`.
- **Dependency:** gestion de banners desde HU-2.5.
