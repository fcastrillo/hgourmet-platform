import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type InteractionInsert =
  Database["public"]["Tables"]["whatsapp_interactions"]["Insert"];

export interface ContactFormTrackingInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
}

export interface ProductInterestTrackingInput {
  productId?: string;
  productName: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
}

function resolvePagePath(explicitPath?: string): string | null {
  if (explicitPath && explicitPath.trim().length > 0) {
    return explicitPath;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return `${window.location.pathname}${window.location.search}`;
}

async function insertWhatsAppInteraction(payload: InteractionInsert): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("whatsapp_interactions").insert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function recordContactFormInteraction(
  input: ContactFormTrackingInput,
): Promise<boolean> {
  const payload: InteractionInsert = {
    interaction_type: "contact_form",
    channel: "whatsapp",
    page_path: resolvePagePath(input.pagePath),
    customer_name: input.customerName.trim(),
    customer_phone: input.customerPhone.trim(),
    customer_email: input.customerEmail?.trim() || null,
    metadata: {
      ...(input.metadata ?? {}),
      source: "contact_form",
    },
  };

  return insertWhatsAppInteraction(payload);
}

export async function recordProductInterestInteraction(
  input: ProductInterestTrackingInput,
): Promise<boolean> {
  const payload: InteractionInsert = {
    interaction_type: "product_interest",
    channel: "whatsapp",
    page_path: resolvePagePath(input.pagePath),
    product_id: input.productId ?? null,
    product_name: input.productName.trim(),
    metadata: {
      ...(input.metadata ?? {}),
      source: "product_detail_cta",
    },
  };

  return insertWhatsAppInteraction(payload);
}
