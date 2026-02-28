-- HU-6.2: Structured recipe content fields
-- Adds 3 plain-text columns alongside the existing `content` (Markdown) column.
-- `content` is preserved for backward compatibility and SEO fallback.
-- Priority rule: if ingredients_text IS NOT NULL → structured; else → parse content (legacy).

ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS ingredients_text text,
  ADD COLUMN IF NOT EXISTS preparation_text text,
  ADD COLUMN IF NOT EXISTS tip_text        text;

COMMENT ON COLUMN public.recipes.ingredients_text IS
  'Recipe ingredients as plain text (one item per line). NULL = legacy recipe (use content field). HU-6.2.';

COMMENT ON COLUMN public.recipes.preparation_text IS
  'Recipe preparation steps as plain text (one step per line or numbered). NULL = legacy recipe. HU-6.2.';

COMMENT ON COLUMN public.recipes.tip_text IS
  'Optional HGourmet tip shown in the recipe detail card. NULL = no tip. HU-6.2.';
