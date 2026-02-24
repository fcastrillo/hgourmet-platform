import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppFloatingButton } from "@/components/storefront/WhatsAppFloatingButton";

const VALID_URL = "https://wa.me/525550682072";

describe("WhatsAppFloatingButton — HU-3.1", () => {
  // Escenario 1 + 2: Presencia global y apertura de enlace oficial
  describe("Escenario 1 y 2: presencia y enlace correcto", () => {
    it("renders a link with the correct wa.me href when URL is valid", () => {
      render(<WhatsAppFloatingButton whatsappUrl={VALID_URL} />);
      const link = screen.getByRole("link", { name: /contactar por whatsapp/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", VALID_URL);
    });

    it("opens in a new tab (target=_blank) with noopener noreferrer", () => {
      render(<WhatsAppFloatingButton whatsappUrl={VALID_URL} />);
      const link = screen.getByRole("link", { name: /contactar por whatsapp/i });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("uses default SOCIAL_LINKS.whatsapp when no prop is passed", () => {
      render(<WhatsAppFloatingButton />);
      const link = screen.getByRole("link", { name: /contactar por whatsapp/i });
      expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/"));
    });
  });

  // Escenario 3: Paridad visual — estructura y accesibilidad
  describe("Escenario 3: paridad visual y accesibilidad", () => {
    it("has the correct aria-label for accessibility", () => {
      render(<WhatsAppFloatingButton whatsappUrl={VALID_URL} />);
      expect(
        screen.getByRole("link", { name: /contactar por whatsapp/i }),
      ).toBeInTheDocument();
    });

    it("renders an SVG icon inside the link", () => {
      const { container } = render(<WhatsAppFloatingButton whatsappUrl={VALID_URL} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  // Escenario 4: Fallback seguro por URL inválida/vacía
  describe("Escenario 4: fallback seguro por configuración inválida", () => {
    it("renders nothing when whatsappUrl is an empty string", () => {
      const { container } = render(<WhatsAppFloatingButton whatsappUrl="" />);
      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when whatsappUrl does not start with https://wa.me/", () => {
      const { container } = render(
        <WhatsAppFloatingButton whatsappUrl="https://example.com" />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when whatsappUrl is undefined-like (empty override)", () => {
      const { container } = render(<WhatsAppFloatingButton whatsappUrl="   " />);
      expect(container).toBeEmptyDOMElement();
    });

    it("does not throw or render broken markup on invalid URL", () => {
      expect(() =>
        render(<WhatsAppFloatingButton whatsappUrl="" />),
      ).not.toThrow();
    });
  });
});
