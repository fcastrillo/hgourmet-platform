import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/types/database";

export async function fetchAllBannersAdmin(): Promise<Banner[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as Banner[] | null) ?? [];
}

export async function fetchBannerByIdAdmin(
  id: string,
): Promise<Banner | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single();

  return data as Banner | null;
}

export async function fetchMaxBannerDisplayOrder(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  return (data as { display_order: number } | null)?.display_order ?? 0;
}
