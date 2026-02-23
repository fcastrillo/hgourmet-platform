import { createClient } from "@/lib/supabase/server";
import type { Brand } from "@/types/database";

export async function fetchAllBrandsAdmin(): Promise<Brand[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as Brand[] | null) ?? [];
}

export async function fetchBrandByIdAdmin(
  id: string,
): Promise<Brand | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  return data as Brand | null;
}

export async function fetchMaxBrandDisplayOrder(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  return (data as { display_order: number } | null)?.display_order ?? 0;
}
