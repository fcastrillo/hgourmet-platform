# HU-3.3: Pagina de contacto

> **Feature:** FEAT-3 - Canal de Comunicacion y Conversion WhatsApp
> **Priority:** Medium
> **Spec Level:** Lite

## User Story

- **Como:** cliente o visitante del sitio
- **Quiero:** ver la informacion de contacto de HGourmet y poder enviar un mensaje
- **Para poder:** comunicarme con la tienda o visitarla fisicamente

---

## Acceptance Criteria

1. La ruta `/contacto` muestra direccion, telefono, email, horario, enlaces a WhatsApp/Facebook/Instagram y mapa de ubicacion.
2. El formulario valida nombre, email y mensaje antes de enviar.
3. Al enviar con datos validos, muestra confirmacion placeholder sin recarga abrupta.
4. Se mantiene paridad visual con el prototipo Lovable en pantalla de contacto y footer.
5. En errores de validacion, se bloquea envio y se muestran mensajes claros por campo.

---

## BDD Scenarios

### Escenario 1: Contacto completo visible

> **Dado que** una persona entra a `/contacto`,
> **Cuando** la pagina termina de cargar,
> **Entonces** debe visualizar informacion de contacto completa y accesible, junto con el bloque de mapa.

### Escenario 2: Envio exitoso del formulario

> **Dado que** la persona completa nombre, email y mensaje validos,
> **Cuando** presiona "Enviar mensaje",
> **Entonces** debe mostrarse confirmacion de envio (placeholder) y mantenerse la UI estable.

### Escenario 3: Paridad visual con prototipo

> **Dado que** el prototipo Lovable define la referencia visual para contacto y footer,
> **Cuando** se valida la implementacion final,
> **Entonces** debe respetarse la jerarquia tipografica, composicion de columnas y estilo visual general del prototipo.

### Escenario 4: Bloqueo por validacion invalida (error)

> **Dado que** hay campos vacios o email con formato invalido,
> **Cuando** la persona intenta enviar el formulario,
> **Entonces** el sistema debe impedir el envio y mostrar mensajes de error accionables por campo.

---

## Technical Notes

- **Route:** `/contacto` `[SC]` con formulario interactivo `[CC]`.
- **Social links:** `SOCIAL_LINKS.whatsapp`, `SOCIAL_LINKS.facebook`, `SOCIAL_LINKS.instagram`.
- **Mapa:** placeholder/iframe embebido segun disponibilidad.
- **Envio:** server action placeholder para confirmacion; integracion de email (Resend) en iteracion futura.
