import { createClient } from "@/lib/supabase/server";
import type { Category, CategoryWithProductCount } from "@/types/database";

export async function fetchAllCategoriesAdmin(): Promise<
  CategoryWithProductCount[]
> {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (!categories || categories.length === 0) return [];

  const { data: counts } = await supabase
    .from("products")
    .select("category_id");

  const productRows = (counts ?? []) as { category_id: string }[];
  const countMap = new Map<string, number>();
  for (const row of productRows) {
    const current = countMap.get(row.category_id) ?? 0;
    countMap.set(row.category_id, current + 1);
  }

  return (categories as Category[]).map((cat) => ({
    ...cat,
    product_count: countMap.get(cat.id) ?? 0,
  }));
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
