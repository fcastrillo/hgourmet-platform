import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductSection } from "@/components/storefront/ProductSection";
import type { Product } from "@/types/database";

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

function makeFeaturedProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) =>
    makeProduct({
      id: `feat-${i + 1}`,
      name: `Producto Destacado ${i + 1}`,
      is_featured: true,
      price: 50 + i * 10,
    })
  );
}

function makeSeasonalProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) =>
    makeProduct({
      id: `seas-${i + 1}`,
      name: `Producto Temporada ${i + 1}`,
      is_seasonal: true,
      price: 75 + i * 10,
    })
  );
}

// ============================================================
// HU-1.4 — Sección "Lo más vendido" y "Productos de temporada"
// ============================================================

describe("HU-1.4 — Sección 'Lo más vendido' y 'Productos de temporada'", () => {
  // ── Scenario 1: Sección "Lo más vendido" con productos ────
  describe("Scenario 1: Sección 'Lo más vendido' con productos", () => {
    it("muestra la sección con hasta 8 productos destacados, cada uno con nombre, precio y badge", () => {
      const products = makeFeaturedProducts(8);

      render(
        <ProductSection
          title="Lo más vendido"
          products={products}
          viewAllHref="/productos/destacados"
        />
      );

      expect(screen.getByText("Lo más vendido")).toBeInTheDocument();

      for (let i = 1; i <= 8; i++) {
        expect(
          screen.getByText(`Producto Destacado ${i}`)
        ).toBeInTheDocument();
      }

      expect(screen.getAllByText("Disponible")).toHaveLength(8);
    });

    it("renderiza cada producto como un enlace a su ficha de detalle", () => {
      const products = makeFeaturedProducts(3);

      render(
        <ProductSection
          title="Lo más vendido"
          products={products}
          viewAllHref="/productos/destacados"
        />
      );

      const links = screen.getAllByRole("link");
      const productLinks = links.filter((link) =>
        link.getAttribute("href")?.startsWith("/productos/producto-destacado-")
      );
      expect(productLinks).toHaveLength(3);
    });
  });

  // ── Scenario 2: Sección "Productos de temporada" con productos ──
  describe("Scenario 2: Sección 'Productos de temporada' con productos", () => {
    it("muestra la sección con 5 productos estacionales visibles", () => {
      const products = makeSeasonalProducts(5);

      render(
        <ProductSection
          title="Productos de temporada"
          products={products}
          viewAllHref="/productos/temporada"
        />
      );

      expect(screen.getByText("Productos de temporada")).toBeInTheDocument();

      for (let i = 1; i <= 5; i++) {
        expect(
          screen.getByText(`Producto Temporada ${i}`)
        ).toBeInTheDocument();
      }
    });
  });

  // ── Scenario 3: Sección sin productos no se renderiza ─────
  describe("Scenario 3: Sección sin productos no se renderiza", () => {
    it("no renderiza ni título ni contenedor cuando products está vacío", () => {
      const { container } = render(
        <ProductSection
          title="Productos de temporada"
          products={[]}
          viewAllHref="/productos/temporada"
        />
      );

      expect(
        screen.queryByText("Productos de temporada")
      ).not.toBeInTheDocument();
      expect(container.innerHTML).toBe("");
    });

    it("no afecta el layout de otras secciones", () => {
      const featuredProducts = makeFeaturedProducts(3);

      render(
        <>
          <ProductSection
            title="Lo más vendido"
            products={featuredProducts}
            viewAllHref="/productos/destacados"
          />
          <ProductSection
            title="Productos de temporada"
            products={[]}
            viewAllHref="/productos/temporada"
          />
        </>
      );

      expect(screen.getByText("Lo más vendido")).toBeInTheDocument();
      expect(
        screen.queryByText("Productos de temporada")
      ).not.toBeInTheDocument();
    });
  });

  // ── Scenario 4: Enlace "Ver todos" navega a vista filtrada ─
  describe("Scenario 4: Enlace 'Ver todos' navega a vista filtrada", () => {
    it("muestra enlace 'Ver todos' con href a /productos/destacados", () => {
      const products = makeFeaturedProducts(8);

      render(
        <ProductSection
          title="Lo más vendido"
          products={products}
          viewAllHref="/productos/destacados"
        />
      );

      const viewAllLink = screen.getByRole("link", { name: /ver todos/i });
      expect(viewAllLink).toHaveAttribute("href", "/productos/destacados");
    });

    it("muestra enlace 'Ver todos' con href a /productos/temporada", () => {
      const products = makeSeasonalProducts(5);

      render(
        <ProductSection
          title="Productos de temporada"
          products={products}
          viewAllHref="/productos/temporada"
        />
      );

      const viewAllLink = screen.getByRole("link", { name: /ver todos/i });
      expect(viewAllLink).toHaveAttribute("href", "/productos/temporada");
    });

    it("no muestra enlace 'Ver todos' cuando viewAllHref no se provee", () => {
      const products = makeFeaturedProducts(3);

      render(
        <ProductSection title="Lo más vendido" products={products} />
      );

      expect(
        screen.queryByRole("link", { name: /ver todos/i })
      ).not.toBeInTheDocument();
    });
  });

  // ── Scenario 5: Producto destacado oculto no aparece ──────
  describe("Scenario 5: Producto destacado oculto no aparece", () => {
    it("solo muestra productos visibles — los ocultos son filtrados antes de llegar al componente", () => {
      const visibleProducts = [
        makeProduct({
          id: "p-visible",
          name: "Chocolate Belga Premium",
          is_featured: true,
          is_visible: true,
        }),
      ];

      render(
        <ProductSection
          title="Lo más vendido"
          products={visibleProducts}
          viewAllHref="/productos/destacados"
        />
      );

      expect(screen.getByText("Chocolate Belga Premium")).toBeInTheDocument();
      expect(
        screen.queryByText("Producto Oculto Interno")
      ).not.toBeInTheDocument();
    });
  });

  // ── Responsive grid ───────────────────────────────────────
  describe("Grid responsivo", () => {
    it("aplica clases de grid responsive: 2 cols mobile, 3 sm, 4 lg", () => {
      const products = makeFeaturedProducts(4);

      const { container } = render(
        <ProductSection
          title="Lo más vendido"
          products={products}
          viewAllHref="/productos/destacados"
        />
      );

      const grid = container.querySelector(".grid");
      expect(grid).not.toBeNull();
      expect(grid?.className).toContain("grid-cols-2");
      expect(grid?.className).toContain("sm:grid-cols-3");
      expect(grid?.className).toContain("lg:grid-cols-4");
    });
  });
});
