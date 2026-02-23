-- Migration: 003_brands
-- HU-2.6: Gestión de marcas/proveedores

CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_brands_display_order ON brands(display_order);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands_anon_select" ON brands
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "brands_auth_all" ON brands
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
