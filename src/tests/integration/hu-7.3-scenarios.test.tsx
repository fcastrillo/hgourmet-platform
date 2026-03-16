import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrandSection } from "@/components/storefront/BrandSection";
import { SearchableProductCatalog } from "@/components/storefront/SearchableProductCatalog";
import type { CategoryWithProductCount } from "@/types/database";
import * as ga from "@/lib/analytics/ga";

const mockSearchProducts = vi.fn();
vi.mock("@/lib/supabase/queries/search", () => ({
  searchProducts: (...args: unknown[]) => mockSearchProducts(...args),
}));

const categories: CategoryWithProductCount[] = [
  {
    id: "cat-1",
    name: "Chocolates",
    slug: "chocolates",
    description: "Cobertura y chocolate",
    image_url: null,
    display_order: 1,
    is_active: true,
    created_at: "2026-03-16T00:00:00.000Z",
    product_count: 10,
  },
];

describe("HU-7.3 — Navegación por marca con búsqueda automática en catálogo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockSearchProducts.mockReset();
  });

  it("navega a /categorias?q=<marca> en la misma pestaña al hacer clic en una marca", () => {
    render(
      <BrandSection
        brands={[
          {
            id: "brand-1",
            name: "Hersheys",
            logo_url: "https://cdn.test/hersheys.png",
            website_url: "https://www.hersheys.com",
            display_order: 1,
            is_active: true,
            created_at: "2026-03-16T00:00:00.000Z",
          },
        ]}
      />,
    );

    const brandLink = screen.getByRole("link", {
      name: /ver productos de la marca hersheys/i,
    });

    expect(brandLink).toHaveAttribute("href", "/categorias?q=Hersheys");
    expect(brandLink).not.toHaveAttribute("target");
    expect(brandLink).not.toHaveAttribute("rel");
  });

  it("codifica correctamente nombres de marca con espacios y caracteres especiales", () => {
    render(
      <BrandSection
        brands={[
          {
            id: "brand-2",
            name: "Nestlé México",
            logo_url: "https://cdn.test/nestle.png",
            website_url: null,
            display_order: 2,
            is_active: true,
            created_at: "2026-03-16T00:00:00.000Z",
          },
        ]}
      />,
    );

    const brandLink = screen.getByRole("link", {
      name: /ver productos de la marca nestlé méxico/i,
    });
    expect(brandLink).toHaveAttribute(
      "href",
      "/categorias?q=Nestl%C3%A9%20M%C3%A9xico",
    );
  });

  it("muestra estado vacío sin error cuando la marca no tiene coincidencias en catálogo", async () => {
    mockSearchProducts.mockResolvedValue([]);

    render(
      <SearchableProductCatalog
        categories={categories}
        initialFilters={{ query: "Marca Sin Productos" }}
      />,
    );

    await waitFor(() => {
      expect(mockSearchProducts).toHaveBeenCalledWith({
        query: "Marca Sin Productos",
        categoryId: null,
        priceMin: null,
        priceMax: null,
        availableOnly: false,
      });
    });

    expect(screen.getByText(/no encontramos productos/i)).toBeInTheDocument();
    expect(screen.getByText(/marca sin productos/i)).toBeInTheDocument();
  });

  it("mantiene tracking brand_click al interactuar con la marca", async () => {
    const trackEventSpy = vi
      .spyOn(ga, "trackEvent")
      .mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(
      <BrandSection
        brands={[
          {
            id: "brand-3",
            name: "Wilton",
            logo_url: "https://cdn.test/wilton.png",
            website_url: "https://www.wilton.com",
            display_order: 3,
            is_active: true,
            created_at: "2026-03-16T00:00:00.000Z",
          },
        ]}
      />,
    );

    await user.click(
      screen.getByRole("link", {
        name: /ver productos de la marca wilton/i,
      }),
    );

    expect(trackEventSpy).toHaveBeenCalledWith(
      "brand_click",
      expect.objectContaining({
        brand_name: "Wilton",
        location: "homepage_brand_section",
      }),
    );
  });
});
