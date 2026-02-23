import { createClient } from "@/lib/supabase/server";
import type { Category, CategoryWithProductCount } from "@/types/database";

interface CategoryWithProducts extends Category {
  products: { count: number }[];
}

export async function fetchCategoriesWithCount(): Promise<
  CategoryWithProductCount[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*, products(count)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const categories = (data as CategoryWithProducts[] | null) ?? [];
  return categories.map((cat) => ({
    ...cat,
    product_count: cat.products?.[0]?.count ?? 0,
  }));
}
