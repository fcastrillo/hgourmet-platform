# HU-3.2: CTA "Pide por WhatsApp" con contexto de producto

> **Feature:** FEAT-3 - Canal de Comunicacion y Conversion WhatsApp
> **Priority:** High
> **Spec Level:** Lite
> **Status:** Delivered (2026-02-21)

## User Story

- **Como:** cliente revisando una ficha de producto
- **Quiero:** enviar un mensaje prellenado con nombre y precio del producto
- **Para poder:** solicitar disponibilidad o pedido sin copiar informacion manualmente

---

## Acceptance Criteria

1. El CTA abre WhatsApp con mensaje contextual que incluye al menos nombre y precio del producto.
2. El mensaje se genera de forma segura y no produce URL malformada.
3. Si faltan datos de producto (nombre/precio), el componente usa fallback legible sin romper UX.

---

## BDD Scenarios

### Escenario 1: Mensaje contextual al hacer clic

> **Dado que** estoy en el detalle de un producto visible,
> **Cuando** hago clic en "Pide por WhatsApp",
> **Entonces** se abre WhatsApp con un mensaje que incluye al menos nombre y precio del producto.

### Escenario 2: Datos incompletos de producto (error)

> **Dado que** falta precio o nombre del producto por un dato incompleto,
> **Cuando** se renderiza el CTA,
> **Entonces** el componente debe usar texto fallback seguro y no debe generar una URL malformada.

---

## Technical Notes

- **Component:** `WhatsAppCTA` `[CC]`
- **Pattern:** deep link `wa.me/{number}?text={message}` (ADR-002).
- **Dependency:** configuracion de numero y links centralizada en `src/lib/constants.ts`.
