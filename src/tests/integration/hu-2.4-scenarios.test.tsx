import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { slugify } from "@/lib/slugify";
import { CategoryTable } from "@/components/admin/CategoryTable";
import type { CategoryWithProductCount } from "@/types/database";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/categorias",
}));

const mockCreateCategory = vi.fn();
const mockUpdateCategory = vi.fn();
const mockDeleteCategory = vi.fn();
const mockReorderCategories = vi.fn();

vi.mock("@/app/(admin)/admin/categorias/actions", () => ({
  createCategory: (...args: unknown[]) => mockCreateCategory(...args),
  updateCategory: (...args: unknown[]) => mockUpdateCategory(...args),
  deleteCategory: (...args: unknown[]) => mockDeleteCategory(...args),
  reorderCategories: (...args: unknown[]) => mockReorderCategories(...args),
}));

const sampleCategories: CategoryWithProductCount[] = [
  {
    id: "cat-1",
    name: "Chocolate",
    slug: "chocolate",
    description: "Todo sobre chocolate",
    display_order: 1,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    product_count: 15,
  },
  {
    id: "cat-2",
    name: "Harinas",
    slug: "harinas",
    description: null,
    display_order: 2,
    is_active: true,
    created_at: "2026-01-02T00:00:00Z",
    product_count: 8,
  },
  {
    id: "cat-3",
    name: "Moldes",
    slug: "moldes",
    description: "Moldes para repostería",
    display_order: 3,
    is_active: false,
    created_at: "2026-01-03T00:00:00Z",
    product_count: 0,
  },
];

