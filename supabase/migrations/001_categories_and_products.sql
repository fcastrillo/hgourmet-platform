-- Migration: 001_categories_and_products
-- HU-1.1: Navegación por categorías de productos
-- Creates the core catalog tables with RLS policies for public storefront access.

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  image_url text,
  sku text UNIQUE,
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_seasonal boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_visible_available ON products(is_visible, is_available);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_seasonal ON products(is_seasonal);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories: public read for storefront
CREATE POLICY "categories_anon_select" ON categories
  FOR SELECT TO anon USING (true);

CREATE POLICY "categories_auth_all" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products: public read only visible products
CREATE POLICY "products_anon_select" ON products
  FOR SELECT TO anon USING (is_visible = true);

CREATE POLICY "products_auth_all" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
