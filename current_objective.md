# Objective: HU-2.3 — Importación masiva de productos vía CSV

## Context
- **Feature:** FEAT-2 — Panel de Administración
- **Story:** Como administradora de HGourmet, quiero cargar un archivo CSV con múltiples productos para agregarlos al catálogo de forma masiva, para poder migrar el inventario completo (~300-1000 productos) sin ingresarlos uno por uno
- **Spec Level:** Standard

## Acceptance Criteria (BDD)
> **Dado que** soy una administradora autenticada y tengo un archivo CSV con 50 productos válidos,  
> **Cuando** subo el archivo y confirmo la importación,  
> **Entonces** el sistema crea los 50 productos en la base de datos y muestra un resumen "50 creados, 0 errores".

> **Dado que** subo un CSV con 30 filas válidas y 5 filas con errores (precio negativo, categoría inexistente),  
> **Cuando** confirmo la importación,  
> **Entonces** el sistema crea los 30 productos válidos, omite las 5 filas con errores, y muestra un detalle de cada error con número de fila y motivo.

> **Dado que** subo un CSV donde 3 filas tienen un SKU que ya existe en la base de datos (escenario de error),  
> **Cuando** confirmo la importación,  
> **Entonces** el sistema omite las filas duplicadas, importa las restantes, y reporta "3 duplicados omitidos" en el resumen.

## Implementation Plan

### Análisis técnico previo
- **Data changes:** Sin cambios de esquema obligatorios; HU-2.3 reutiliza staging de ENABLER-2 (`import_batches`, `product_import_raw`, `product_import_issues`, `category_mapping_rules`) y `products` con `sku/barcode/sat_code`.
- **Infrastructure prerequisites:** No requiere nuevo bucket, credenciales, ni variables de entorno. Sin cambios a `docs/SETUP.md` para esta HU.
- **Component classification:** UI de importación y preview como `[CC]`; página contenedora y wiring inicial como `[SC]`; persistencia/import final como `[SA]`.
- **Dependencies:** ENABLER-2 completado (desbloqueante), HU-2.2 (CRUD de productos) y ADR-003 vigente.
- **Risk areas:** parsing de CSV grande en cliente, normalización de precio MXN (`$1,135.00`), mapeo ambiguo de categoría, idempotencia por SKU, feedback de errores por fila.

### Task 1: Definir contrato de datos del importador (~40 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `tests/integration/hu-2.3-scenarios.test.tsx` (new), `src/lib/import/csv/types.ts` (new)
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 2: Implementar parser CSV y normalizadores base (~55 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/lib/import/csv/parseCsv.ts` (new), `src/lib/import/csv/normalizers.ts` (new), `src/lib/import/csv/types.ts`
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 3: Resolver mapeo departamento+categoría hacia categoría curada (~55 min)
- **Type:** [SA]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(admin)/admin/productos/actions.ts`, `src/lib/import/csv/mapping.ts` (new)
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 4: Validar filas y generar reporte de errores por fila (~50 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/lib/import/csv/validators.ts` (new), `src/lib/import/csv/issue-codes.ts` (new), `tests/integration/hu-2.3-scenarios.test.tsx`
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 5: Construir preview de importación y resumen pre-confirmación (~50 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/admin/ProductCsvImportPanel.tsx` (new), `src/components/admin/ProductCsvPreviewTable.tsx` (new), `src/app/(admin)/admin/productos/importar/page.tsx` (new)
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 6: Implementar Server Action de importación parcial idempotente (~55 min)
- **Type:** [SA]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(admin)/admin/productos/actions.ts`, `src/lib/import/csv/upsert.ts` (new)
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 7: Persistir auditoría de batch y issues en staging (~50 min)
- **Type:** [DB]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(admin)/admin/productos/actions.ts`, `src/lib/import/csv/staging.ts` (new), `tests/integration/enabler-2-schema-scenarios.test.ts`
- **Verification:** `npm run test:run -- tests/integration/enabler-2-schema-scenarios.test.ts tests/integration/hu-2.3-scenarios.test.tsx`

### Task 8: Integrar navegación admin + descarga de template CSV (~40 min)
- **Type:** [SC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/app/(admin)/admin/productos/page.tsx`, `src/components/admin/AdminSidebar.tsx`, `public/templates/product-import-template.csv` (new)
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 9: Endurecer UX de errores, estados de carga y éxito/cancelación (~45 min)
- **Type:** [CC]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `src/components/admin/ProductCsvImportPanel.tsx`, `src/components/admin/ProductCsvPreviewTable.tsx`, `tests/integration/hu-2.3-scenarios.test.tsx`
- **Verification:** `npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx`

### Task 10: Validación integral de la HU y smoke de regresión admin (~35 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT → TEST → REFACTOR
- **Files:** `tests/integration/hu-2.3-scenarios.test.tsx`, `tests/integration/hu-2.2-scenarios.test.tsx`
- **Verification:** `npm run lint && npm run test:run -- tests/integration/hu-2.3-scenarios.test.tsx tests/integration/hu-2.2-scenarios.test.tsx`

## Database Changes (if applicable)
No schema migration required in this objective. The implementation must reuse ENABLER-2 structures already deployed:
- `import_batches`
- `product_import_raw`
- `product_import_issues`
- `category_mapping_rules`
- `products.sku` as idempotency key

## Manual Testing Checklist
- [ ] Ingresar como admin y abrir `/admin/productos/importar`.
- [ ] Descargar el template CSV y validar columnas esperadas.
- [ ] Subir CSV 100% válido y confirmar resumen "N creados, 0 errores".
- [ ] Subir CSV mixto (válidos + inválidos) y confirmar import parcial con detalle por fila.
- [ ] Subir CSV con SKUs duplicados existentes y confirmar omisión idempotente.
- [ ] Verificar que productos importados aparecen en `/admin/productos` y storefront según `is_visible/is_available`.
- [ ] Verificar que filas con categoría no mapeada quedan registradas como issue y no bloquean el batch completo.
- [ ] Repetir import del mismo archivo y confirmar comportamiento idempotente sin duplicación de productos.

## Definition of Done
- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors
- [ ] RLS policies tested (if applicable)
- [ ] CHANGELOG entry drafted
- [ ] All changes committed with `feat(HU-2.3):` convention
- [ ] Tag `HU-2.3` created
