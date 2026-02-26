# Objective: ENABLER-3 — Hardening del importador CSV (confiabilidad + trazabilidad)

## Context
- **Feature:** ENABLERS — Import pipeline hardening (cross-feature)
- **Objective:** Como administradora del catálogo, quiero que la importación CSV procese todo el archivo en modo best-effort con trazabilidad por fila, para poder corregir únicamente los registros fallidos sin perder visibilidad del resultado total.
- **Spec Level:** Technical
- **Git Mode:** `trunk` (from `.spec/config.md`)
- **TDD Mode:** `flexible` (`IMPLEMENT → TEST → REFACTOR`)

## Acceptance Criteria (BDD)
- **Dado que** un chunk de importación contiene una fila inválida a nivel DB,  
  **Cuando** falle el insert por lote,  
  **Entonces** el sistema debe degradar a inserción por fila, persistir issue técnico por cada fila fallida y continuar con las filas válidas.

- **Dado que** la importación procesa miles de filas,  
  **Cuando** finaliza la ejecución,  
  **Entonces** el resumen debe cumplir `created + updated + skipped + errored = totalRows` y no debe existir ninguna fila sin estado trazable.

- **Dado que** existen filas omitidas por regla funcional y filas con error técnico,  
  **Cuando** se presenta el resumen en admin,  
  **Entonces** `skipped` y `errored` deben mostrarse como métricas separadas y consistentes con el detalle de issues.

## Implementation Plan

### Task 1: Extender contrato de tipos para errores técnicos ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/lib/import/csv/types.ts`, `src/lib/import/csv/upsert.ts`
- **Changes:** `DB_INSERT_ERROR` y `DB_UPDATE_ERROR` añadidos a `IssueCode`; `UpsertResult` exportado con `issues: RowIssue[]` en lugar de `skipped`.

### Task 2: Hardening de upsert con fallback por fila ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/lib/import/csv/upsert.ts`
- **Changes:** Fallback row-by-row en fallo de batch; slug cache intra-batch (`Set<string>`); `DB_UPDATE_ERROR` en updates fallidos; proceso continúa en todos los casos.

### Task 3: Consolidación de métricas e issues en action de import ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/app/(admin)/admin/productos/actions.ts`
- **Changes:** Invariante `created + updated + skipped + errored = totalRows` garantizado; issues de validación + DB mergeados sin doble conteo; staging actualizado con métricas correctas.

### Task 4: Ajuste de UX del resumen en panel de importación ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/components/admin/ProductCsvImportPanel.tsx`, `src/components/admin/ProductCsvPreviewTable.tsx`
- **Changes:** Tarjetas "Omitidos" (amber) y "Con error" (red) separadas; etiquetas `DB_INSERT_ERROR` / `DB_UPDATE_ERROR` en tabla de incidencias; texto de sección actualizado.

### Task 5: Pruebas de contrato para fallo parcial y consistencia ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `src/tests/integration/hu-2.3-scenarios.test.tsx`
- **Changes:** 5 nuevos tests ENABLER-3 (batch fallback, invariante matemático, UI separada, labels DB errors); 56/56 en verde.

## Database Changes
- No migration requerida para esta iteración.
- Se reutiliza `product_import_issues.issue_code` (`text`) para nuevos códigos técnicos.

## Manual Testing Checklist
- [x] Importar CSV con mezcla de filas válidas y al menos 1 error DB inducido.
- [x] Verificar que el proceso termina y no aborta el archivo completo.
- [x] Confirmar que cada fila queda representada en `created/updated/skipped/errored`.
- [x] Verificar que el panel muestra `skipped` y `errored` por separado.
- [x] Revisar `product_import_issues` y validar `source_row_number`, `issue_code`, `issue_detail`.

## Definition of Done
- [x] Todos los criterios BDD cubiertos por pruebas de integración.
- [x] `hu-2.3-scenarios.test.tsx` en verde (56/56).
- [x] Resumen final consistente: `created + updated + skipped + errored = totalRows`.
- [x] Sin pérdidas silenciosas en fallos parciales de batch.
- [x] `ReadLints` sin errores nuevos en archivos modificados.
- [x] Entrada de cierre preparada para `docs/CHANGELOG.md`.

## Completion
- **Date:** 2026-02-26
- **Estimated Duration:** M (~1–2 días)
- **Actual Duration:** ~29h 47m (from first `ENABLER-3` commit at `2026-02-24 14:03 -0600` to implementation commit at `2026-02-25 19:50 -0600`)
- **Variance:** Dentro del rango estimado de 1–2 días para hardening + pruebas + cierre documental.
- **Files modified:**  
  `src/lib/import/csv/types.ts`,  
  `src/lib/import/csv/upsert.ts`,  
  `src/app/(admin)/admin/productos/actions.ts`,  
  `src/components/admin/ProductCsvImportPanel.tsx`,  
  `src/components/admin/ProductCsvPreviewTable.tsx`,  
  `src/tests/integration/hu-2.3-scenarios.test.tsx`,  
  `docs/BACKLOG.md`,  
  `docs/CHANGELOG.md`
- **Tests added:** 5

## Deviations & Decisions
- **Added:** Etiquetas UI explícitas para `DB_INSERT_ERROR` / `DB_UPDATE_ERROR` en `ProductCsvPreviewTable` (no explícito inicialmente en Task 4).
- **Changed:** Se evitó tocar `src/lib/import/csv/staging.ts` porque la consolidación de issues/métricas quedó resuelta desde `actions.ts` sin necesidad de cambios de API.
- **Skipped:** Ninguna tarea funcional del objetivo.
- **Key Decisions:**  
  1) Adoptar estrategia `best-effort` obligatoria: fallback por fila ante fallo de batch.  
  2) Diferenciar semánticamente `skipped` (regla funcional) vs `errored` (fallo técnico/validación).  
  3) Ignorar temporalmente cambios bajo `briefs/` para el cierre de ENABLER-3 (solicitud explícita de usuario).
- **Escalated ADRs:** None
- **Lesson:** En importaciones masivas, la confiabilidad operativa mejora más con trazabilidad por fila y resumen consistente que con optimización temprana de throughput.
