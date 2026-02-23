-- Migration: 002_banners
-- HU-2.5: Gestión de banners rotativos
-- Creates the banners table for homepage carousel with RLS policies.

-- ============================================================
-- BANNERS
-- ============================================================
CREATE TABLE banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_banners_display_order ON banners(display_order);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Anon: read active banners only (for storefront carousel)
CREATE POLICY "banners_anon_select" ON banners
  FOR SELECT TO anon USING (is_active = true);

-- Authenticated: full access (admin panel)
CREATE POLICY "banners_auth_all" ON banners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
