import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SearchableProductCatalog } from "@/components/storefront/SearchableProductCatalog";
import type { Product, CategoryWithProductCount } from "@/types/database";

const mockSearchProducts = vi.fn();
vi.mock("@/lib/supabase/queries/search", () => ({
  searchProducts: (...args: unknown[]) => mockSearchProducts(...args),
}));

const categories: CategoryWithProductCount[] = [
  {
    id: "c1",
    name: "Chocolates",
    slug: "chocolates",
    description: "Cobertura y chocolate",
    image_url: null,
    display_order: 1,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    product_count: 5,
  },
  {
    id: "c2",
    name: "Moldes",
    slug: "moldes",
    description: "Moldes de silicón y metal",
    image_url: null,
    display_order: 2,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    product_count: 8,
  },
];

function makeProduct(
  overrides: Partial<Product> & { id: string; name: string }
): Product {
  return {
    category_id: "c1",
    slug: overrides.name.toLowerCase().replace(/\s+/g, "-"),
    description: null,
    price: 100,
    image_url: null,
    sku: null,
    is_available: true,
    is_featured: false,
    is_seasonal: false,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("HU-1.6 — Filtros avanzados de precio y toggle de disponibilidad", () => {
  beforeEach(() => {
    mockSearchProducts.mockReset();
    mockSearchProducts.mockResolvedValue([
      makeProduct({ id: "p1", name: "Chocolate Belga", price: 820 }),
    ]);
    window.history.replaceState(null, "", "/categorias");
  });

  it("aplica modo Desde con precio mínimo y consulta con priceMin", async () => {
    render(<SearchableProductCatalog categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: "Desde" }));
    const priceInput = screen.getByLabelText("Precio mínimo");
    expect(priceInput.getAttribute("style")).toContain("scaleX(-1)");
    fireEvent.change(priceInput, {
      target: { value: "750" },
    });

    await flushEffects();

    expect(mockSearchProducts).toHaveBeenCalled();
    expect(mockSearchProducts).toHaveBeenLastCalledWith({
      query: undefined,
      categoryId: null,
      priceMin: 750,
      priceMax: null,
      availableOnly: false,
    });
  });

  it("aplica modo Hasta con precio máximo y consulta con priceMax", async () => {
    render(<SearchableProductCatalog categories={categories} />);

    fireEvent.change(screen.getByLabelText("Precio máximo"), {
      target: { value: "750" },
    });

    await flushEffects();

    expect(mockSearchProducts).toHaveBeenCalled();
    expect(mockSearchProducts).toHaveBeenLastCalledWith({
      query: undefined,
      categoryId: null,
      priceMin: null,
      priceMax: 750,
      availableOnly: false,
    });
  });

  it("toggle Solo en stock cambia estado visual y filtro", async () => {
    render(<SearchableProductCatalog categories={categories} />);

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    await flushEffects();

    expect(toggle).toHaveAttribute("aria-checked", "true");
    const thumb = toggle.querySelector("span span");
    expect(thumb).not.toBeNull();
    expect(thumb?.getAttribute("style")).toContain("translateX(16px)");

    expect(mockSearchProducts).toHaveBeenCalled();
    expect(mockSearchProducts).toHaveBeenLastCalledWith({
      query: undefined,
      categoryId: null,
      priceMin: null,
      priceMax: null,
      availableOnly: true,
    });
  });

  it("serializa filtros en URL y restaura estado inicial desde props", async () => {
    render(
      <SearchableProductCatalog
        categories={categories}
        initialFilters={{
          query: "chocolate",
          categoryId: "c1",
          priceMode: "min",
          price: 750,
          inStock: true,
        }}
      />
    );

    await flushEffects();

    expect(mockSearchProducts).toHaveBeenCalledWith({
      query: "chocolate",
      categoryId: "c1",
      priceMin: 750,
      priceMax: null,
      availableOnly: true,
    });

    expect(window.location.search).toContain("q=chocolate");
    expect(window.location.search).toContain("category=c1");
    expect(window.location.search).toContain("mode=min");
    expect(window.location.search).toContain("price=750");
    expect(window.location.search).toContain("inStock=1");
  });

  it("maneja valores iniciales inválidos con fallback seguro", async () => {
    render(
      <SearchableProductCatalog
        categories={categories}
        initialFilters={{
          priceMode: "max",
          price: 99999,
          inStock: false,
        }}
      />
    );

    await flushEffects();

    expect(screen.getByLabelText("Precio máximo")).toBeInTheDocument();
    expect(screen.getAllByText("Chocolates").length).toBeGreaterThan(0);
    expect(mockSearchProducts).not.toHaveBeenCalled();
  });
});
