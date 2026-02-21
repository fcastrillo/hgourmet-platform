import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

const mockCategories = [
  { id: "1", name: "Chocolate", slug: "chocolate", description: null, display_order: 1, is_active: true, created_at: "" },
  { id: "2", name: "Harinas", slug: "harinas", description: null, display_order: 2, is_active: true, created_at: "" },
  { id: "3", name: "Moldes", slug: "moldes", description: null, display_order: 3, is_active: true, created_at: "" },
];

describe("Storefront Header", () => {
  it("renders the store name", () => {
    render(<Header categories={mockCategories} />);
    expect(screen.getByText("HGourmet")).toBeInTheDocument();
  });

  it("renders category navigation links for all active categories", () => {
    render(<Header categories={mockCategories} />);
    const desktopNav = screen.getByRole("navigation", { name: /categorías/i });
    expect(within(desktopNav).getByRole("link", { name: /chocolate/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: /harinas/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: /moldes/i })).toBeInTheDocument();
  });

  it("links categories to /categorias/[slug]", () => {
    render(<Header categories={mockCategories} />);
    const desktopNav = screen.getByRole("navigation", { name: /categorías/i });
    const chocolateLink = within(desktopNav).getByRole("link", { name: /chocolate/i });
    expect(chocolateLink).toHaveAttribute("href", "/categorias/chocolate");
  });

  it("does not render inactive categories", () => {
    const categoriesWithInactive = [
      ...mockCategories,
      { id: "4", name: "Temporada Navideña", slug: "temporada-navidena", description: null, display_order: 6, is_active: false, created_at: "" },
    ];
    const activeOnly = categoriesWithInactive.filter(c => c.is_active);
    render(<Header categories={activeOnly} />);
    const desktopNav = screen.getByRole("navigation", { name: /categorías/i });
    expect(within(desktopNav).queryByRole("link", { name: /temporada navideña/i })).not.toBeInTheDocument();
  });
});

describe("Storefront Footer", () => {
  it("renders the store name and tagline", () => {
    render(<Footer />);
    expect(screen.getByText("HGourmet")).toBeInTheDocument();
    expect(screen.getByText(/insumos gourmet/i)).toBeInTheDocument();
  });

  it("renders social media links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
  });
});
