import { WHATSAPP_NUMBER } from "@/lib/constants";

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

/**
 * Builds a wa.me deep link URL with a pre-filled contact message.
 * Uses encodeURIComponent to safely encode special characters, accents and newlines.
 * Aligns with ADR-002: deep link only, no WhatsApp Business API.
 */
export function buildContactWhatsAppUrl(data: ContactFormData): string {
  const lines: string[] = [
    `Hola HGourmet, mi nombre es ${data.name}.`,
    `Teléfono: ${data.phone}`,
  ];

  if (data.email?.trim()) {
    lines.push(`Email: ${data.email.trim()}`);
  }

  lines.push("", data.message.trim());

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
