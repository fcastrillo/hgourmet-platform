import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/storefront/ContactForm";
import { WhatsAppCTA } from "@/components/storefront/WhatsAppCTA";

const mockRecordContactFormInteraction = vi.fn();
const mockRecordProductInterestInteraction = vi.fn();

vi.mock("@/lib/whatsapp-tracking", () => ({
  recordContactFormInteraction: (...args: unknown[]) =>
    mockRecordContactFormInteraction(...args),
  recordProductInterestInteraction: (...args: unknown[]) =>
    mockRecordProductInterestInteraction(...args),
}));

const mockOpen = vi.fn();

describe("HU-7.2 — Registrar interacciones de WhatsApp en tabla de trazabilidad", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("open", mockOpen);
    mockOpen.mockReturnValue({ focus: vi.fn() });

    mockRecordContactFormInteraction.mockReset();
    mockRecordProductInterestInteraction.mockReset();
    mockRecordContactFormInteraction.mockResolvedValue(true);
    mockRecordProductInterestInteraction.mockResolvedValue(true);
  });

  it("registra interaction_type=contact_form al enviar formulario válido", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/nombre/i), "Ana García");
    await user.type(screen.getByLabelText(/teléfono/i), "9991234567");
    await user.type(
      screen.getByLabelText(/mensaje/i),
      "Hola, me interesa conocer disponibilidad.",
    );

    await user.click(screen.getByRole("button", { name: /enviar por whatsapp/i }));

    await waitFor(() => {
      expect(mockRecordContactFormInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          customerName: "Ana García",
          customerPhone: "9991234567",
        }),
      );
    });
  });

  it("registra interaction_type=product_interest desde CTA de producto", async () => {
    const user = userEvent.setup();
    render(<WhatsAppCTA productName="Chocolate Belga 1kg" isAvailable />);

    const ctaLink = screen.getByRole("link", { name: /pide chocolate belga 1kg/i });
    ctaLink.addEventListener("click", (event) => event.preventDefault());
    await user.click(ctaLink);

    expect(mockRecordProductInterestInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        productName: "Chocolate Belga 1kg",
      }),
    );
  });

  it("mantiene flujo recuperable cuando falla persistencia de contact_form", async () => {
    mockRecordContactFormInteraction.mockRejectedValueOnce(new Error("db down"));

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/nombre/i), "Ana García");
    await user.type(screen.getByLabelText(/teléfono/i), "9991234567");
    await user.type(screen.getByLabelText(/mensaje/i), "Hola, quiero información.");

    await user.click(screen.getByRole("button", { name: /enviar por whatsapp/i }));

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining("wa.me"),
        "_blank",
        "noopener,noreferrer",
      );
    });
  });
});
