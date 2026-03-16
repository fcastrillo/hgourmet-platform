import { createClient } from "@/lib/supabase/server";
import type { WhatsAppInteraction } from "@/types/database";

export async function fetchWhatsAppInteractionsAdmin(
  limit = 200,
): Promise<WhatsAppInteraction[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whatsapp_interactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as WhatsAppInteraction[] | null) ?? [];
}
