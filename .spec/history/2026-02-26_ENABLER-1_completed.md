# Objective: ENABLER-1 — Cloudflare Tunnel para preview compartible en desarrollo

## Context
- **Feature:** ENABLERS — Technical / Infrastructure Track
- **Story:** Como equipo técnico de HGourmet, quiero exponer el entorno local mediante un túnel seguro y documentado, para poder compartir demos con stakeholders de manera simple y recurrente.
- **Spec Level:** Lite (Enabler de infraestructura)
- **Execution Mode:** Forzado como Enabler (excepción de sintaxis HU-N.M aprobada por usuario)
- **Git Strategy:** `trunk` (según `.spec/config.md`)
- **TDD Mode:** `flexible` (`IMPLEMENT → TEST → REFACTOR`)

## Acceptance Criteria (BDD)
- **Dado que** el servidor local está ejecutándose en el puerto objetivo y `cloudflared/config.yml` está configurado,  
  **Cuando** ejecuto `npm run tunnel`,  
  **Entonces** el dominio fijo de preview (`demo.hgourmet.com.mx`) queda accesible para compartir la demo.

- **Dado que** una stakeholder abre el enlace de preview,  
  **Cuando** recorre el flujo principal del storefront,  
  **Entonces** puede validar funcionalidad y emitir VoBo/feedback sin acceso al entorno local.

- **Dado que** el túnel puede caer o expirar,  
  **Cuando** un enlace deja de responder durante revisión,  
  **Entonces** se ejecuta el procedimiento de recuperación (reinicio + nuevo enlace) y se restablece la demo sin bloquear el avance.

## Implementation Plan

### Task 1: Preparar prerequisitos de túnel y comando base (~30 min) ✅
- **Type:** [SA]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** `package.json`, `README.md`, `docs/SETUP.md`
- **Verification:** `npm run tunnel -- --help` (o comando equivalente del script) + confirmación de que el comando resuelve binario `cloudflared`
- **Files modified:** `package.json`
- **Verification result:** `npm run tunnel:check` y `npm run tunnel -- --help` ejecutados con éxito.
- **Commit:** `fd00993`

### Task 2: Implementar flujo operativo de preview compartible (~45 min) ✅
- **Type:** [SA]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** scripts/comandos de túnel en `package.json`, documentación operativa en `docs/SETUP.md`
- **Verification:** levantar `npm run dev` + `npm run tunnel` y validar apertura de `demo.hgourmet.com.mx` desde navegador externo/dispositivo alterno
- **Files modified:** `README.md`, `docs/SETUP.md`
- **Verification result:** comando de túnel operativo validado por `--help`; validación end-to-end con URL pública queda en checklist manual.
- **Commit:** `fd00993`

### Task 3: Documentar contingencia de caída/expiración del túnel (~35 min) ✅
- **Type:** [TEST]
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files:** `docs/SETUP.md`, `.spec/work/ENABLERS/ENABLER-1/README.md`
- **Verification:** simular reinicio del túnel (detener/iniciar) y validar que la guía permite recuperar enlace funcional en <5 min
- **Files modified:** `docs/SETUP.md`, `.spec/work/ENABLERS/ENABLER-1/README.md`
- **Verification result:** procedimiento de recuperación documentado; simulación operativa queda pendiente de ejecución manual.
- **Commit:** `fd00993`

## Database Changes (if applicable)
No aplica. Este enabler no requiere cambios de esquema, migraciones ni políticas RLS.

## Manual Testing Checklist
- [ ] Levantar app local con `npm run dev`.
- [ ] Ejecutar `npm run tunnel` con `cloudflared/config.yml` configurado.
- [ ] Abrir `https://demo.hgourmet.com.mx` desde red/dispositivo distinto al entorno local y validar home + navegación básica.
- [ ] Registrar feedback/VoBo de stakeholders sobre demo.
- [ ] Forzar reinicio del túnel y verificar recuperación operativa siguiendo la guía.

## Definition of Done
- [ ] Todos los criterios BDD del enabler validados con evidencia operativa
- [x] Comando `npm run tunnel` documentado y reproducible
- [x] Guía de contingencia de túnel caída/expirada publicada en `docs/SETUP.md`
- [x] Sin errores de lint/typecheck en artefactos tocados
- [x] Cambios listos para commit con convención apropiada (`chore:` o `docs:` según alcance final)

## Estado de Cierre (Temporal)
- **Resultado:** Parcial / temporal (dependencia externa no resuelta).
- **Bloqueo externo:** Sin acceso actual a configuración de DNS de la zona para publicar `demo.hgourmet.com.mx`.
- **Validado en esta iteración:** Túnel operativo en modo temporal (`npm run tunnel:quick`) y conector registrado en Cloudflare.
- **Pendiente para cierre definitivo:** Resolver DNS de la zona y validar acceso público estable por dominio fijo.

## Completion
- **Date:** 2026-02-26
- **Estimated Duration:** ~110 min (30 + 45 + 35 min)
- **Actual Duration:** N/A por trazado git (solo 1 commit ENABLER-1 identificado: `fd00993`)
- **Variance:** Cierre parcial por bloqueo externo de DNS; implementación documental y operativa completada en una iteración.
- **Files modified:** `package.json`, `README.md`, `docs/SETUP.md`, `cloudflared/config.yml`, `.spec/work/ENABLERS/ENABLER-1/README.md`, `.spec/work/ENABLERS/README.md`, `docs/BACKLOG.md`, `current_objective.md`, `.spec/history/2026-02-25_ENABLER-1_validation.md`
- **Tests added:** 0 (validaciones operativas manuales)

## Deviations & Decisions
- **Added:** Script `tunnel:check`, script `tunnel:quick`, y runbook operativo extendido.
- **Changed:** El cierre se formalizó como temporal por dependencia de DNS, en lugar de “done” definitivo por dominio fijo.
- **Skipped:** Validación manual completa de dominio fijo y VoBo final de stakeholders (bloqueo externo de DNS).
- **Key Decisions:** Priorizar seguridad/trazabilidad declarando explícitamente cierre temporal; mantener fallback temporal controlado para demos.
- **Escalated ADRs:** None (se recomienda evaluar ADR para estrategia de preview multi-entorno en iteración posterior).
- **Lesson:** En enablers de conectividad externa, separar “implementación técnica” de “dependencias operativas externas” evita cierres falsos.
