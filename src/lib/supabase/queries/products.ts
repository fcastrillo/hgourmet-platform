import { createClient } from "@/lib/supabase/server";
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
