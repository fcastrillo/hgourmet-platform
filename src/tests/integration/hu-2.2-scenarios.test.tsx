import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import type { Category, ProductWithCategory } from "@/types/database";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/admin/productos",
}));

const mockCreateProduct = vi.fn();
const mockUpdateProduct = vi.fn();
const mockDeleteProduct = vi.fn();
const mockToggleProductVisibility = vi.fn();

vi.mock("@/app/(admin)/admin/productos/actions", () => ({
  createProduct: (...args: unknown[]) => mockCreateProduct(...args),
  updateProduct: (...args: unknown[]) => mockUpdateProduct(...args),
  deleteProduct: (...args: unknown[]) => mockDeleteProduct(...args),
  toggleProductVisibility: (...args: unknown[]) =>
    mockToggleProductVisibility(...args),
}));

const sampleCategories: Category[] = [
  {
    id: "cat-1",
    name: "Chocolate",
    slug: "chocolate",
    description: null,
    image_url: null,
    display_order: 1,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Harinas",
    slug: "harinas",
    description: null,
    image_url: null,
    display_order: 2,
    is_active: true,
    created_at: "2026-01-02T00:00:00Z",
  },
];

const sampleProducts: ProductWithCategory[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Chocolate Amargo 70%",
    slug: "chocolate-amargo-70",
    description: "Chocolate de alta calidad",
    price: 150.0,
    image_url: "https://example.com/choco.jpg",
    sku: "CHOC-001",
    is_available: true,
    is_featured: true,
    is_seasonal: false,
    is_visible: true,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
    categories: { name: "Chocolate", slug: "chocolate" },
  },
  {
    id: "prod-2",
    category_id: "cat-2",
    name: "Harina de Almendra",
    slug: "harina-de-almendra",
    description: null,
    price: 85.5,
    image_url: null,
    sku: null,
    is_available: true,
    is_featured: false,
    is_seasonal: true,
    is_visible: true,
    created_at: "2026-02-02T00:00:00Z",
    updated_at: "2026-02-02T00:00:00Z",
    categories: { name: "Harinas", slug: "harinas" },
  },
  {
    id: "prod-3",
    category_id: "cat-1",
    name: "Cocoa en Polvo",
    slug: "cocoa-en-polvo",
    description: "Cocoa sin azúcar",
    price: 45.0,
    image_url: null,
    sku: "COC-003",
    is_available: false,
    is_featured: false,
    is_seasonal: false,
    is_visible: false,
    created_at: "2026-02-03T00:00:00Z",
    updated_at: "2026-02-03T00:00:00Z",
    categories: { name: "Chocolate", slug: "chocolate" },
  },
];

