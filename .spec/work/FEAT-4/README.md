# FEAT-4: Contenido y Marketing Digital

## Benefit Hypothesis — FEAT-4: Contenido y Marketing Digital

- **Para**: clientes actuales y potenciales de HGourmet que buscan inspiración y confianza antes de comprar
- **Que**: desean descubrir ideas, recetas y contenido útil mientras exploran el catálogo
- **Esta Feature**: provee una homepage de alto impacto y una sección de recetas/tips integrada al storefront
- **Esperamos**: incrementar la recurrencia de visitas y fortalecer la percepción de marca para mejorar la conversión asistida por WhatsApp
- **Sabremos que hemos tenido éxito cuando**: logremos ≥80% de feedback positivo sobre contenido y un aumento observable de sesiones recurrentes durante el trimestre

## User Stories

### HU-4.1: Página principal con banners rotativos y secciones destacadas

- **Estado**: Parcial (base funcional ya implementada, pendiente cierre visual)
- **Como**: visitante del sitio
- **Quiero**: ver una homepage clara, atractiva y bien estructurada
- **Para poder**: ubicar rápidamente productos, categorías y propuestas de valor de HGourmet

**Criterios BDD**

1. **Dado que** ingreso a la homepage desde móvil o desktop, **cuando** carga la página, **entonces** visualizo hero, banners activos y secciones destacadas sin errores de layout.
2. **Dado que** existen banners administrados en panel, **cuando** se renderiza el carrusel, **entonces** solo se muestran los banners activos y en el orden configurado.
3. **Dado que** un visitante no encuentra señal de confianza (escenario de error de UX), **cuando** se evalúa la paridad visual final, **entonces** se incorporan/ajustan bloques de valor (ej. "Por qué elegirnos") para cerrar la brecha contra el diseño objetivo.

### HU-4.3: Sección de recetas y tips

- **Estado**: Pendiente
- **Como**: cliente de HGourmet
- **Quiero**: consultar recetas y tips de repostería en el storefront
- **Para poder**: inspirarme, aprender y usar más productos del catálogo en preparaciones reales

**Criterios BDD**

1. **Dado que** existen recetas publicadas, **cuando** entro a `/recetas`, **entonces** veo un listado con cards que incluyen título, imagen y acceso al detalle.
2. **Dado que** selecciono una receta válida, **cuando** abro `/recetas/[slug]`, **entonces** visualizo contenido completo con SEO correcto y navegación funcional.
3. **Dado que** intento acceder a un slug inexistente o no publicado (escenario de error), **cuando** se resuelve la ruta, **entonces** el sistema muestra estado de no disponible sin filtrar contenido privado.

### HU-4.4: Sección de marcas HGourmet (logos de proveedores)

- **Estado**: Entregada (2026-02-22)
- **Como**: visitante del sitio
- **Quiero**: identificar las marcas/proveedores presentes en HGourmet
- **Para poder**: aumentar confianza en la calidad y variedad de la oferta

**Criterios BDD**

1. **Dado que** hay marcas activas en administración, **cuando** carga la homepage, **entonces** se muestran logos activos en la sección de marcas.
2. **Dado que** se actualiza el orden o estado de una marca en admin, **cuando** recargo el storefront, **entonces** la sección refleja el cambio.
3. **Dado que** no existen marcas activas (escenario de error/contenido vacío), **cuando** se renderiza la sección, **entonces** el storefront mantiene estabilidad visual sin fallas.

## Decisión de alcance MVP

- HU-4.2 (boletín informativo) se excluye del MVP de FEAT-4.
- El boletín se mueve a roadmap en FEAT-5 como HU-5.4, junto con carrito y checkout WhatsApp.
