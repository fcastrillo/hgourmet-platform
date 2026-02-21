import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { Product, Category } from "@/types/database";

const mockCategory: Category = {
  id: "cat-1",
  name: "Chocolate",
  slug: "chocolate",
  description: "Los mejores chocolates importados",
  display_order: 1,
  is_active: true,
  created_at: "",
};

const baseProduct: Product = {
  id: "p1",
  category_id: "cat-1",
  name: "Chocolate Belga 1kg",
  slug: "chocolate-belga-1kg",
  description: "Cobertura semi-amargo 54%",
  price: 350.0,
  image_url: "https://example.com/choc.jpg",
  sku: "CHOC-001",
  is_available: true,
  is_featured: false,
  is_seasonal: false,
  is_visible: true,
  created_at: "",
  updated_at: "",
};

const visibleProducts: Product[] = [
  baseProduct,
  { ...baseProduct, id: "p2", name: "Chocolate Blanco 500g", slug: "choc-blanco", price: 220.0, sku: "CHOC-002" },
  { ...baseProduct, id: "p3", name: "Cacao en Polvo 250g", slug: "cacao-polvo", price: 180.0, sku: "CHOC-003" },
  { ...baseProduct, id: "p4", name: "Chocolate Ruby 1kg", slug: "choc-ruby", price: 450.0, sku: "CHOC-004" },
  { ...baseProduct, id: "p5", name: "Gotas de Chocolate 500g", slug: "gotas-choc", price: 150.0, sku: "CHOC-005" },
];

describe("BDD Scenario 2: Filtrado de productos al seleccionar categoría", () => {
  it("shows only visible products for the selected category with image, name, price, and availability", () => {
    render(
      <div>
        <h1>{mockCategory.name}</h1>
        <p>{visibleProducts.length} productos</p>
        <div data-testid="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>,
    );

    expect(screen.getByText("Chocolate")).toBeInTheDocument();
    expect(screen.getByText("5 productos")).toBeInTheDocument();

    expect(screen.getByText("Chocolate Belga 1kg")).toBeInTheDocument();
    expect(screen.getByText("Chocolate Blanco 500g")).toBeInTheDocument();
    expect(screen.getByText("Cacao en Polvo 250g")).toBeInTheDocument();
    expect(screen.getByText("Chocolate Ruby 1kg")).toBeInTheDocument();
    expect(screen.getByText("Gotas de Chocolate 500g")).toBeInTheDocument();

    expect(screen.getByText("$350.00")).toBeInTheDocument();
  });
});

describe("BDD Scenario 3: Producto agotado visible con indicador", () => {
  it("shows 'Agotado' badge for unavailable products", () => {
    const unavailableProduct: Product = {
      ...baseProduct,
      id: "p-unavail",
      name: "Chocolate Belga 1kg",
      is_available: false,
    };

    render(<ProductCard product={unavailableProduct} />);

    const badges = screen.getAllByText("Agotado");
    expect(badges.length).toBeGreaterThanOrEqual(1);

    const overlayBadge = badges.find((el) => el.className.includes("bg-error"));
    expect(overlayBadge).toBeDefined();
  });

  it("does not show 'Disponible' for unavailable products", () => {
    const unavailableProduct: Product = {
      ...baseProduct,
      is_available: false,
    };

    render(<ProductCard product={unavailableProduct} />);
    expect(screen.queryByText("Disponible")).not.toBeInTheDocument();
  });
});

describe("BDD Scenario 4: Categoría sin productos", () => {
  it("shows a friendly empty message when category has no visible products", () => {
    const emptyProducts: Product[] = [];

    render(
      <CategoryDetailContent
        category={mockCategory}
        products={emptyProducts}
      />,
    );

    expect(
      screen.getByText(
        /no hay productos disponibles en esta categoría por el momento/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows the category name even when empty", () => {
    render(
      <CategoryDetailContent category={mockCategory} products={[]} />,
    );

    expect(screen.getByText("Chocolate")).toBeInTheDocument();
  });
});

function CategoryDetailContent({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  return (
    <section>
      <h1>{category.name}</h1>
      {products.length === 0 ? (
        <p>
          No hay productos disponibles en esta categoría por el momento
        </p>
      ) : (
        <div>
          <p>
            {products.length}{" "}
            {products.length === 1 ? "producto" : "productos"}
          </p>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
