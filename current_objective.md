# Objective: HU-3.4 — Formulario de contacto con envio real via WhatsApp

## Context
- **Feature:** FEAT-3 — Canal de Comunicacion y Conversion WhatsApp
- **Story:** Como cliente o visitante que necesita resolver dudas o confirmar un pedido, quiero enviar el formulario de `/contacto` y abrir WhatsApp con el mensaje ya prellenado, para poder contactar a HGourmet en un solo flujo sin copiar datos manualmente.
- **Spec Level:** Lite

## Acceptance Criteria (BDD)

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

## Implementation Plan

### Task 1: Auditar estado actual del formulario de `/contacto` (~30 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(storefront)/contacto/*`, `src/components/storefront/*`
- **Verification:** `rg "Enviar mensaje|contacto|placeholder|whatsapp|wa.me" src`

### Task 2: Implementar builder de mensaje y URL segura de WhatsApp (~45 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/lib/utils.ts` o `src/lib/constants.ts`, componente del formulario en `/contacto`
- **Verification:** `npm run lint`

### Task 3: Aplicar validaciones de campos requeridos y mensajes por campo (~45 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** formulario de contacto en `src/app/(storefront)/contacto/*`
- **Verification:** `npm run lint`

### Task 4: Manejar cancelacion/error de apertura de WhatsApp sin exito falso (~45 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** formulario de contacto en `src/app/(storefront)/contacto/*`
- **Verification:** `npm run lint`

### Task 5: Actualizar/crear pruebas para criterios BDD de HU-3.4 (~50 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `tests/integration/*contact*`, `tests/e2e/*contact*` (segun infra disponible)
- **Verification:** `npm test`

### Task 6: Validacion manual end-to-end en desktop y mobile (~30 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** N/A (ejecucion manual sobre `/contacto`)
- **Verification:** `npm run dev` + checklist manual de HU-3.4

## Database Changes (if applicable)
No aplica. Esta HU no requiere cambios de esquema, migraciones ni politicas RLS.

## Manual Testing Checklist
- [ ] Abrir `/contacto`, completar nombre/telefono/mensaje validos y confirmar apertura de `wa.me` con texto prellenado.
- [ ] Repetir envio con email vacio y confirmar que sigue funcionando (email opcional).
- [ ] Intentar enviar con campos requeridos vacios y confirmar errores por campo sin abrir WhatsApp.
- [ ] Probar mensaje con acentos, simbolos y saltos de linea para validar encoding correcto.
- [ ] Simular cancelacion/bloqueo de apertura (popup bloqueado o cancelacion de app) y confirmar ausencia de exito falso.
- [ ] Verificar que no hay regresion visual de layout/espaciado en `/contacto` (desktop y mobile).

## Definition of Done
- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors
- [ ] RLS policies tested (if applicable)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-3.4):` convention
- [ ] Tag `HU-3.4` created
