import { createClient } from "@/lib/supabase/server";
import { FEATURED_PRODUCTS_LIMIT } from "@/lib/constants";
import type { Product, Category } from "@/types/database";

export type ProductWithCategory = Product & {
    categories: Pick<Category, "name" | "slug">;
};

/**
 * Fetches a visible product by its slug, joined with its parent category.
 * Returns null if the product does not exist or is_visible = false.
 * Follows ADR-005: typed assertion to work around Supabase chained-eq TS inference.
 */
export async function fetchProductBySlug(
    slug: string,
): Promise<ProductWithCategory | null> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select(
            `
      *,
      categories:category_id (
        name,
        slug
      )
    `,
        )
        .eq("slug", slug)
        .eq("is_visible", true)
        .single();

    return data as ProductWithCategory | null;
}

/**
 * Fetches visible featured products (is_featured = true), limited for homepage display.
 * RLS anon policy already enforces is_visible = true at DB level.
 */
export async function fetchFeaturedProducts(
    limit: number = FEATURED_PRODUCTS_LIMIT,
): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    return (data as Product[] | null) ?? [];
}

/**
 * Fetches visible seasonal products (is_seasonal = true), limited for homepage display.
 */
export async function fetchSeasonalProducts(
    limit: number = FEATURED_PRODUCTS_LIMIT,
): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_seasonal", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    return (data as Product[] | null) ?? [];
}

/**
 * Fetches ALL visible featured products (no limit) for the "Ver todos" page.
 */
export async function fetchAllFeaturedProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

    return (data as Product[] | null) ?? [];
}

/**
 * Fetches ALL visible seasonal products (no limit) for the "Ver todos" page.
 */
export async function fetchAllSeasonalProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_seasonal", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

    return (data as Product[] | null) ?? [];
}
