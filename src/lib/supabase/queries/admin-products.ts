import { createClient } from "@/lib/supabase/server";
import type { Product, ProductWithCategory } from "@/types/database";

const ADMIN_PRODUCTS_PAGE_SIZE = 10;

export async function fetchProductsAdmin(
  page: number = 1,
  pageSize: number = ADMIN_PRODUCTS_PAGE_SIZE,
  search: string = "",
): Promise<ProductWithCategory[]> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
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
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data } = await query;
  return (data as ProductWithCategory[] | null) ?? [];
}

export async function fetchProductsCountAdmin(
  search: string = "",
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { count } = await query;
  return count ?? 0;
}

export async function fetchProductByIdAdmin(
  id: string,
): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  return data as Product | null;
}