describe("HU-2.4 — Gestión de categorías", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Slugify utility", () => {
    it("convierte texto a slug URL-friendly", () => {
      expect(slugify("Especias")).toBe("especias");
    });

    it("elimina acentos y caracteres especiales", () => {
      expect(slugify("Café & Té Especial")).toBe("cafe-te-especial");
    });

    it("maneja espacios múltiples y guiones", () => {
      expect(slugify("  Materia   Prima  ")).toBe("materia-prima");
    });

    it("maneja texto con ñ", () => {
      expect(slugify("Año Nuevo")).toBe("ano-nuevo");
    });

    it("retorna vacío para caracteres no alfanuméricos", () => {
      expect(slugify("!!!")).toBe("");
    });
  });

  describe("Escenario 1: Crear categoría exitosamente", () => {
    it("muestra la lista de categorías con nombre, slug, orden y estado", () => {
      render(<CategoryTable categories={sampleCategories} />);

      expect(screen.getAllByText("Chocolate").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("chocolate").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Harinas").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("harinas").length).toBeGreaterThanOrEqual(1);
    });

    it("muestra botón 'Nueva categoría'", () => {
      render(<CategoryTable categories={sampleCategories} />);

      expect(screen.getByRole("button", { name: /nueva categoría/i })).toBeInTheDocument();
    });

    it("abre modal de creación al hacer clic en 'Nueva categoría'", async () => {
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      await user.click(screen.getByRole("button", { name: /nueva categoría/i }));

      expect(screen.getByText("Nueva categoría", { selector: "h2" })).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    it("muestra preview del slug al escribir el nombre", async () => {
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      await user.click(screen.getByRole("button", { name: /nueva categoría/i }));
      await user.type(screen.getByLabelText(/nombre/i), "Especias");

      expect(screen.getByText("especias")).toBeInTheDocument();
    });

    it("llama a createCategory con FormData al enviar formulario", async () => {
      mockCreateCategory.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      await user.click(screen.getByRole("button", { name: /nueva categoría/i }));
      await user.type(screen.getByLabelText(/nombre/i), "Especias");
      await user.click(screen.getByRole("button", { name: /guardar/i }));

      expect(mockCreateCategory).toHaveBeenCalledTimes(1);
      const formData = mockCreateCategory.mock.calls[0][0] as FormData;
      expect(formData.get("name")).toBe("Especias");
      expect(formData.get("is_active")).toBe("true");
    });

    it("muestra error cuando createCategory falla", async () => {
      mockCreateCategory.mockResolvedValueOnce({
        success: false,
        error: "Ya existe una categoría con ese nombre.",
      });
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      await user.click(screen.getByRole("button", { name: /nueva categoría/i }));
      await user.type(screen.getByLabelText(/nombre/i), "Chocolate");
      await user.click(screen.getByRole("button", { name: /guardar/i }));

      expect(await screen.findByText(/ya existe una categoría/i)).toBeInTheDocument();
    });
  });

  describe("Escenario 2: Reordenar categorías", () => {
    it("muestra controles de subir/bajar por categoría", () => {
      render(<CategoryTable categories={sampleCategories} />);

      const upButtons = screen.getAllByLabelText("Subir");
      const downButtons = screen.getAllByLabelText("Bajar");

      expect(upButtons.length).toBeGreaterThanOrEqual(sampleCategories.length);
      expect(downButtons.length).toBeGreaterThanOrEqual(sampleCategories.length);
    });

    it("llama a reorderCategories al mover una categoría hacia abajo", async () => {
      mockReorderCategories.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      expect(desktopTable).not.toBeNull();

      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRowDownBtn = within(rows[0] as HTMLElement).getByLabelText("Bajar");
      await user.click(firstRowDownBtn);

      expect(mockReorderCategories).toHaveBeenCalledWith([
        "cat-2",
        "cat-1",
        "cat-3",
      ]);
    });

    it("deshabilita botón 'Subir' en la primera categoría", () => {
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstUpBtn = within(rows[0] as HTMLElement).getByLabelText("Subir");

      expect(firstUpBtn).toBeDisabled();
    });

    it("deshabilita botón 'Bajar' en la última categoría", () => {
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const lastDownBtn = within(rows[rows.length - 1] as HTMLElement).getByLabelText("Bajar");

      expect(lastDownBtn).toBeDisabled();
    });
  });

  describe("Escenario 3: Eliminar categoría con productos asociados", () => {
    it("abre dialog de confirmación al hacer clic en Eliminar", async () => {
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: /eliminar/i });
      await user.click(deleteBtn);

      expect(screen.getByText(/eliminar categoría/i, { selector: "h2" })).toBeInTheDocument();
      expect(screen.getByText(/chocolate/i, { selector: "strong" })).toBeInTheDocument();
    });

    it("muestra mensaje de error cuando la categoría tiene productos y deshabilita botón eliminar", async () => {
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: /eliminar/i });
      await user.click(deleteBtn);

      expect(screen.getByText(/15 productos asociados/i)).toBeInTheDocument();

      const dialogDeleteBtn = screen.getAllByRole("button", { name: /eliminar/i })
        .find((btn) => btn.closest("[class*='fixed']"));
      expect(dialogDeleteBtn).toBeDisabled();
    });

    it("permite eliminar categoría sin productos", async () => {
      mockDeleteCategory.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[2] as HTMLElement).getByRole("button", { name: /eliminar/i });
      await user.click(deleteBtn);

      const dialogDeleteBtn = screen.getAllByRole("button", { name: /eliminar$/i })
        .find((btn) => btn.closest("[class*='fixed']"));
      expect(dialogDeleteBtn).not.toBeDisabled();

      await user.click(dialogDeleteBtn!);
      expect(mockDeleteCategory).toHaveBeenCalledWith("cat-3");
    });
  });

  describe("Estado vacío", () => {
    it("muestra mensaje cuando no hay categorías", () => {
      render(<CategoryTable categories={[]} />);

      expect(screen.getByText(/no hay categorías/i)).toBeInTheDocument();
      expect(screen.getByText(/crea la primera/i)).toBeInTheDocument();
    });
  });

  describe("Estado activa/inactiva", () => {
    it("muestra badge 'Activa' para categorías activas y 'Inactiva' para inactivas", () => {
      render(<CategoryTable categories={sampleCategories} />);

      const badges = screen.getAllByText(/^(activa|inactiva)$/i);
      const activeBadges = badges.filter((b) => b.textContent === "Activa");
      const inactiveBadges = badges.filter((b) => b.textContent === "Inactiva");

      expect(activeBadges.length).toBeGreaterThanOrEqual(2);
      expect(inactiveBadges.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Editar categoría", () => {
    it("abre modal de edición con datos pre-cargados al hacer clic en Editar", async () => {
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const editBtn = within(rows[0] as HTMLElement).getByRole("button", { name: /editar/i });
      await user.click(editBtn);

      expect(screen.getByText("Editar categoría")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Chocolate")).toBeInTheDocument();
    });

    it("llama a updateCategory con ID y FormData al guardar edición", async () => {
      mockUpdateCategory.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<CategoryTable categories={sampleCategories} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const editBtn = within(rows[0] as HTMLElement).getByRole("button", { name: /editar/i });
      await user.click(editBtn);

      const nameInput = screen.getByDisplayValue("Chocolate");
      await user.clear(nameInput);
      await user.type(nameInput, "Chocolates Premium");
      await user.click(screen.getByRole("button", { name: /guardar/i }));

      expect(mockUpdateCategory).toHaveBeenCalledTimes(1);
      expect(mockUpdateCategory.mock.calls[0][0]).toBe("cat-1");
      const formData = mockUpdateCategory.mock.calls[0][1] as FormData;
      expect(formData.get("name")).toBe("Chocolates Premium");
    });
  });
});
