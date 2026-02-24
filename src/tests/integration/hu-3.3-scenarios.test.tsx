import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/storefront/ContactForm";
import ContactoPage from "@/app/(storefront)/contacto/page";
import { SOCIAL_LINKS, STORE_INFO } from "@/lib/constants";

// ============================================================
// HU-3.3 — Página de contacto
// ============================================================

describe("HU-3.3 — Página de contacto", () => {
  // ──────────────────────────────────────────────────────────
  // Escenario 1: Contacto completo visible
  // Dado que una persona entra a /contacto,
  // Cuando la página termina de cargar,
  // Entonces debe visualizar información de contacto completa.
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
      // The address appears both in the info list and the map placeholder
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
  // Dado que la persona completa nombre, email y mensaje válidos,
  // Cuando presiona "Enviar mensaje",
  // Entonces debe mostrarse confirmación de envío placeholder.
  // ──────────────────────────────────────────────────────────
  describe("Escenario 2: Envío exitoso del formulario", () => {
    it("muestra el estado de éxito tras enviar datos válidos", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "Ana García");
      await user.type(
        screen.getByLabelText(/email/i),
        "ana@example.com",
      );
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Hola, necesito información sobre sus productos.",
      );
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(
        await screen.findByText(/mensaje enviado/i),
      ).toBeInTheDocument();
    });

    it("mantiene la UI estable sin recarga (el formulario se reemplaza por confirmación)", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "Pedro López");
      await user.type(
        screen.getByLabelText(/email/i),
        "pedro@example.com",
      );
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Mensaje de prueba.",
      );
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(
        screen.queryByRole("button", { name: /enviar mensaje/i }),
      ).not.toBeInTheDocument();
    });

    it("el mensaje de éxito usa role=status para accesibilidad", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "María");
      await user.type(screen.getByLabelText(/email/i), "maria@test.com");
      await user.type(screen.getByLabelText(/mensaje/i), "Consulta.");
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(await screen.findByRole("status")).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────
  // Escenario 3: Paridad visual con prototipo
  // Dado que el prototipo define la referencia visual,
  // Cuando se valida la implementación,
  // Entonces debe respetarse la jerarquía tipográfica.
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
      // "Email" also appears as a form label — scope to the info list
      expect(infoList).toHaveTextContent("Dirección");
      expect(infoList).toHaveTextContent("Teléfono");
      expect(infoList).toHaveTextContent("Email");
      expect(infoList).toHaveTextContent("Horario");
    });
  });

  // ──────────────────────────────────────────────────────────
  // Escenario 4: Bloqueo por validación inválida
  // Dado que hay campos vacíos o email inválido,
  // Cuando la persona intenta enviar,
  // Entonces el sistema impide el envío y muestra errores.
  // ──────────────────────────────────────────────────────────
  describe("Escenario 4: Bloqueo por validación inválida", () => {
    it("muestra error de nombre cuando el formulario se envía vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(
        screen.getByText(/nombre es obligatorio/i),
      ).toBeInTheDocument();
    });

    it("muestra error de email cuando el formulario se envía vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(
        screen.getByText(/email es obligatorio/i),
      ).toBeInTheDocument();
    });

    it("muestra error de mensaje cuando el formulario se envía vacío", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(
        screen.getByText(/mensaje es obligatorio/i),
      ).toBeInTheDocument();
    });

    it("muestra error de formato inválido para email mal formado", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/nombre/i), "Ana");
      await user.type(screen.getByLabelText(/email/i), "no-es-un-email");
      await user.type(screen.getByLabelText(/mensaje/i), "Hola.");
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(screen.getByText(/formato válido/i)).toBeInTheDocument();
    });

    it("no muestra el estado de éxito cuando la validación falla", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(screen.queryByText(/mensaje enviado/i)).not.toBeInTheDocument();
    });

    it("los mensajes de error usan role=alert para accesibilidad", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThanOrEqual(3);
    });

    it("los campos inválidos tienen aria-invalid=true", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      expect(screen.getByLabelText(/nombre/i)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText(/email/i)).toHaveAttribute(
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
