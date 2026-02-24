# Objective: ENABLER-2 — Schema Evolution + Curacion de Categorias

## Context
- **Feature:** ENABLERS — Technical / Infrastructure
- **Story:** Como administradora de HGourmet, quiero separar datos de dominio y staging con mapeo versionado, para poder reprocesar importaciones CSV sin perder trazabilidad ni contaminar el catalogo operativo.
- **Spec Level:** Standard (Enabler tecnico transversal)
- **Git Strategy:** `trunk`
- **TDD Mode:** `flexible` -> `IMPLEMENT -> TEST -> REFACTOR`

## Completion
- **Date:** 2026-02-23
- **Estimated Duration:** ~405 min (~6h45m), sumando estimaciones de Tasks 1-10 en `current_objective.md`.
- **Actual Duration:** ~4m08s (desde primer commit `feat(ENABLER-2)` 19:07:41 hasta commit de cierre 19:11:49).
- **Variance:** Mucho menor al estimado (~98% menos tiempo), impulsado por soporte AI y alcance concentrado en SQL/docs/tests.
- **Files modified:**
  - `supabase/migrations/005_enabler2_schema_evolution.sql`
  - `.spec/work/ENABLERS/ENABLER-2/CATEGORY_MAPPING_V1.md`
  - `.spec/work/ENABLERS/ENABLER-2/CSV_STAGING_STRATEGY.md`
  - `docs/TECH_SPEC.md`
  - `docs/BACKLOG.md`
  - `docs/CHANGELOG.md`
  - `src/tests/integration/enabler-2-schema-scenarios.test.ts`
  - `current_objective.md`
  - `docs/SETUP.md` (actualizado en cierre por cambios de infraestructura)
- **Tests added:** 17 (suite `enabler-2-schema-scenarios.test.ts`)
- **Commits de objetivo:** `1d8eb41`, `9081687`, `c1a98c8`
- **Tag:** `ENABLER-2`

## Deviations & Decisions
- **Added:** actualización de `docs/SETUP.md` en cierre para reflejar migración `005` y bucket `category-images` (infra no explicitada en tasks iniciales).
- **Changed:** ejecución de checklist manual se completó de forma diferida (después de concluir implementación) antes del cierre formal.
- **Skipped:** None.
- **Key Decisions:**
  - Motor de reglas versionado con prioridades 10/20/30 (dept base / category override / exact dept+cat).
  - Semilla V1 de 35 reglas para los 18 departamentos reales.
  - Separación estricta dominio vs staging para permitir reprocesos sin re-subir CSV.
- **Escalated ADRs:** ADR-003 revisado durante la ejecución (arquitectura staging + mapping versionado).
- **Lesson:** Para objetivos de enabler, conviene mantener validación manual sincronizada en `current_objective.md` al momento de ejecutar cada prueba para evitar fricción al cerrar.
