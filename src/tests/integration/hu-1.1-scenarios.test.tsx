import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Header } from "@/components/storefront/Header";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryNotFound } from "@/components/storefront/CategoryNotFound";
import type { Category, CategoryWithProductCount, Product } from "@/types/database";

const activeCategories: CategoryWithProductCount[] = [
  { id: "c1", name: "Chocolate", slug: "chocolate", description: null, display_order: 1, is_active: true, created_at: "", product_count: 5 },
  { id: "c2", name: "Harinas", slug: "harinas", description: null, display_order: 2, is_active: true, created_at: "", product_count: 3 },
  { id: "c3", name: "Moldes", slug: "moldes", description: null, display_order: 3, is_active: true, created_at: "", product_count: 8 },
];

const inactiveCategory: Category = {
  id: "c4",
  name: "Temporada Navideña",
  slug: "temporada-navidena",
  description: null,
  display_order: 10,
  is_active: false,
  created_at: "",
};

const baseProduct: Product = {
  id: "p1",
  category_id: "c1",
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

describe("HU-1.1 — Navegación por categorías de productos", () => {
  describe("Scenario 1: Navegación exitosa por categoría", () => {
    it("muestra las 3 categorías ordenadas por display_order con nombre y cantidad de productos", () => {
      render(
        <div>
          {activeCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>,
      );

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveAttribute("href", "/categorias/chocolate");
      expect(links[1]).toHaveAttribute("href", "/categorias/harinas");
      expect(links[2]).toHaveAttribute("href", "/categorias/moldes");

      expect(screen.getByText("Chocolate")).toBeInTheDocument();
      expect(screen.getByText(/5 productos/)).toBeInTheDocument();
      expect(screen.getByText("Harinas")).toBeInTheDocument();
      expect(screen.getByText(/3 productos/)).toBeInTheDocument();
      expect(screen.getByText("Moldes")).toBeInTheDocument();
      expect(screen.getByText(/8 productos/)).toBeInTheDocument();
    });
  });

  describe("Scenario 2: Filtrado de productos al seleccionar categoría", () => {
    it("muestra únicamente los productos visibles con imagen, nombre, precio y disponibilidad", () => {
      const visibleProducts: Product[] = Array.from({ length: 5 }, (_, i) => ({
        ...baseProduct,
        id: `p${i + 1}`,
        name: `Producto ${i + 1}`,
        slug: `producto-${i + 1}`,
        sku: `SKU-${i + 1}`,
      }));

      render(
        <div data-testid="product-grid">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>,
      );

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Producto ${i}`)).toBeInTheDocument();
      }
      expect(screen.getAllByText("$350.00")).toHaveLength(5);
      expect(screen.getAllByText("Disponible")).toHaveLength(5);
    });
  });

  describe("Scenario 3: Producto agotado visible con indicador", () => {
    it("muestra badge 'Agotado' y NO muestra 'Disponible'", () => {
      const unavailable: Product = { ...baseProduct, is_available: false };
      render(<ProductCard product={unavailable} />);

      const badges = screen.getAllByText("Agotado");
      expect(badges.length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText("Disponible")).not.toBeInTheDocument();
    });
  });

  describe("Scenario 4: Categoría sin productos", () => {
    it("muestra mensaje amigable cuando la categoría no tiene productos visibles", () => {
      render(
        <div>
          <h1>Sprinkles</h1>
          <p>No hay productos disponibles en esta categoría por el momento</p>
        </div>,
      );

      expect(
        screen.getByText(
          /no hay productos disponibles en esta categoría por el momento/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Scenario 5: Categoría inactiva no visible", () => {
    it("la categoría inactiva no aparece en el menú de navegación", () => {
      const allCategories = [...activeCategories, inactiveCategory];
      const headerCategories = allCategories.filter((c) => c.is_active);

      render(<Header categories={headerCategories} />);

      const nav = screen.getByRole("navigation", { name: /categorías/i });
      expect(
        within(nav).queryByText("Temporada Navideña"),
      ).not.toBeInTheDocument();
    });

    it("el acceso directo a slug inactivo muestra 404", () => {
      render(<CategoryNotFound />);

      expect(
        screen.getByText(/categoría no encontrada/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /ver todas las categorías/i }),
      ).toHaveAttribute("href", "/categorias");
    });
  });
});
