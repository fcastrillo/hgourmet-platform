-- Seed data for HU-1.1 testing
-- 6 categories (1 inactive) + 15 products (2 hidden, 2 unavailable, 3 featured, 2 seasonal)

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
  ('Chocolate', 'chocolate', 'Chocolates finos de repostería: cobertura, chips, ganache y más.', 1, true),
  ('Harinas', 'harinas', 'Harinas especiales: almendra, coco, arroz, integral y más.', 2, true),
  ('Sprinkles', 'sprinkles', 'Decoraciones comestibles: chispas, perlas, confeti y más.', 3, true),
  ('Moldes', 'moldes', 'Moldes de silicón, metal y policarbonato para repostería.', 4, true),
  ('Materia Prima', 'materia-prima', 'Ingredientes base: mantequilla, crema, esencias y colorantes.', 5, true),
  ('Temporada Navideña', 'temporada-navidena', 'Productos de edición limitada navideña.', 6, false);

-- ============================================================
-- PRODUCTS
-- ============================================================

-- Chocolate (5 visible + 2 hidden = 7 total)
INSERT INTO products (category_id, name, slug, description, price, is_available, is_featured, is_seasonal, is_visible) VALUES
  ((SELECT id FROM categories WHERE slug = 'chocolate'), 'Chocolate Belga 1kg', 'chocolate-belga-1kg', 'Cobertura de chocolate belga semi-amargo 54% cacao. Ideal para ganache y trufas.', 350.00, true, true, false, true),
  ((SELECT id FROM categories WHERE slug = 'chocolate'), 'Chips de Chocolate Blanco 500g', 'chips-chocolate-blanco-500g', 'Chips de chocolate blanco premium para hornear. Se funden uniformemente.', 185.00, true, false, false, true),
  ((SELECT id FROM categories WHERE slug = 'chocolate'), 'Cocoa en Polvo 250g', 'cocoa-en-polvo-250g', 'Cocoa natural sin azúcar. Perfecta para brownies y bebidas calientes.', 95.00, true, true, false, true),
  ((SELECT id FROM categories WHERE slug = 'chocolate'), 'Chocolate Ruby 500g', 'chocolate-ruby-500g', 'Chocolate rosado natural con notas frutales. Tendencia en repostería moderna.', 420.00, false, false, true, true),
  ((SELECT id FROM categories WHERE slug = 'chocolate'), 'Ganache Listo 300g', 'ganache-listo-300g', 'Ganache de chocolate oscuro listo para usar. Solo calentar y aplicar.', 210.00, true, false, false, true),
  ((SELECT id FROM categories WHERE slug = 'chocolate'), 'Chocolate Interno Test', 'chocolate-interno-test', 'Producto de prueba interno, no debe ser visible.', 100.00, true, false, false, false),
  ((SELECT id FROM categories WHERE slug = 'chocolate'), 'Muestra Chocolate Premium', 'muestra-chocolate-premium', 'Muestra para evaluación interna.', 50.00, true, false, false, false);

-- Harinas (3 visible)
INSERT INTO products (category_id, name, slug, description, price, is_available, is_featured, is_seasonal, is_visible) VALUES
  ((SELECT id FROM categories WHERE slug = 'harinas'), 'Harina de Almendra 500g', 'harina-de-almendra-500g', 'Harina de almendra fina para macarons y pasteles sin gluten.', 280.00, true, true, false, true),
  ((SELECT id FROM categories WHERE slug = 'harinas'), 'Harina de Coco 400g', 'harina-de-coco-400g', 'Harina de coco orgánica alta en fibra. Ideal para recetas keto.', 165.00, true, false, false, true),
  ((SELECT id FROM categories WHERE slug = 'harinas'), 'Harina de Arroz 1kg', 'harina-de-arroz-1kg', 'Harina de arroz superfina para mochis y repostería asiática.', 120.00, false, false, true, true);

-- Moldes (3 visible)
INSERT INTO products (category_id, name, slug, description, price, is_available, is_featured, is_seasonal, is_visible) VALUES
  ((SELECT id FROM categories WHERE slug = 'moldes'), 'Molde Silicona Rosas 6 Cavidades', 'molde-silicona-rosas', 'Molde de silicón premium con 6 cavidades en forma de rosa. Apto para horno y congelador.', 245.00, true, false, false, true),
  ((SELECT id FROM categories WHERE slug = 'moldes'), 'Molde Policarbonato Bombones', 'molde-policarbonato-bombones', 'Molde profesional de policarbonato para 24 bombones. Acabado brillante garantizado.', 380.00, true, false, false, true),
  ((SELECT id FROM categories WHERE slug = 'moldes'), 'Set Cortadores Navideños', 'set-cortadores-navidenos', 'Set de 12 cortadores metálicos con formas navideñas: estrella, árbol, bastón y más.', 195.00, true, false, true, true);

-- Materia Prima (2 visible)
INSERT INTO products (category_id, name, slug, description, price, is_available, is_featured, is_seasonal, is_visible) VALUES
  ((SELECT id FROM categories WHERE slug = 'materia-prima'), 'Extracto de Vainilla 120ml', 'extracto-vainilla-120ml', 'Extracto puro de vainilla de Madagascar. Aroma intenso y sabor auténtico.', 310.00, true, false, false, true),
  ((SELECT id FROM categories WHERE slug = 'materia-prima'), 'Colorante en Gel Set 8 Colores', 'colorante-gel-set-8', 'Set de 8 colorantes en gel concentrados. No alteran la consistencia de la masa.', 450.00, true, false, false, true);

-- Sprinkles: 0 visible products (for empty state testing)
-- No products inserted for this category intentionally
