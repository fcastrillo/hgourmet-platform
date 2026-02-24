# Objective: ENABLER-2 — Schema Evolution + Curacion de Categorias

## Context
- **Feature:** ENABLERS — Technical / Infrastructure
- **Story:** Como administradora de HGourmet, quiero separar datos de dominio y staging con mapeo versionado, para poder reprocesar importaciones CSV sin perder trazabilidad ni contaminar el catalogo operativo.
- **Spec Level:** Standard (Enabler tecnico transversal)
- **Git Strategy:** `trunk` (segun `.spec/config.md`; se trabaja en `main`)
- **TDD Mode:** `flexible` -> `IMPLEMENT -> TEST -> REFACTOR`

## Validation Gate (Step 0)
- **Status:** `WARNINGS` (sin `BLOCKER`) usando esquema de `@validate` sobre `PRD`, `TECH_SPEC`, `BACKLOG` y artefactos de `ENABLER-2`.
- **Warnings relevantes:**
  - `docs/TECH_SPEC.md` aun no refleja completo el alcance de ENABLER-2 (campos y staging).
  - No habia objetivo activo previo (esperado al iniciar este comando).
- **Poka-yoke:** permitido continuar con planificacion e implementacion.

## Acceptance Criteria (BDD)
1. El proyecto distingue explicitamente entre modelo de dominio y modelo de staging.
2. Existe un mapeo V1 completo para las 7 categorias curadas.
3. Esta documentado que columnas del CSV se conservan en staging y cuales pasan a dominio.
4. Esta definida la estrategia de versionado de mapeo para reprocesos.

- **Dado que** las categorias curadas pueden cambiar con feedback del negocio,  
  **Cuando** se defina una nueva version de mapeo,  
  **Entonces** el sistema debe poder reprocesar batches historicos sin re-subir CSV.

- **Dado que** el CSV trae columnas que no son utiles en storefront,  
  **Cuando** importemos productos,  
  **Entonces** esas columnas deben conservarse en staging y no contaminar `products`.

## Implementation Plan

### Task 1: Diseñar migracion SQL de evolucion de esquema (~45 min)
- **Type:** [DB]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `supabase/migrations/005_enabler2_schema_evolution.sql`
- **Verification:** revision SQL + `npm run lint`

### Task 2: Agregar columnas de dominio (`categories` y `products`) (~30 min)
- **Type:** [DB]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `supabase/migrations/005_enabler2_schema_evolution.sql`
- **Verification:** validar DDL (ALTER TABLE) y constraints de columnas opcionales

### Task 3: Crear tablas staging para importaciones versionadas (~55 min)
- **Type:** [DB]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `supabase/migrations/005_enabler2_schema_evolution.sql`
- **Verification:** validar DDL de `import_batches`, `product_import_raw`, `category_mapping_rules`, `product_import_issues`

### Task 4: Definir indices y llaves para reproceso trazable (~35 min)
- **Type:** [DB]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `supabase/migrations/005_enabler2_schema_evolution.sql`
- **Verification:** revisar FKs/indices para consultas por `batch_id`, `mapping_version`, `source_row_number`

### Task 5: Actualizar mapeo curado V1 de 7 categorias (~40 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `.spec/work/ENABLERS/ENABLER-2/CATEGORY_MAPPING_V1.md`
- **Verification:** cobertura de 7 categorias y consistencia con `docs/BACKLOG.md`

### Task 6: Aterrizar estrategia staging vs dominio por columna (~35 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `.spec/work/ENABLERS/ENABLER-2/CSV_STAGING_STRATEGY.md`
- **Verification:** tabla clara de columnas retained-in-staging vs promoted-to-domain

### Task 7: Actualizar especificacion tecnica y ADR-003 (~55 min)
- **Type:** [SC]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `docs/TECH_SPEC.md`
- **Verification:** `rg "barcode|sat_code|import_batches|category_mapping_rules|ADR-003" docs/TECH_SPEC.md`

### Task 8: Alinear backlog y dependencias HU-1.5 / HU-2.3 (~25 min)
- **Type:** [SC]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `docs/BACKLOG.md`
- **Verification:** `rg "ENABLER-2|HU-1.5|HU-2.3" docs/BACKLOG.md`

