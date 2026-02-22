import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export interface SearchProductsOptions {
  query?: string;
  categoryId?: string | null;
}

/**
 * Client-side search for visible products using ilike on name and description.
 * Designed to be called from Client Components via the browser Supabase client.
 * Follows ADR-005: typed assertion for Supabase query results.
 */
export async function searchProducts(
  options: SearchProductsOptions
): Promise<Product[]> {
  const { query, categoryId } = options;
  const supabase = createClient();

  let builder = supabase
    .from("products")
    .select("*")
    .eq("is_visible", true);

  if (query && query.trim().length > 0) {
    const term = `%${query.trim()}%`;
    builder = builder.or(`name.ilike.${term},description.ilike.${term}`);
  }

  if (categoryId) {
    builder = builder.eq("category_id", categoryId);
  }

  const { data } = await builder.order("name", { ascending: true });

  return (data as Product[] | null) ?? [];
}
