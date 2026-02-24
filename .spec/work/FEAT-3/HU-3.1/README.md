# HU-3.1: Boton fijo de WhatsApp en todo el sitio

> **Feature:** FEAT-3 - Canal de Comunicacion y Conversion WhatsApp
> **Priority:** High
> **Spec Level:** Lite

## User Story

- **Como:** cliente navegando el sitio
- **Quiero:** ver un boton flotante de WhatsApp siempre visible
- **Para poder:** contactar a HGourmet desde cualquier pagina con un solo clic

---

## Acceptance Criteria

1. El boton flotante es visible en todas las rutas publicas del storefront y no tapa CTAs primarios.
2. Al hacer clic, abre un deep link `wa.me` valido usando el numero definido en `SOCIAL_LINKS.whatsapp`.
3. La implementacion mantiene paridad visual con el prototipo Lovable (forma, tamano, jerarquia, espaciado, hover/active).
4. Si el enlace de WhatsApp esta ausente o invalido, la UI no se rompe y se muestra fallback seguro.

---

## BDD Scenarios

### Escenario 1: Presencia global del boton

> **Dado que** una persona navega cualquier ruta publica del storefront,
> **Cuando** la pagina termina de renderizar,
> **Entonces** debe visualizarse un boton flotante de WhatsApp anclado en la esquina inferior derecha.

### Escenario 2: Apertura de enlace oficial

> **Dado que** el enlace de WhatsApp esta correctamente configurado,
> **Cuando** la persona hace clic en el boton flotante,
> **Entonces** el navegador debe abrir un deep link `wa.me` al numero oficial de HGourmet.

### Escenario 3: Paridad visual con prototipo

> **Dado que** el prototipo Lovable define el baseline visual del boton,
> **Cuando** se inspecciona la implementacion final,
> **Entonces** debe existir paridad visual en tamano, radio, iconografia, sombra y estado hover/active.

### Escenario 4: Fallback por configuracion invalida (error)

> **Dado que** `SOCIAL_LINKS.whatsapp` esta vacio o invalido,
> **Cuando** la persona intenta usar el boton,
> **Entonces** la interfaz debe permanecer estable y mostrar estado deshabilitado o mensaje de error recuperable.

---

## Technical Notes

- **Component:** `WhatsAppFloatingButton` `[CC]`
- **Integration point:** layout del storefront para presencia global.
- **Dependencies:** `SOCIAL_LINKS.whatsapp` en `src/lib/constants.ts`; ADR-002 y ADR-006.
