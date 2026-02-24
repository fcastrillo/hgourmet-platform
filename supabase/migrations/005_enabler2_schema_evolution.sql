-- Migration: 005_enabler2_schema_evolution
-- ENABLER-2: Schema Evolution + Curación de Categorías
-- Adds domain columns to categories/products and creates the staging model
-- for versioned CSV import and category mapping.

-- ============================================================
-- TASK 2: DOMAIN COLUMNS
-- ============================================================

-- categories: image_url required by HU-1.5 (category showcase)
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_url text;

-- products: barcode + sat_code required for real inventory import (HU-2.3)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS barcode text,
  ADD COLUMN IF NOT EXISTS sat_code text;

-- ============================================================
-- TASK 3: STAGING TABLES
-- ============================================================

-- import_batches: one record per CSV file uploaded
CREATE TABLE IF NOT EXISTS import_batches (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_filename text        NOT NULL,
  source_file_hash text       NOT NULL,
  mapping_version text        NOT NULL,
  status          text        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_rows      integer,
  rows_created    integer     NOT NULL DEFAULT 0,
  rows_updated    integer     NOT NULL DEFAULT 0,
  rows_skipped    integer     NOT NULL DEFAULT 0,
  rows_errored    integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  processed_at    timestamptz
);

-- product_import_raw: raw CSV row payload per batch (audit / reprocess)
CREATE TABLE IF NOT EXISTS product_import_raw (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id          uuid        NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  source_row_number integer     NOT NULL,
  payload           jsonb       NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- category_mapping_rules: versioned rules for departamento+categoria -> curated_category
-- Resolution order by priority (DESC): 30 dept+cat exact > 20 cat-only > 10 dept-only
CREATE TABLE IF NOT EXISTS category_mapping_rules (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_version   text        NOT NULL,
  departamento_raw  text        NOT NULL,  -- normalized lowercase; '*' = any department
  categoria_raw     text        NOT NULL,  -- normalized lowercase; '*' = any category
  curated_category  text        NOT NULL,
  priority          integer     NOT NULL DEFAULT 10
                                CHECK (priority IN (10, 20, 30)),
  is_active         boolean     NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mapping_version, departamento_raw, categoria_raw)
);

-- product_import_issues: row-level errors per batch for partial import + reporting
CREATE TABLE IF NOT EXISTS product_import_issues (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id          uuid        NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  source_row_number integer     NOT NULL,
  issue_code        text        NOT NULL,  -- e.g. 'INVALID_PRICE', 'UNMAPPED_CATEGORY', 'DUPLICATE_SKU'
  issue_detail      text        NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TASK 4: INDEXES
-- ============================================================

-- Fast lookup of all rows belonging to a batch
CREATE INDEX IF NOT EXISTS idx_product_import_raw_batch
  ON product_import_raw(batch_id, source_row_number);

-- Fast lookup of issues by batch and row
CREATE INDEX IF NOT EXISTS idx_product_import_issues_batch
  ON product_import_issues(batch_id, source_row_number);

-- Fast rule resolution: version + dept + cat ordered by priority
CREATE INDEX IF NOT EXISTS idx_category_mapping_rules_lookup
  ON category_mapping_rules(mapping_version, departamento_raw, categoria_raw, priority DESC)
  WHERE is_active = true;

-- ============================================================
-- ROW LEVEL SECURITY (staging tables — admin-only)
-- ============================================================

ALTER TABLE import_batches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_import_raw     ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_mapping_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_import_issues  ENABLE ROW LEVEL SECURITY;

-- import_batches: authenticated (admin) only
CREATE POLICY "import_batches_auth_all" ON import_batches
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- product_import_raw: authenticated (admin) only
CREATE POLICY "product_import_raw_auth_all" ON product_import_raw
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- category_mapping_rules: authenticated write; anon can read active rules
-- (needed if the import preview runs client-side in a future iteration)
CREATE POLICY "category_mapping_rules_anon_select" ON category_mapping_rules
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "category_mapping_rules_auth_all" ON category_mapping_rules
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- product_import_issues: authenticated (admin) only
CREATE POLICY "product_import_issues_auth_all" ON product_import_issues
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- SEED: category_mapping_rules V1
-- Resolution priority:
--   30 = exact dept+cat override (highest)
--   20 = category-only override
--   10 = department base (lowest)
-- departamento_raw and categoria_raw are stored lowercase (normalized).
-- '*' is the wildcard meaning "any value".
-- ============================================================

INSERT INTO category_mapping_rules
  (mapping_version, departamento_raw, categoria_raw, curated_category, priority)
VALUES
  -- ── STEP 1: Department base rules (priority 10) ──────────────────────────
  ('v1', 'herramientas',   '*', 'Utensilios',  10),
  ('v1', 'cortadores',     '*', 'Utensilios',  10),
  ('v1', 'accesorios',     '*', 'Utensilios',  10),
  ('v1', 'refrigeracion',  '*', 'Insumos',     10),
  ('v1', 'decoracion',     '*', 'Decoración',  10),
  ('v1', 'colorantes',     '*', 'Decoración',  10),
  ('v1', 'velas',          '*', 'Decoración',  10),
  ('v1', 'pastel',         '*', 'Bases',       10),
  ('v1', 'capacillos',     '*', 'Desechables', 10),
  ('v1', 'bolsas',         '*', 'Desechables', 10),
  ('v1', 'desechables',    '*', 'Desechables', 10),
  ('v1', 'caja',           '*', 'Desechables', 10),
  ('v1', 'moldes',         '*', 'Moldes',      10),
  ('v1', 'insumos',        '*', 'Insumos',     10),
  ('v1', 'extractos',      '*', 'Insumos',     10),
  ('v1', 'inix',           '*', 'Insumos',     10),
  ('v1', 'comida',         '*', 'Insumos',     10),
  ('v1', 'hgourmet',       '*', 'Insumos',     10),

  -- ── STEP 3a: Category-only overrides (priority 20) ───────────────────────
  -- These correct chocolate-related sub-categories regardless of department.
  ('v1', '*', 'chispas',           'Chocolates', 20),
  ('v1', '*', 'chocolate',         'Chocolates', 20),
  ('v1', '*', 'cocoa',             'Chocolates', 20),
  ('v1', '*', 'coberturas',        'Chocolates', 20),
  ('v1', '*', 'granillos',         'Chocolates', 20),
  ('v1', '*', 'semiamargo',        'Chocolates', 20),
  ('v1', '*', 'amargo',            'Chocolates', 20),
  ('v1', '*', 'leche',             'Chocolates', 20),
  ('v1', '*', 'blanco',            'Chocolates', 20),
  ('v1', '*', 'sin azucar',        'Chocolates', 20),
  -- Utensil-specific category overrides
  ('v1', '*', 'tapetes de silicon','Utensilios', 20),
  ('v1', '*', 'plumones',          'Utensilios', 20),
  ('v1', '*', 'raspas',            'Utensilios', 20),
  ('v1', '*', 'espatulas',         'Utensilios', 20),

  -- ── STEP 3b: Dept+Category exact overrides (priority 30) ─────────────────
  -- These resolve ambiguities where the same category means different things
  -- in different departments. They win over all other rules.
  ('v1', 'refrigeracion', 'lacteos',    'Insumos',    30),
  ('v1', 'insumos',       'lacteos',    'Insumos',    30),
  ('v1', 'hgourmet',      'chocolate',  'Chocolates', 30)

ON CONFLICT (mapping_version, departamento_raw, categoria_raw) DO NOTHING;
