import { createClient } from "@/lib/supabase/server";
import type { Brand } from "@/types/database";

export async function fetchActiveBrands(): Promise<Brand[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (data as Brand[] | null) ?? [];
}
