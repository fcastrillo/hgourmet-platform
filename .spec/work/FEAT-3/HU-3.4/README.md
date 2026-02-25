# HU-3.4: Formulario de contacto con envio real via WhatsApp

> **Feature:** FEAT-3 - Canal de Comunicacion y Conversion WhatsApp
> **Priority:** High
> **Spec Level:** Lite
> **Status:** Planned

## User Story

- **Como:** cliente o visitante que necesita resolver dudas o confirmar un pedido
- **Quiero:** enviar el formulario de `/contacto` y abrir WhatsApp con el mensaje ya prellenado
- **Para poder:** contactar a HGourmet en un solo flujo sin copiar datos manualmente

---

## Acceptance Criteria

1. El formulario de `/contacto` construye un deep link `wa.me` real con `nombre`, `telefono`, `email` (opcional) y `mensaje`.
2. Los campos requeridos (`nombre`, `telefono`, `mensaje`) se validan antes de intentar abrir WhatsApp.
3. El texto del mensaje se codifica de forma segura para evitar URLs malformadas o truncadas.
4. Si la persona cancela la apertura de WhatsApp o el navegador bloquea la accion, no se debe mostrar exito falso; se muestra estado de error recuperable.
5. El flujo conserva paridad visual y de UX con la pagina de contacto existente (sin regresiones de layout ni accesibilidad basica).

---

## BDD Scenarios

### Escenario 1: Envio real con mensaje prellenado

> **Dado que** la persona completa nombre, telefono, mensaje y opcionalmente email en `/contacto`,
> **Cuando** hace clic en "Enviar por WhatsApp",
> **Entonces** el sistema debe abrir un deep link `wa.me` con el mensaje prellenado usando esos datos.

### Escenario 2: Validacion de requeridos

> **Dado que** falta al menos uno de los campos requeridos (`nombre`, `telefono`, `mensaje`),
> **Cuando** la persona intenta enviar el formulario,
> **Entonces** el sistema debe bloquear el envio y mostrar mensajes de validacion claros por campo.

### Escenario 3: Encoding seguro del mensaje

> **Dado que** el mensaje contiene saltos de linea, acentos o caracteres especiales,
> **Cuando** se genera la URL de WhatsApp,
> **Entonces** el contenido debe quedar correctamente codificado para abrirse sin corrupcion de texto.

### Escenario 4: Cancelacion o error al abrir WhatsApp (error)

> **Dado que** la accion de apertura de WhatsApp es cancelada o bloqueada por el navegador/dispositivo,
> **Cuando** finaliza el intento de envio,
> **Entonces** la interfaz no debe mostrar confirmacion de exito y debe informar un estado de error recuperable con opcion de reintento.

---

## Technical Notes

- **Route:** `/contacto` `[SC]` con formulario interactivo `[CC]`.
- **Pattern:** deep link `wa.me/{number}?text={message}` segun ADR-002.
- **Dependencies:** `SOCIAL_LINKS.whatsapp` y utilidades de formateo/encoding en `src/lib/constants.ts` o helper dedicado.
- **Scope guardrail:** sin WhatsApp Business API en esta HU (solo deep link).
