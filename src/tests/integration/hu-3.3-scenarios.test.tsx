import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/storefront/ContactForm";
import ContactoPage from "@/app/(storefront)/contacto/page";
import { SOCIAL_LINKS, STORE_INFO } from "@/lib/constants";

// ============================================================
// HU-3.3 — Página de contacto
// NOTE: ContactForm evolved in HU-3.4 — phone is now required,
// email is optional, and submit opens WhatsApp (not a placeholder).
// Tests that relied on the old behavior are updated accordingly.
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

describe("HU-3.3 — Página de contacto", () => {
  // ──────────────────────────────────────────────────────────
  // Escenario 1: Contacto completo visible
  // ──────────────────────────────────────────────────────────
  describe("Escenario 1: Contacto completo visible", () => {
    it("muestra el encabezado 'Contáctanos'", () => {
      render(<ContactoPage />);
      expect(
        screen.getByRole("heading", { name: /contáctanos/i, level: 1 }),
      ).toBeInTheDocument();
    });

    it("muestra la dirección física de la tienda", () => {
      render(<ContactoPage />);
      const matches = screen.getAllByText(STORE_INFO.address);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("muestra el teléfono como enlace tel:", () => {
      render(<ContactoPage />);
      const link = screen.getByRole("link", { name: STORE_INFO.phone });
      expect(link).toHaveAttribute("href", `tel:${STORE_INFO.phone}`);
    });

    it("muestra el email como enlace mailto:", () => {
      render(<ContactoPage />);
      const link = screen.getByRole("link", { name: STORE_INFO.email });
      expect(link).toHaveAttribute("href", `mailto:${STORE_INFO.email}`);
    });

    it("muestra el horario de atención", () => {
      render(<ContactoPage />);
      expect(screen.getByText(STORE_INFO.hours)).toBeInTheDocument();
    });

    it("muestra el bloque del mapa de ubicación", () => {
      render(<ContactoPage />);
      expect(screen.getByText("Mapa de ubicación")).toBeInTheDocument();
    });

    it("muestra el botón de WhatsApp con enlace correcto", () => {
      render(<ContactoPage />);
      const wa = screen.getByRole("link", {
        name: /contactar por whatsapp/i,
      });
      expect(wa).toHaveAttribute("href", SOCIAL_LINKS.whatsapp);
      expect(wa).toHaveAttribute("target", "_blank");
      expect(wa).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("muestra el botón de Facebook con enlace seguro", () => {
      render(<ContactoPage />);
      const fb = screen.getByRole("link", {
        name: /visitar facebook/i,
      });
      expect(fb).toHaveAttribute("href", SOCIAL_LINKS.facebook);
      expect(fb).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("muestra el botón de Instagram con enlace seguro", () => {
      render(<ContactoPage />);
      const ig = screen.getByRole("link", {
        name: /visitar instagram/i,
      });
      expect(ig).toHaveAttribute("href", SOCIAL_LINKS.instagram);
      expect(ig).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  // ──────────────────────────────────────────────────────────
  // Escenario 2: Envío exitoso del formulario
  // Updated for HU-3.4: form now requires phone, email is
  // optional, button is "Enviar por WhatsApp", success state
  // shows "¡Abrimos WhatsApp!" (honest, not placeholder).
  // ──────────────────────────────────────────────────────────
  describe("Escenario 2: Envío exitoso del formulario", () => {
    it("muestra confirmación de apertura tras enviar datos válidos", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "Ana García");
      await user.type(screen.getByLabelText(/teléfono/i), "9991234567");
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Hola, necesito información sobre sus productos.",
      );
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        await screen.findByText(/abrimos whatsapp/i),
      ).toBeInTheDocument();
    });

    it("mantiene la UI estable sin recarga (formulario se reemplaza por confirmación)", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "Pedro López");
      await user.type(screen.getByLabelText(/teléfono/i), "9990000000");
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Mensaje de prueba.",
      );
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.queryByRole("button", { name: /enviar por whatsapp/i }),
      ).not.toBeInTheDocument();
    });

    it("el estado de confirmación usa role=status para accesibilidad", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "María");
      await user.type(screen.getByLabelText(/teléfono/i), "9991111111");
      await user.type(screen.getByLabelText(/mensaje/i), "Consulta.");
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(await screen.findByRole("status")).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────
  // Escenario 3: Paridad visual / estructura de la página
  // ──────────────────────────────────────────────────────────
  describe("Escenario 3: Paridad visual / estructura de la página", () => {
    it("renderiza el encabezado H1 'Contáctanos'", () => {
      render(<ContactoPage />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent(/contáctanos/i);
    });

    it("renderiza el encabezado del formulario 'Envíanos un mensaje'", () => {
      render(<ContactoPage />);
      expect(
        screen.getByRole("heading", { name: /envíanos un mensaje/i }),
      ).toBeInTheDocument();
    });

    it("la lista de info de contacto tiene etiqueta accesible", () => {
      render(<ContactoPage />);
      expect(
        screen.getByRole("list", { name: /información de contacto/i }),
      ).toBeInTheDocument();
    });

    it("muestra las cuatro etiquetas de info: Dirección, Teléfono, Email, Horario", () => {
      render(<ContactoPage />);
      const infoList = screen.getByRole("list", {
        name: /información de contacto/i,
      });
      expect(infoList).toHaveTextContent("Dirección");
      expect(infoList).toHaveTextContent("Teléfono");
      expect(infoList).toHaveTextContent("Email");
      expect(infoList).toHaveTextContent("Horario");
    });
  });

  // ──────────────────────────────────────────────────────────
  // Escenario 4: Bloqueo por validación inválida
  // Updated for HU-3.4: phone required, email optional.
  // ──────────────────────────────────────────────────────────
  describe("Escenario 4: Bloqueo por validación inválida", () => {
    it("muestra error de nombre cuando el formulario se envía vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.getByText(/nombre es obligatorio/i),
      ).toBeInTheDocument();
    });

    it("muestra error de teléfono cuando el formulario se envía vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.getByText(/teléfono es obligatorio/i),
      ).toBeInTheDocument();
    });

    it("muestra error de mensaje cuando el formulario se envía vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(
        screen.getByText(/mensaje es obligatorio/i),
      ).toBeInTheDocument();
    });

    it("muestra error de formato inválido para email mal formado", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "Ana");
      await user.type(screen.getByLabelText(/teléfono/i), "9991234567");
      await user.type(screen.getByLabelText(/email/i), "no-es-un-email");
      await user.type(screen.getByLabelText(/mensaje/i), "Hola.");
      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(screen.getByText(/formato válido/i)).toBeInTheDocument();
    });

    it("no abre WhatsApp cuando la validación falla", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("los mensajes de error usan role=alert para accesibilidad", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(
        screen.getByRole("button", { name: /enviar por whatsapp/i }),
      );

      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThanOrEqual(3);
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
  });
});
