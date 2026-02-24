import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import type { CategoryWithProductCount } from "@/types/database";

const mockCategories: CategoryWithProductCount[] = [
  {
    id: "1",
    name: "Chocolate",
    slug: "chocolate",
    description: "Los mejores chocolates",
    image_url: null,
    display_order: 1,
    is_active: true,
    created_at: "",
    product_count: 5,
  },
  {
    id: "2",
    name: "Harinas",
    slug: "harinas",
    description: "Harinas especiales",
    image_url: null,
    display_order: 2,
    is_active: true,
    created_at: "",
    product_count: 3,
  },
  {
    id: "3",
    name: "Moldes",
    slug: "moldes",
    description: "Moldes para repostería",
    image_url: null,
    display_order: 3,
    is_active: true,
    created_at: "",
    product_count: 8,
  },
];

describe("CategoryCard", () => {
  it("renders category name and product count", () => {
    render(<CategoryCard category={mockCategories[0]} />);
    expect(screen.getByText("Chocolate")).toBeInTheDocument();
    expect(screen.getByText(/5 productos/i)).toBeInTheDocument();
  });

  it("links to the category detail page", () => {
    render(<CategoryCard category={mockCategories[0]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categorias/chocolate");
  });

  it("renders description when available", () => {
    render(<CategoryCard category={mockCategories[0]} />);
    expect(screen.getByText("Los mejores chocolates")).toBeInTheDocument();
  });

  it("uses singular 'producto' for count of 1", () => {
    const singleProduct: CategoryWithProductCount = {
      ...mockCategories[0],
      product_count: 1,
    };
    render(<CategoryCard category={singleProduct} />);
    expect(screen.getByText(/1 producto$/i)).toBeInTheDocument();
  });

  it("shows '0 productos' for empty categories", () => {
    const emptyCategory: CategoryWithProductCount = {
      ...mockCategories[0],
      product_count: 0,
    };
    render(<CategoryCard category={emptyCategory} />);
    expect(screen.getByText(/0 productos/i)).toBeInTheDocument();
  });
});

describe("Categorías Page — BDD Scenario 1: Navegación exitosa por categoría", () => {
  it("shows all active categories with names and product counts", () => {
    render(
      <div>
        {mockCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>,
    );
    expect(screen.getByText("Chocolate")).toBeInTheDocument();
    expect(screen.getByText("Harinas")).toBeInTheDocument();
    expect(screen.getByText("Moldes")).toBeInTheDocument();
    expect(screen.getByText(/5 productos/i)).toBeInTheDocument();
    expect(screen.getByText(/3 productos/i)).toBeInTheDocument();
    expect(screen.getByText(/8 productos/i)).toBeInTheDocument();
  });

  it("renders categories in display_order (DOM order matches input order)", () => {
    render(
      <div data-testid="category-grid">
        {mockCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>,
    );
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/categorias/chocolate");
    expect(links[1]).toHaveAttribute("href", "/categorias/harinas");
    expect(links[2]).toHaveAttribute("href", "/categorias/moldes");
  });
});

describe("Categorías Page — BDD Scenario 5 (Partial): Categoría inactiva no visible", () => {
  it("does not render inactive categories when filtered at data layer", () => {
    const categoriesWithInactive: CategoryWithProductCount[] = [
      ...mockCategories,
      {
        id: "4",
        name: "Temporada Navideña",
        slug: "temporada-navidena",
        description: null,
        image_url: null,
        display_order: 4,
        is_active: false,
        created_at: "",
        product_count: 0,
      },
    ];
    const activeOnly = categoriesWithInactive.filter((c) => c.is_active);
    render(
      <div>
        {activeOnly.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>,
    );
    expect(screen.queryByText("Temporada Navideña")).not.toBeInTheDocument();
    expect(screen.getByText("Chocolate")).toBeInTheDocument();
  });
});
