# Objective: HU-7.4 — Mapa visible e interactivo en página de contacto

## Context
- **Feature:** FEAT-7 — Analítica y Trazabilidad de Conversión
- **Story:** Como cliente o visitante, quiero visualizar la ubicación real de HGourmet en la página de contacto, para poder ubicar el local rápidamente y decidir cómo llegar o contactar.
- **Spec Level:** Lite
- **Branch:** `hu/7.4`
- **TDD Mode:** `flexible` (`IMPLEMENT → TEST → REFACTOR`)

## Validation Gate (Step 0)

```text
=== VALIDATION REPORT ===
Target: HU-7.4 — Mapa visible e interactivo en página de contacto (iframe)
Level: Standard (Simple Story)

✅ PRD.md: Vision/Users/MVP Scope/KPIs completos.
✅ TECH_SPEC.md: Stack/Data Model/Auth/RLS completos.
✅ FEAT-7: hipótesis de beneficio completa y trazable.
✅ HU-7.4: formato Como/Quiero/Para + BDD + escenario de error.
⚠️ BDD lint: validación por regex espera token literal "Entonces:" (no bloqueante para inicio de plan).

RESULT: WARNINGS
ACTION: Proceder con la planificación de HU-7.4 y usar criterios BDD como contrato de pruebas.
```

## Acceptance Criteria (BDD)

1. **Dado que** entro a `/contacto`, **cuando** la página termina de cargar, **entonces** veo un mapa real embebido con la ubicación de HGourmet.
2. **Dado que** estoy en un dispositivo móvil, **cuando** visualizo la sección del mapa, **entonces** el componente se adapta sin desbordes ni superposición de elementos.
3. **Dado que** el embed del mapa falla, **cuando** renderiza la sección de ubicación, **entonces** se muestra fallback informativo con enlace directo a Google Maps.

## BDD Coverage Evidence

- **AC1 (mapa embebido visible):** cubierto por test de integración `muestra un iframe de Google Maps en la sección de ubicación` en `src/tests/integration/hu-3.3-scenarios.test.tsx`.
- **AC2 (responsive móvil sin desbordes):** cubierto por validación manual (checklist completado) y por contrato estructural del contenedor responsive (`h-52` + `md:h-64` + `w-full` + `overflow-hidden`) en `src/app/(storefront)/contacto/page.tsx`.
- **AC3 (fallback con enlace):** cubierto por test de integración `muestra enlace de fallback para abrir la ubicación en Google Maps` en `src/tests/integration/hu-3.3-scenarios.test.tsx`.
- **Pruebas ejecutadas en verde:** `npm run test -- src/tests/integration/hu-3.3-scenarios.test.tsx` (24/24 passing) + `ReadLints` sin errores en archivos modificados.

## Implementation Plan

### Task 1: Definir fuente de configuración del mapa (~30 min) ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** `src/lib/constants.ts`
- **Work:** Agregar constantes para URL de embed y URL de fallback de Google Maps, manteniendo valores centralizados y reutilizables.
- **Verification:** `npm run test -- src/tests/integration/hu-3.3-scenarios.test.tsx`
- **Files modified:** `src/lib/constants.ts`
- **Commit:** Pendiente (no solicitado aún)

### Task 2: Reemplazar placeholder por iframe real en `/contacto` (~45 min) ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** `src/app/(storefront)/contacto/page.tsx`
- **Work:** Sustituir bloque estático "Mapa de ubicación" por `<iframe>` embebido con `loading=\"lazy\"`, `title` accesible y layout responsive.
- **Verification:** `npm run test -- src/tests/integration/hu-3.3-scenarios.test.tsx`
- **Files modified:** `src/app/(storefront)/contacto/page.tsx`
- **Commit:** Pendiente (no solicitado aún)

### Task 3: Implementar fallback visible y enlace externo al mapa (~35 min) ✅
- **Type:** [SC]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** `src/app/(storefront)/contacto/page.tsx`
- **Work:** Añadir contenido de respaldo dentro del contenedor del mapa (texto + enlace a Google Maps) para escenarios de bloqueo/carga fallida.
- **Verification:** `npm run test -- src/tests/integration/hu-3.3-scenarios.test.tsx`
- **Files modified:** `src/app/(storefront)/contacto/page.tsx`
- **Commit:** Pendiente (no solicitado aún)

### Task 4: Actualizar pruebas de integración HU-3.3 para contrato HU-7.4 (~50 min) ✅
- **Type:** [TEST]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** `src/tests/integration/hu-3.3-scenarios.test.tsx`
- **Work:** Ajustar asserts para validar presencia del iframe, atributos clave de accesibilidad/performance y fallback link.
- **Verification:** `npm run test -- src/tests/integration/hu-3.3-scenarios.test.tsx`
- **Files modified:** `src/tests/integration/hu-3.3-scenarios.test.tsx`
- **Commit:** Pendiente (no solicitado aún)

### Task 5: Validación local end-to-end del flujo de contacto (~40 min) ✅
- **Type:** [TEST]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** (sin cambios de código)
- **Work:** Ejecutar validación manual en desktop y móvil para verificar render del mapa, interacción mínima y comportamiento de fallback.
- **Verification:** `npm run dev` + checklist manual
- **Files modified:** N/A (validación manual + pruebas automatizadas de regresión)
- **Commit:** Pendiente (no solicitado aún)

## Database Changes (if applicable)

- No aplica para HU-7.4.

## Manual Testing Checklist

- [x] Abrir `/contacto` en desktop y confirmar que el mapa embebido se renderiza dentro del layout.
- [x] Confirmar que el contenedor del mapa conserva proporción y no desborda en viewport móvil.
- [x] Verificar que existe enlace de fallback a Google Maps con la dirección de la tienda.
- [x] Validar que el atributo `title` del iframe describe correctamente el contenido.
- [x] Confirmar que el mapa usa `loading="lazy"` para no degradar el primer render.
- [x] Revisar que formulario y botones sociales no presentan regresiones visuales ni funcionales.

## Definition of Done

- [x] Todos los criterios BDD de HU-7.4 cubiertos por pruebas/validaciones.
- [x] Pruebas de integración relevantes en verde.
- [x] Sin errores de TypeScript ni linter en archivos modificados.
- [ ] Sin cambios de DB/RLS requeridos para esta HU.
- [ ] Entry de `docs/CHANGELOG.md` preparada en cierre de objetivo.
- [ ] Commits en rama `hu/7.4` usando convención `feat(HU-7.4): ...`.
