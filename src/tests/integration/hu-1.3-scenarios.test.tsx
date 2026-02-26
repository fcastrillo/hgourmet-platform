import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { SearchableProductCatalog } from "@/components/storefront/SearchableProductCatalog";
import type { Product, CategoryWithProductCount } from "@/types/database";

// --- Mock searchProducts ---
const mockSearchProducts = vi.fn();
vi.mock("@/lib/supabase/queries/search", () => ({
  searchProducts: (...args: unknown[]) => mockSearchProducts(...args),
}));

// --- Fixtures ---

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
  {
    id: "c3",
    name: "Accesorios",
    slug: "accesorios",
    description: "Accesorios de repostería",
    image_url: null,
    display_order: 3,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    product_count: 4,
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

const chocolateProducts: Product[] = [
  makeProduct({ id: "p1", name: "Chocolate Belga", category_id: "c1" }),
  makeProduct({ id: "p2", name: "Chocolate Amargo", category_id: "c1" }),
  makeProduct({ id: "p3", name: "Chocolate con Leche", category_id: "c1" }),
];

const moldeProducts: Product[] = [
  makeProduct({ id: "p4", name: "Molde de Silicón", category_id: "c2" }),
  makeProduct({ id: "p5", name: "Molde Cuadrado", category_id: "c2" }),
  makeProduct({ id: "p6", name: "Molde Redondo", category_id: "c2" }),
];

/**
 * With fake timers, we need to:
 * 1. fireEvent.change to set input value
 * 2. advance timers to fire debounce
 * 3. flush microtasks so the mock promise resolves and React re-renders
 */
async function searchAndFlush(term: string) {
  fireEvent.change(screen.getByLabelText("Buscar productos"), {
    target: { value: term },
  });
  await act(async () => {
    vi.advanceTimersByTime(300);
  });
}

async function clickCategoryChip(name: string) {
  const filterGroup = screen.getByRole("group", {
    name: "Filtrar por categoría",
  });
  const chip = within(filterGroup).getByText(name);
  await act(async () => {
    chip.click();
  });
  // flush the effect + promise
  await act(async () => {
    vi.advanceTimersByTime(0);
  });
}

// ============================================================
// HU-1.3 — Búsqueda y filtrado de productos
// ============================================================

describe("HU-1.3 — Búsqueda y filtrado de productos", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSearchProducts.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Scenario 1: Búsqueda por nombre exitosa ─────────────────
  describe("Scenario 1: Búsqueda por nombre exitosa", () => {
    it("muestra los 3 productos que coinciden con 'chocolate'", async () => {
      mockSearchProducts.mockResolvedValue(chocolateProducts);

      render(<SearchableProductCatalog categories={categories} />);

      await searchAndFlush("chocolate");

      expect(screen.getByText("3 productos encontrados")).toBeInTheDocument();
      expect(screen.getByText("Chocolate Belga")).toBeInTheDocument();
      expect(screen.getByText("Chocolate Amargo")).toBeInTheDocument();
      expect(screen.getByText("Chocolate con Leche")).toBeInTheDocument();
    });

    it("llama a searchProducts con el término correcto", async () => {
      mockSearchProducts.mockResolvedValue(chocolateProducts);

      render(<SearchableProductCatalog categories={categories} />);

      await searchAndFlush("chocolate");

      expect(mockSearchProducts).toHaveBeenCalledWith({
        query: "chocolate",
        categoryId: null,
        priceMin: null,
        priceMax: null,
        availableOnly: false,
      });
    });
  });

  // ── Scenario 2: Búsqueda combinada con filtro de categoría ──
  describe("Scenario 2: Búsqueda combinada con filtro de categoría", () => {
    it("filtra por término + categoría y muestra solo los productos de esa categoría", async () => {
      mockSearchProducts.mockResolvedValue(moldeProducts);

      render(<SearchableProductCatalog categories={categories} />);

      await clickCategoryChip("Moldes");

      expect(mockSearchProducts).toHaveBeenCalledWith({
        query: undefined,
        categoryId: "c2",
        priceMin: null,
        priceMax: null,
        availableOnly: false,
      });

      // Add search term on top of category filter
      mockSearchProducts.mockResolvedValue(moldeProducts);
      await searchAndFlush("molde");

      expect(mockSearchProducts).toHaveBeenCalledWith({
        query: "molde",
        categoryId: "c2",
        priceMin: null,
        priceMax: null,
        availableOnly: false,
      });

      expect(screen.getByText("3 productos encontrados")).toBeInTheDocument();
    });
  });

  // ── Scenario 3: Búsqueda con debounce ──────────────────────
  describe("Scenario 3: Búsqueda con debounce", () => {
    it("ejecuta la búsqueda una sola vez después de 300ms de inactividad", async () => {
      mockSearchProducts.mockResolvedValue([]);

      render(<SearchableProductCatalog categories={categories} />);

      // Simulate rapid typing: "cho" then 100ms later "chocolate"
      fireEvent.change(screen.getByLabelText("Buscar productos"), {
        target: { value: "cho" },
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      fireEvent.change(screen.getByLabelText("Buscar productos"), {
        target: { value: "chocolate" },
      });

      // 200ms after last change: debounce hasn't fired yet
      act(() => {
        vi.advanceTimersByTime(200);
      });

      const callsBefore = mockSearchProducts.mock.calls.filter(
        (args) => args[0]?.query === "chocolate"
      );
      expect(callsBefore).toHaveLength(0);

      // 300ms after last change: debounce fires
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const callsAfter = mockSearchProducts.mock.calls.filter(
        (args) => args[0]?.query === "chocolate"
      );
      expect(callsAfter).toHaveLength(1);
    });
  });

  // ── Scenario 4: Sin resultados encontrados ──────────────────
  describe("Scenario 4: Sin resultados encontrados", () => {
    it("muestra mensaje amigable con el término buscado y enlaces a categorías", async () => {
      mockSearchProducts.mockResolvedValue([]);

      render(<SearchableProductCatalog categories={categories} />);

      await searchAndFlush("unicornio");

      expect(
        screen.getByText(/No encontramos productos para 'unicornio'/)
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /Intenta con otro término o explora nuestras categorías/
        )
      ).toBeInTheDocument();
    });
  });

  // ── Scenario 5: Búsqueda excluye productos ocultos ─────────
  describe("Scenario 5: Búsqueda excluye productos ocultos", () => {
    it("solo muestra productos visibles — searchProducts filtra is_visible=true", async () => {
      const visibleOnly = [
        makeProduct({
          id: "p-visible",
          name: "Chocolate Belga",
          is_visible: true,
        }),
      ];
      mockSearchProducts.mockResolvedValue(visibleOnly);

      render(<SearchableProductCatalog categories={categories} />);

      await searchAndFlush("chocolate");

      expect(screen.getByText("Chocolate Belga")).toBeInTheDocument();
      expect(screen.getByText("1 producto encontrado")).toBeInTheDocument();
      expect(screen.queryByText("Chocolate Interno")).not.toBeInTheDocument();
    });
  });

  // ── Default state ──────────────────────────────────────────
  describe("Estado inicial: sin búsqueda activa", () => {
    it("muestra el grid de categorías cuando no hay búsqueda", () => {
      render(<SearchableProductCatalog categories={categories} />);

      const links = screen.getAllByRole("link");
      const categoryLinks = links.filter((link) =>
        link.getAttribute("href")?.startsWith("/categorias/")
      );
      expect(categoryLinks).toHaveLength(3);
      expect(screen.getByText("5 productos")).toBeInTheDocument();
    });

    it("vuelve a mostrar categorías al limpiar la búsqueda", async () => {
      mockSearchProducts.mockResolvedValue(chocolateProducts);

      render(<SearchableProductCatalog categories={categories} />);

      await searchAndFlush("chocolate");
      expect(screen.getByText("3 productos encontrados")).toBeInTheDocument();

      // Clear by setting empty + also reset "Todas" category
      await clickCategoryChip("Todas");
      await searchAndFlush("");

      const links = screen.getAllByRole("link");
      const categoryLinks = links.filter((link) =>
        link.getAttribute("href")?.startsWith("/categorias/")
      );
      expect(categoryLinks).toHaveLength(3);
    });
  });
});
