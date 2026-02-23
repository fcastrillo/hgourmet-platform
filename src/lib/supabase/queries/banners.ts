import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/types/database";

export async function fetchActiveBanners(): Promise<Banner[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (data as Banner[] | null) ?? [];
}
