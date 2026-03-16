import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/storefront/SearchBar";
import { WhatsAppCTA } from "@/components/storefront/WhatsAppCTA";
import { WhatsAppFloatingButton } from "@/components/storefront/WhatsAppFloatingButton";
import { BrandSection } from "@/components/storefront/BrandSection";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import * as ga from "@/lib/analytics/ga";

let mockPathname = "/";
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe("HU-7.1 — Integrar Google Analytics para tracking del storefront", () => {
  beforeEach(() => {
    mockPathname = "/";
    mockSearchParams = new URLSearchParams();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Escenario 1: page_view en navegación", () => {
    it("resuelve measurement ID por host (prod/demo/fallback)", () => {
      expect(
        ga.resolveGaMeasurementId("www.hgourmet.com.mx", {
          productionId: "G-PROD",
          demoId: "G-DEMO",
        }),
      ).toBe("G-PROD");

      expect(
        ga.resolveGaMeasurementId("demo.hgourmet.com.mx", {
          productionId: "G-PROD",
          demoId: "G-DEMO",
        }),
      ).toBe("G-DEMO");

      expect(
        ga.resolveGaMeasurementId("staging.hgourmet.com.mx", {
          productionId: "G-PROD",
          demoId: "G-DEMO",
          fallbackId: "G-FALLBACK",
        }),
      ).toBe("G-FALLBACK");
    });

    it("dispara trackPageView al cambiar ruta y query", () => {
      const trackPageViewSpy = vi
        .spyOn(ga, "trackPageView")
        .mockImplementation(() => undefined);

      const { rerender } = render(<PageViewTracker />);

      expect(trackPageViewSpy).toHaveBeenCalledWith("/");

      mockPathname = "/categorias";
      mockSearchParams = new URLSearchParams("q=hersheys");
      rerender(<PageViewTracker />);

      expect(trackPageViewSpy).toHaveBeenCalledWith("/categorias?q=hersheys");
    });
  });

  describe("Escenario 2: eventos de interacción clave", () => {
    it("registra evento search al escribir en el buscador", async () => {
      const trackEventSpy = vi
        .spyOn(ga, "trackEvent")
        .mockImplementation(() => undefined);

      const user = userEvent.setup();
      render(<SearchBar onSearch={() => undefined} />);

      await user.type(screen.getByLabelText(/buscar productos/i), "chocolate");

      await waitFor(() => {
        expect(trackEventSpy).toHaveBeenCalledWith(
          "search",
          expect.objectContaining({
            search_term: "chocolate",
            location: "catalog_search_bar",
          }),
        );
      });
    });

    it("registra evento whatsapp_click desde CTA de producto", async () => {
      const trackEventSpy = vi
        .spyOn(ga, "trackEvent")
        .mockImplementation(() => undefined);

      const user = userEvent.setup();
      render(<WhatsAppCTA productName="Chocolate Hersheys" isAvailable />);

      await user.click(screen.getByRole("link", { name: /pide chocolate hersheys/i }));

      expect(trackEventSpy).toHaveBeenCalledWith(
        "whatsapp_click",
        expect.objectContaining({
          location: "product_detail_cta",
          product_name: "Chocolate Hersheys",
        }),
      );
    });

    it("registra evento whatsapp_click desde botón flotante", async () => {
      const trackEventSpy = vi
        .spyOn(ga, "trackEvent")
        .mockImplementation(() => undefined);
      const user = userEvent.setup();

      render(<WhatsAppFloatingButton whatsappUrl="https://wa.me/529991978260" />);
      await user.click(screen.getByRole("link", { name: /contactar por whatsapp/i }));

      expect(trackEventSpy).toHaveBeenCalledWith(
        "whatsapp_click",
        expect.objectContaining({ location: "floating_button" }),
      );
    });

    it("registra evento brand_click al abrir marca", async () => {
      const trackEventSpy = vi
        .spyOn(ga, "trackEvent")
        .mockImplementation(() => undefined);
      const user = userEvent.setup();

      render(
        <BrandSection
          brands={[
            {
              id: "brand-1",
              name: "Hersheys",
              logo_url: "https://cdn.test/logo.png",
              website_url: "https://www.hersheys.com",
              display_order: 1,
              is_active: true,
              created_at: "2026-03-16T00:00:00.000Z",
            },
          ]}
        />,
      );

      await user.click(screen.getByRole("link", { name: /hersheys/i }));

      expect(trackEventSpy).toHaveBeenCalledWith(
        "brand_click",
        expect.objectContaining({
          brand_name: "Hersheys",
          location: "homepage_brand_section",
        }),
      );
    });
  });

  describe("Escenario 3: degradación controlada sin config", () => {
    it("no lanza error si gtag no existe al intentar trackear", () => {
      const previousGtag = window.gtag;
      window.gtag = undefined;

      expect(() => ga.trackEvent("search", { search_term: "test" })).not.toThrow();

      window.gtag = previousGtag;
    });
  });
});

