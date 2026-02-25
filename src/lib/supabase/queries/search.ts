import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export interface SearchProductsOptions {
  query?: string;
  categoryId?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  availableOnly?: boolean;
}

/**
 * Client-side search for visible products using ilike on name and description.
 * Designed to be called from Client Components via the browser Supabase client.
 * Follows ADR-005: typed assertion for Supabase query results.
 * Follows ADR-007: client-side data fetching for interactive features.
 */
export async function searchProducts(
  options: SearchProductsOptions
): Promise<Product[]> {
  const { query, categoryId, priceMin, priceMax, availableOnly } = options;
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

  if (priceMin != null && priceMin > 0) {
    builder = builder.gte("price", priceMin);
  }

  if (priceMax != null && priceMax > 0) {
    builder = builder.lte("price", priceMax);
  }

  if (availableOnly) {
    builder = builder.eq("is_available", true);
  }

  const { data } = await builder.order("name", { ascending: true });

  return (data as Product[] | null) ?? [];
}
