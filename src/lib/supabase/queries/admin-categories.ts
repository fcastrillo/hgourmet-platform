import { createClient } from "@/lib/supabase/server";
import type { Category, CategoryWithProductCount } from "@/types/database";

interface CategoryWithProducts extends Category {
  products: { count: number }[];
}

export async function fetchAllCategoriesAdmin(): Promise<
  CategoryWithProductCount[]
> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("display_order", { ascending: true });

  const categories = (data as CategoryWithProducts[] | null) ?? [];
  if (!categories || categories.length === 0) return [];

  return categories.map((cat) => {
    const { products, ...category } = cat;
    return {
      ...category,
      product_count: products?.[0]?.count ?? 0,
    };
  });
}

export async function fetchCategoryByIdAdmin(
  id: string
): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  return data as Category | null;
}

export async function fetchMaxDisplayOrder(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  return (data as { display_order: number } | null)?.display_order ?? 0;
}
