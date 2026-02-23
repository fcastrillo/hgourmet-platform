import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types/database";

/**
 * Fetches all published recipes for the public storefront, ordered by display_order.
 * RLS anon policy enforces is_published = true at DB level.
 * Follows ADR-005: typed assertion to work around Supabase chained-eq TS inference.
 */
export async function fetchPublishedRecipes(): Promise<Recipe[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (data as Recipe[] | null) ?? [];
}

/**
 * Fetches a single published recipe by slug.
 * Returns null if the recipe does not exist or is not published.
 * Follows ADR-005: typed assertion for chained .eq().single().
 */
export async function fetchPublishedRecipeBySlug(
  slug: string,
): Promise<Recipe | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return data as Recipe | null;
}
