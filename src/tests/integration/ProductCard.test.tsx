import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { Product } from "@/types/database";

const baseProduct: Product = {
  id: "1",
  category_id: "cat-1",
  name: "Chocolate Belga 1kg",
  slug: "chocolate-belga-1kg",
  description: "Cobertura de chocolate belga semi-amargo 54% cacao.",
  price: 350.0,
  image_url: "https://example.supabase.co/storage/v1/object/public/product-images/chocolate.jpg",
  sku: "CHOC-001",
  is_available: true,
  is_featured: true,
  is_seasonal: false,
  is_visible: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("ProductCard", () => {
  it("renders product name, price formatted as MXN, and image", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Chocolate Belga 1kg")).toBeInTheDocument();
    expect(screen.getByText("$350.00")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /chocolate belga/i })).toBeInTheDocument();
  });

  it("shows 'Disponible' indicator for available products", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(screen.queryByText("Agotado")).not.toBeInTheDocument();
  });

  it("shows 'Agotado' badge for unavailable products with distinct styling", () => {
    const unavailableProduct: Product = { ...baseProduct, is_available: false };
    render(<ProductCard product={unavailableProduct} />);
    const badges = screen.getAllByText("Agotado");
    expect(badges.length).toBeGreaterThanOrEqual(1);
    const overlayBadge = badges.find((el) => el.className.includes("bg-error"));
    expect(overlayBadge).toBeDefined();
  });

  it("renders a placeholder when image_url is null", () => {
    const noImageProduct: Product = { ...baseProduct, image_url: null };
    render(<ProductCard product={noImageProduct} />);
    expect(screen.getByText("Chocolate Belga 1kg")).toBeInTheDocument();
    expect(screen.getByText("Sin imagen")).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={baseProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/productos/chocolate-belga-1kg");
  });
});
