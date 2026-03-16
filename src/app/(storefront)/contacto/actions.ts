"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type InteractionInsert =
  Database["public"]["Tables"]["whatsapp_interactions"]["Insert"];

/**
 * Server-side best-effort traceability helper for WhatsApp interactions.
 * Returns false on any insert failure to avoid blocking conversion flows.
 */
export async function trackWhatsAppInteractionServer(
  payload: InteractionInsert,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    // Supabase SSR typing can infer `never` for this custom table in server actions.
    // Runtime contract is still valid; keep best-effort behavior and avoid build break.
    const { error } = await supabase
      .from("whatsapp_interactions")
      .insert(payload as any);
    return !error;
  } catch {
    return false;
  }
}
