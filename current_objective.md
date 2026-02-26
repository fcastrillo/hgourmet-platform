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

### Task 1: Extender contrato de tipos para errores técnicos (~35 min)
- **Type:** [SA]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/lib/import/csv/types.ts`, `src/lib/import/csv/upsert.ts`
- **Changes:**
  - Agregar nuevos issue codes técnicos (`DB_INSERT_ERROR`, `DB_UPDATE_ERROR`).
  - Extender resultado de upsert para devolver `issues` por `sourceRow`.
- **Verification:** `npm run test -- src/tests/integration/hu-2.3-scenarios.test.tsx`

### Task 2: Hardening de upsert con fallback por fila (~55 min)
- **Type:** [SA]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/lib/import/csv/upsert.ts`
- **Changes:**
  - En `insert` por chunk: si falla, intentar inserción fila a fila.
  - Registrar issue técnico por fila fallida y continuar procesamiento.
  - Mantener updates best-effort y registrar `DB_UPDATE_ERROR` cuando corresponda.
- **Verification:** `npm run test -- src/tests/integration/hu-2.3-scenarios.test.tsx`

### Task 3: Consolidación de métricas e issues en action de import (~50 min)
- **Type:** [SA]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(admin)/admin/productos/actions.ts`, `src/lib/import/csv/staging.ts`
- **Changes:**
  - Integrar issues de validación + upsert sin doble conteo.
  - Asegurar invariante matemático del resumen.
  - Persistir issues técnicos en staging (`product_import_issues`) con detalle útil.
- **Verification:** `npm run test -- src/tests/integration/hu-2.3-scenarios.test.tsx`

### Task 4: Ajuste de UX del resumen en panel de importación (~25 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/admin/ProductCsvImportPanel.tsx`
- **Changes:**
  - Separar visualmente `skipped` y `errored` en tarjetas/resumen.
  - Mantener tabla de issues alineada con conteos reportados.
- **Verification:** `npm run test -- src/tests/integration/hu-2.3-scenarios.test.tsx`

### Task 5: Pruebas de contrato para fallo parcial y consistencia (~55 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/tests/integration/hu-2.3-scenarios.test.tsx`
- **Changes:**
  - Caso de fallo parcial de batch con continuación best-effort.
  - Caso de consistencia `created + updated + skipped + errored = totalRows`.
  - Caso de render de resumen con `skipped` y `errored` separados.
- **Verification:** `npm run test -- src/tests/integration/hu-2.3-scenarios.test.tsx`

## Database Changes
- No migration requerida para esta iteración.
- Se reutiliza `product_import_issues.issue_code` (`text`) para nuevos códigos técnicos.

## Manual Testing Checklist
- [ ] Importar CSV con mezcla de filas válidas y al menos 1 error DB inducido.
- [ ] Verificar que el proceso termina y no aborta el archivo completo.
- [ ] Confirmar que cada fila queda representada en `created/updated/skipped/errored`.
- [ ] Verificar que el panel muestra `skipped` y `errored` por separado.
- [ ] Revisar `product_import_issues` y validar `source_row_number`, `issue_code`, `issue_detail`.

## Definition of Done
- [ ] Todos los criterios BDD cubiertos por pruebas de integración.
- [ ] `hu-2.3-scenarios.test.tsx` en verde.
- [ ] Resumen final consistente: `created + updated + skipped + errored = totalRows`.
- [ ] Sin pérdidas silenciosas en fallos parciales de batch.
- [ ] `ReadLints` sin errores nuevos en archivos modificados.
- [ ] Entrada de cierre preparada para `docs/CHANGELOG.md`.
