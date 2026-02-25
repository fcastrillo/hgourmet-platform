import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/storefront/ContactForm";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";

// ============================================================
// HU-3.4 — Formulario de contacto con envío real vía WhatsApp
// ============================================================

const mockOpen = vi.fn();

beforeEach(() => {
  vi.stubGlobal("open", mockOpen);
  mockOpen.mockReturnValue({ focus: vi.fn() });
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockOpen.mockReset();
});

async function fillValidForm(
  user: ReturnType<typeof userEvent.setup>,
  opts: {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    skipEmail?: boolean;
  } = {},
) {
  const {
    name = "Ana García",
    phone = "9991234567",
    email,
    message = "Hola, necesito información del catálogo.",
    skipEmail = false,
  } = opts;

  await user.type(screen.getByLabelText(/nombre/i), name);
  await user.type(screen.getByLabelText(/teléfono/i), phone);
  if (!skipEmail && email !== undefined) {
    await user.type(screen.getByLabelText(/email/i), email);
  }
  await user.type(screen.getByLabelText(/mensaje/i), message);
}

describe("HU-3.4 — Formulario de contacto con envío real vía WhatsApp", () => {
  // ──────────────────────────────────────────────────────────────
  // Escenario 1: Envío real con mensaje prellenado
  // Dado que la persona completa nombre, teléfono, mensaje (email opcional),
  // Cuando hace clic en "Enviar por WhatsApp",
  // Entonces se abre un deep link wa.me con el mensaje prellenado.
  // ──────────────────────────────────────────────────────────────
  describe("Escenario 1: Envío real con mensaje prellenado", () => {
    it("llama a window.open con una URL que contiene wa.me/{WHATSAPP_NUMBER}", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining(`wa.me/${WHATSAPP_NUMBER}`),
        "_blank",
        "noopener,noreferrer",
      );
    });

    it("la URL contiene el nombre del remitente codificado", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { name: "María José", skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      const [[calledUrl]] = mockOpen.mock.calls;
      expect(calledUrl).toContain(encodeURIComponent("María José"));
    });

    it("la URL contiene el teléfono en el mensaje", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { phone: "9991234567", skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      const [[calledUrl]] = mockOpen.mock.calls;
      expect(calledUrl).toContain(encodeURIComponent("9991234567"));
    });

    it("la URL contiene el contenido del mensaje codificado", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, {
        message: "Quiero pedir moldes y chocolates.",
        skipEmail: true,
      });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      const [[calledUrl]] = mockOpen.mock.calls;
      expect(calledUrl).toContain(
        encodeURIComponent("Quiero pedir moldes y chocolates."),
      );
    });

    it("muestra confirmación de apertura (no 'mensaje enviado' falso)", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        await screen.findByText(/abrimos whatsapp/i),
      ).toBeInTheDocument();
    });

    it("no muestra el formulario después de apertura exitosa", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.queryByRole("button", { name: /enviar por whatsapp/i }),
      ).not.toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Escenario 2: Validación de campos requeridos
  // Dado que falta al menos un campo requerido,
  // Cuando intenta enviar,
  // Entonces el sistema bloquea el envío con mensajes claros.
  // ──────────────────────────────────────────────────────────────
  describe("Escenario 2: Validación de campos requeridos", () => {
    it("muestra error de nombre cuando está vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.getByText(/nombre es obligatorio/i),
      ).toBeInTheDocument();
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("muestra error de teléfono cuando está vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.getByText(/teléfono es obligatorio/i),
      ).toBeInTheDocument();
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("muestra error de mensaje cuando está vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.getByText(/mensaje es obligatorio/i),
      ).toBeInTheDocument();
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("permite enviar con email vacío (email es opcional)", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(mockOpen).toHaveBeenCalled();
    });

    it("bloquea el envío si el email tiene formato inválido", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { email: "no-es-un-email" });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(screen.getByText(/formato válido/i)).toBeInTheDocument();
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("los campos inválidos tienen aria-invalid=true", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(screen.getByLabelText(/nombre/i)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText(/teléfono/i)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText(/mensaje/i)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("los mensajes de error usan role=alert (accesibilidad)", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Escenario 3: Encoding seguro del mensaje
  // (unidad — prueba directa de buildContactWhatsAppUrl)
  // ──────────────────────────────────────────────────────────────
  describe("Escenario 3: Encoding seguro del mensaje", () => {
    it("codifica acentos y caracteres especiales", () => {
      const url = buildContactWhatsAppUrl({
        name: "María José",
        phone: "5551234567",
        message: "Quiero pedir: moldes ¿disponible?",
      });

      expect(url).toContain(`wa.me/${WHATSAPP_NUMBER}`);
      expect(url).not.toMatch(/María(?!%)/);
      expect(url).toContain(encodeURIComponent("María José"));
      expect(url).toContain(encodeURIComponent("¿disponible?"));
    });

    it("codifica correctamente saltos de línea", () => {
      const url = buildContactWhatsAppUrl({
        name: "Pedro",
        phone: "5550001111",
        message: "Línea 1\nLínea 2",
      });

      expect(url).toContain(encodeURIComponent("Línea 1\nLínea 2"));
    });

    it("incluye el email en el mensaje cuando se provee", () => {
      const url = buildContactWhatsAppUrl({
        name: "Ana",
        phone: "5550000000",
        email: "ana@test.com",
        message: "Hola.",
      });

      expect(url).toContain(encodeURIComponent("ana@test.com"));
    });

    it("omite la línea de email cuando no se provee", () => {
      const url = buildContactWhatsAppUrl({
        name: "Ana",
        phone: "5550000000",
        message: "Hola.",
      });

      expect(url).not.toContain(encodeURIComponent("Email:"));
    });

    it("la URL generada comienza con https://wa.me/", () => {
      const url = buildContactWhatsAppUrl({
        name: "Test",
        phone: "1234567890",
        message: "Test.",
      });

      expect(url).toMatch(/^https:\/\/wa\.me\//);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Escenario 4: Cancelación o error al abrir WhatsApp
  // Dado que window.open retorna null (bloqueado),
  // Cuando finaliza el intento de envío,
  // Entonces no se muestra éxito y se ofrece enlace directo.
  // ──────────────────────────────────────────────────────────────
  describe("Escenario 4: Cancelación o error al abrir WhatsApp", () => {
    it("no muestra confirmación de éxito cuando window.open retorna null", async () => {
      mockOpen.mockReturnValue(null);
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(screen.queryByText(/abrimos whatsapp/i)).not.toBeInTheDocument();
    });

    it("muestra un alert de error cuando WhatsApp está bloqueado", async () => {
      mockOpen.mockReturnValue(null);
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("ofrece un enlace directo de fallback con la URL wa.me cuando está bloqueado", async () => {
      mockOpen.mockReturnValue(null);
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      const fallback = screen.getByRole("link", {
        name: /abrir el enlace directamente/i,
      });
      expect(fallback).toHaveAttribute(
        "href",
        expect.stringContaining(`wa.me/${WHATSAPP_NUMBER}`),
      );
    });

    it("mantiene el formulario y el botón de envío visibles para reintentar", async () => {
      mockOpen.mockReturnValue(null);
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      ).toBeInTheDocument();
    });

    it("el estado de éxito usa role=status (accesibilidad) cuando se abre correctamente", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user, { skipEmail: true });
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(await screen.findByRole("status")).toBeInTheDocument();
    });
  });
});