describe("HU-2.2 — CRUD de productos desde el panel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Escenario 1: Crear producto exitosamente", () => {
    it("muestra el formulario con todos los campos requeridos", () => {
      render(<ProductForm categories={sampleCategories} />);

      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
    });

    it("muestra el select de categorías con las opciones disponibles", () => {
      render(<ProductForm categories={sampleCategories} />);

      const select = screen.getByLabelText(/categoría/i);
      expect(select).toBeInTheDocument();
      expect(screen.getByText("Chocolate")).toBeInTheDocument();
      expect(screen.getByText("Harinas")).toBeInTheDocument();
    });

    it("muestra preview del slug al escribir el nombre", async () => {
      const user = userEvent.setup();
      render(<ProductForm categories={sampleCategories} />);

      await user.type(screen.getByLabelText(/nombre/i), "Chocolate Amargo 70%");

      expect(screen.getByText("chocolate-amargo-70")).toBeInTheDocument();
    });

    it("muestra opciones de toggles (disponible, visible, destacado, temporada)", () => {
      render(<ProductForm categories={sampleCategories} />);

      expect(screen.getByLabelText(/disponible/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/visible en catálogo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/producto destacado/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/producto de temporada/i)).toBeInTheDocument();
    });

    it("llama a createProduct con FormData al enviar formulario válido", async () => {
      mockCreateProduct.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<ProductForm categories={sampleCategories} />);

      await user.type(screen.getByLabelText(/nombre/i), "Nuevo Producto");
      await user.type(screen.getByLabelText(/precio/i), "99.50");
      await user.selectOptions(screen.getByLabelText(/categoría/i), "cat-1");

      await user.click(
        screen.getByRole("button", { name: /crear producto/i }),
      );

      await waitFor(() => {
        expect(mockCreateProduct).toHaveBeenCalledTimes(1);
      });

      const formData = mockCreateProduct.mock.calls[0][0] as FormData;
      expect(formData.get("name")).toBe("Nuevo Producto");
      expect(parseFloat(formData.get("price") as string)).toBe(99.5);
      expect(formData.get("category_id")).toBe("cat-1");
    });

    it("muestra error del servidor cuando createProduct falla", async () => {
      mockCreateProduct.mockResolvedValueOnce({
        success: false,
        error: "Ya existe un producto con ese SKU.",
      });
      const user = userEvent.setup();
      render(<ProductForm categories={sampleCategories} />);

      await user.type(screen.getByLabelText(/nombre/i), "Producto");
      await user.type(screen.getByLabelText(/precio/i), "50");
      await user.selectOptions(screen.getByLabelText(/categoría/i), "cat-1");
      await user.click(
        screen.getByRole("button", { name: /crear producto/i }),
      );

      expect(
        await screen.findByText(/ya existe un producto con ese sku/i),
      ).toBeInTheDocument();
    });
  });

  describe("Escenario 2: Editar producto", () => {
    it("muestra el formulario con datos pre-cargados del producto", () => {
      render(
        <ProductForm
          categories={sampleCategories}
          product={sampleProducts[0]}
        />,
      );

      expect(screen.getByDisplayValue("Chocolate Amargo 70%")).toBeInTheDocument();
      expect(screen.getByDisplayValue("150")).toBeInTheDocument();
      expect(screen.getByText("Editar producto")).toBeInTheDocument();
    });

    it("llama a updateProduct con ID y FormData al guardar edición", async () => {
      mockUpdateProduct.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(
        <ProductForm
          categories={sampleCategories}
          product={sampleProducts[0]}
        />,
      );

      const priceInput = screen.getByLabelText(/precio/i);
      await user.clear(priceInput);
      await user.type(priceInput, "175.00");
      await user.click(
        screen.getByRole("button", { name: /guardar cambios/i }),
      );

      await waitFor(() => {
        expect(mockUpdateProduct).toHaveBeenCalledTimes(1);
      });

      expect(mockUpdateProduct.mock.calls[0][0]).toBe("prod-1");
      const formData = mockUpdateProduct.mock.calls[0][1] as FormData;
      expect(parseFloat(formData.get("price") as string)).toBe(175);
    });

    it("muestra botón 'Guardar cambios' en modo edición", () => {
      render(
        <ProductForm
          categories={sampleCategories}
          product={sampleProducts[0]}
        />,
      );

      expect(
        screen.getByRole("button", { name: /guardar cambios/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Escenario 3: Ocultar producto (toggle visibility)", () => {
    it("muestra badge 'Visible' para productos visibles", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const visibleBadges = screen.getAllByText("Visible");
      expect(visibleBadges.length).toBeGreaterThanOrEqual(2);
    });

    it("muestra badge 'Oculto' para productos ocultos", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const hiddenBadges = screen.getAllByText("Oculto");
      expect(hiddenBadges.length).toBeGreaterThanOrEqual(1);
    });

    it("llama a toggleProductVisibility al hacer clic en el botón Ocultar", async () => {
      mockToggleProductVisibility.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const toggleBtn = within(rows[0] as HTMLElement).getByRole("button", {
        name: "Ocultar",
      });
      await user.click(toggleBtn);

      expect(mockToggleProductVisibility).toHaveBeenCalledWith(
        "prod-1",
        false,
      );
    });

    it("actualiza optimistamente el badge a 'Oculto' al ocultar", async () => {
      let resolveToggle!: (value: { success: boolean }) => void;
      mockToggleProductVisibility.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveToggle = resolve;
        }),
      );
      const user = userEvent.setup();
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      const toggleBtn = within(firstRow).getByRole("button", {
        name: "Ocultar",
      });
      await user.click(toggleBtn);

      await waitFor(() => {
        const badges = within(firstRow).getAllByText(/^(Visible|Oculto)$/);
        expect(badges.some((b) => b.textContent === "Oculto")).toBe(true);
      });

      resolveToggle({ success: true });
    });

    it("llama a toggleProductVisibility(id, true) al hacer clic en Mostrar", async () => {
      mockToggleProductVisibility.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const hiddenRow = rows[2] as HTMLElement;
      const toggleBtn = within(hiddenRow).getByRole("button", {
        name: "Mostrar",
      });
      await user.click(toggleBtn);

      expect(mockToggleProductVisibility).toHaveBeenCalledWith(
        "prod-3",
        true,
      );
    });
  });

  describe("Escenario 4: Validación de datos (error)", () => {
    it("muestra error cuando se envía sin nombre", async () => {
      const user = userEvent.setup();
      render(<ProductForm categories={sampleCategories} />);

      await user.type(screen.getByLabelText(/precio/i), "50");
      await user.selectOptions(screen.getByLabelText(/categoría/i), "cat-1");
      await user.click(
        screen.getByRole("button", { name: /crear producto/i }),
      );

      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
      expect(mockCreateProduct).not.toHaveBeenCalled();
    });

    it("muestra error cuando el precio es 0", async () => {
      const user = userEvent.setup();
      render(<ProductForm categories={sampleCategories} />);

      await user.type(screen.getByLabelText(/nombre/i), "Producto");
      const priceInput = screen.getByLabelText(/precio/i);
      await user.type(priceInput, "0");
      await user.selectOptions(screen.getByLabelText(/categoría/i), "cat-1");
      await user.click(
        screen.getByRole("button", { name: /crear producto/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/el precio debe ser mayor a 0/i),
        ).toBeInTheDocument();
      });
      expect(mockCreateProduct).not.toHaveBeenCalled();
    });

    it("muestra error cuando no se selecciona categoría", async () => {
      const user = userEvent.setup();
      render(<ProductForm categories={sampleCategories} />);

      await user.type(screen.getByLabelText(/nombre/i), "Producto");
      await user.type(screen.getByLabelText(/precio/i), "50");
      await user.click(
        screen.getByRole("button", { name: /crear producto/i }),
      );

      expect(
        screen.getByText(/la categoría es obligatoria/i),
      ).toBeInTheDocument();
      expect(mockCreateProduct).not.toHaveBeenCalled();
    });

    it("muestra múltiples errores de validación simultáneamente", async () => {
      const user = userEvent.setup();
      render(<ProductForm categories={sampleCategories} />);

      await user.click(
        screen.getByRole("button", { name: /crear producto/i }),
      );

      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
      expect(
        screen.getByText(/el precio debe ser mayor a 0/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/la categoría es obligatoria/i),
      ).toBeInTheDocument();
      expect(mockCreateProduct).not.toHaveBeenCalled();
    });
  });

  describe("ProductTable — funcionalidad general", () => {
    it("muestra la lista de productos con nombre, categoría, precio e imagen", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      expect(screen.getAllByText("Chocolate Amargo 70%").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Harina de Almendra").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Cocoa en Polvo").length).toBeGreaterThanOrEqual(1);
    });

    it("muestra empty state cuando no hay productos", () => {
      render(
        <ProductTable
          products={[]}
          totalCount={0}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      expect(screen.getByText(/no hay productos/i)).toBeInTheDocument();
    });

    it("muestra empty state de búsqueda cuando no hay resultados", () => {
      render(
        <ProductTable
          products={[]}
          totalCount={0}
          currentPage={1}
          pageSize={10}
          currentSearch="xyz"
        />,
      );

      expect(screen.getByText(/sin resultados/i)).toBeInTheDocument();
    });

    it("muestra badge 'Agotado' para productos sin stock", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      expect(screen.getAllByText("Agotado").length).toBeGreaterThanOrEqual(1);
    });

    it("muestra badges de 'Destacado' y 'Temporada'", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      expect(screen.getAllByText("Destacado").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Temporada").length).toBeGreaterThanOrEqual(1);
    });

    it("muestra tres icon buttons (Editar, Ocultar/Mostrar, Eliminar) por fila", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      expect(
        within(firstRow).getByRole("link", { name: "Editar" }),
      ).toBeInTheDocument();
      expect(
        within(firstRow).getByRole("button", { name: "Ocultar" }),
      ).toBeInTheDocument();
      expect(
        within(firstRow).getByRole("button", { name: "Eliminar" }),
      ).toBeInTheDocument();
    });

    it("abre dialog de confirmación al hacer clic en Eliminar", async () => {
      const user = userEvent.setup();
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", {
        name: /eliminar/i,
      });
      await user.click(deleteBtn);

      expect(
        screen.getByText(/eliminar producto/i, { selector: "h2" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/chocolate amargo 70%/i, { selector: "strong" }),
      ).toBeInTheDocument();
    });

    it("muestra paginación cuando hay más de una página", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={25}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      expect(screen.getByText("Página 1 de 3")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /siguiente/i }),
      ).toBeInTheDocument();
    });

    it("no muestra paginación cuando todo cabe en una página", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      expect(screen.queryByText(/página/i)).not.toBeInTheDocument();
    });

    it("muestra barra de búsqueda", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      expect(
        screen.getByPlaceholderText(/buscar productos/i),
      ).toBeInTheDocument();
    });
  });

  describe("ProductTable — vista mobile", () => {
    it("muestra botones con icono y label visible en cards mobile", () => {
      render(
        <ProductTable
          products={sampleProducts}
          totalCount={3}
          currentPage={1}
          pageSize={10}
          currentSearch=""
        />,
      );

      const mobileCards = document.querySelectorAll(".md\\:hidden > div");
      const firstCard = mobileCards[0] as HTMLElement;

      expect(
        within(firstCard).getByRole("link", { name: /editar/i }),
      ).toBeInTheDocument();
      expect(
        within(firstCard).getByRole("button", { name: /ocultar/i }),
      ).toBeInTheDocument();
      expect(
        within(firstCard).getByRole("button", { name: /eliminar/i }),
      ).toBeInTheDocument();

      expect(within(firstCard).getByText("Editar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Ocultar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Eliminar")).toBeInTheDocument();
    });
  });
});