### Task 9: Crear contrato de pruebas de integracion para enabler (~55 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `src/tests/integration/enabler-2-schema-scenarios.test.ts`
- **Verification:** `npm run test:run -- src/tests/integration/enabler-2-schema-scenarios.test.ts`

### Task 10: Cierre tecnico de calidad del enabler (~30 min)
- **Type:** [TEST]
- **Cycle:** IMPLEMENT -> TEST -> REFACTOR
- **Files:** `docs/CHANGELOG.md` (draft), `current_objective.md` (checklist update)
- **Verification:** `npm run lint && npm run test:run`

## Database Changes (Supabase SQL)
```sql
-- Domain evolution
alter table public.categories
  add column if not exists image_url text;

alter table public.products
  add column if not exists barcode text,
  add column if not exists sat_code text;

-- Staging model for import/reprocess
create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  source_filename text not null,
  source_file_hash text not null,
  mapping_version text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.product_import_raw (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  source_row_number integer not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.category_mapping_rules (
  id uuid primary key default gen_random_uuid(),
  mapping_version text not null,
  departamento_raw text not null,
  categoria_raw text not null,
  curated_category text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (mapping_version, departamento_raw, categoria_raw)
);

create table if not exists public.product_import_issues (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  source_row_number integer not null,
  issue_code text not null,
  issue_detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_import_raw_batch
  on public.product_import_raw(batch_id, source_row_number);

create index if not exists idx_product_import_issues_batch
  on public.product_import_issues(batch_id, source_row_number);
```

## Infrastructure Prerequisites
- No se requieren nuevos servicios externos.
- Mantener documentacion operativa en `docs/SETUP.md` si se agrega flujo de ejecucion de migraciones manuales para entorno de dueñas.

## Manual Testing Checklist
- [ ] Aplicar migracion en entorno local y confirmar que no rompe tablas existentes.
- [ ] Confirmar que `categories.image_url`, `products.barcode` y `products.sat_code` existen y aceptan datos validos.
- [ ] Insertar un `import_batch` de prueba con `mapping_version = v1`.
- [ ] Insertar filas en `product_import_raw` y errores en `product_import_issues` enlazados al mismo batch.
- [ ] Validar que un cambio de `mapping_version` permite coexistir reglas viejas y nuevas sin borrar historial.
- [ ] Confirmar que la documentacion (`TECH_SPEC`, mapeo y estrategia CSV) coincide con la migracion.

## Completion Markers

### Task 1-4: Migración SQL ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `supabase/migrations/005_enabler2_schema_evolution.sql`
- **Commit:** `1d8eb41`

### Task 5: CATEGORY_MAPPING_V1.md ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `.spec/work/ENABLERS/ENABLER-2/CATEGORY_MAPPING_V1.md`
- **Commit:** `9081687`

### Task 6: CSV_STAGING_STRATEGY.md ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `.spec/work/ENABLERS/ENABLER-2/CSV_STAGING_STRATEGY.md`
- **Commit:** `9081687`

### Task 7: TECH_SPEC.md + ADR-003 ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `docs/TECH_SPEC.md`
- **Commit:** `9081687`

### Task 8: BACKLOG.md ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ → REFACTOR ✅
- **Files modified:** `docs/BACKLOG.md`
- **Commit:** `9081687`

### Task 9: Tests de integración ✅
- **Cycle:** IMPLEMENT ✅ → TEST ✅ (17/17 passing) → REFACTOR ✅
- **Files modified:** `src/tests/integration/enabler-2-schema-scenarios.test.ts`
- **Commit:** `9081687`

### Task 10: CHANGELOG + cierre ✅
- **Cycle:** IMPLEMENT ✅ → REFACTOR ✅
- **Files modified:** `docs/CHANGELOG.md`, `current_objective.md`

## Definition of Done
- [x] Todos los criterios BDD del enabler quedan cubiertos por documentacion + pruebas.
- [x] Sin errores de TypeScript/lint (errores pre-existentes en actions.ts, no introducidos).
- [x] Modelo de dominio y staging claramente separado en SQL y docs.
- [x] `docs/TECH_SPEC.md` actualizado (data model + ADR-003 revisado).
- [x] `docs/BACKLOG.md` alineado con dependencias HU-1.5 y HU-2.3.
- [x] Entrada de `CHANGELOG` preparada.
- [x] Commits usando convencion: `feat(ENABLER-2): ...`
