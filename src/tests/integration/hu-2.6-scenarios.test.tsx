import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrandTable } from "@/components/admin/BrandTable";
import { BrandForm } from "@/components/admin/BrandForm";
import type { Brand } from "@/types/database";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/marcas",
  useRouter: () => ({ push: vi.fn() }),
}));

const mockCreateBrand = vi.fn();
const mockUpdateBrand = vi.fn();
const mockDeleteBrand = vi.fn();
const mockReorderBrands = vi.fn();
const mockToggleBrandActive = vi.fn();

vi.mock("@/app/(admin)/admin/marcas/actions", () => ({
  createBrand: (...args: unknown[]) => mockCreateBrand(...args),
  updateBrand: (...args: unknown[]) => mockUpdateBrand(...args),
  deleteBrand: (...args: unknown[]) => mockDeleteBrand(...args),
  reorderBrands: (...args: unknown[]) => mockReorderBrands(...args),
  toggleBrandActive: (...args: unknown[]) => mockToggleBrandActive(...args),
}));

const sampleBrands: Brand[] = [
  {
    id: "brand-1",
    name: "Wilton",
    logo_url: "https://example.com/wilton.png",
    website_url: "https://www.wilton.com",
    is_active: true,
    display_order: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "brand-2",
    name: "Nestlé",
    logo_url: "https://example.com/nestle.png",
    website_url: null,
    is_active: true,
    display_order: 2,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "brand-3",
    name: "Proveedor Inactivo",
    logo_url: null,
    website_url: null,
    is_active: false,
    display_order: 3,
    created_at: "2026-01-03T00:00:00Z",
  },
];

describe("HU-2.6 — Gestión de marcas/proveedores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("BrandTable — Lista de marcas", () => {
    it("muestra nombre, logo, sitio web, orden y estado de cada marca", () => {
      render(<BrandTable brands={sampleBrands} />);

      expect(screen.getAllByText("Wilton").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Nestlé").length).toBeGreaterThanOrEqual(1);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThanOrEqual(2);
    });

    it("muestra estado Activa/Inactiva con badges", () => {
      render(<BrandTable brands={sampleBrands} />);

      const badges = screen.getAllByText(/^(Activa|Inactiva)$/);
      const activeBadges = badges.filter((b) => b.textContent === "Activa");
      const inactiveBadges = badges.filter((b) => b.textContent === "Inactiva");

      expect(activeBadges.length).toBeGreaterThanOrEqual(2);
      expect(inactiveBadges.length).toBeGreaterThanOrEqual(1);
    });

    it("muestra estado vacío cuando no hay marcas", () => {
      render(<BrandTable brands={[]} />);

      expect(screen.getByText(/no hay marcas/i)).toBeInTheDocument();
      expect(screen.getByText(/agrega la primera marca/i)).toBeInTheDocument();
    });

    it("muestra link 'Nueva marca'", () => {
      render(<BrandTable brands={sampleBrands} />);

      expect(screen.getByRole("link", { name: /nueva marca/i })).toBeInTheDocument();
    });
  });

  describe("BrandTable — Icon buttons (ADR-009)", () => {
    it("muestra tres acciones por fila: Editar (link), Desactivar/Activar, Eliminar", () => {
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      expect(within(firstRow).getByRole("link", { name: "Editar" })).toBeInTheDocument();
      expect(within(firstRow).getByRole("button", { name: "Desactivar" })).toBeInTheDocument();
      expect(within(firstRow).getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
    });

    it("muestra 'Activar' para marcas inactivas", () => {
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const inactiveRow = rows[2] as HTMLElement;

      expect(within(inactiveRow).getByRole("button", { name: "Activar" })).toBeInTheDocument();
    });

    it("los icon buttons tienen tooltip nativo (atributo title)", () => {
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      expect(within(firstRow).getByTitle("Editar")).toBeInTheDocument();
      expect(within(firstRow).getByTitle("Desactivar")).toBeInTheDocument();
      expect(within(firstRow).getByTitle("Eliminar")).toBeInTheDocument();
    });
  });

  describe("Escenario 2: Toggle desactivar marca (optimista)", () => {
    it("llama a toggleBrandActive(id, false) al hacer clic en Desactivar", async () => {
      mockToggleBrandActive.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const toggleBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Desactivar" });
      await user.click(toggleBtn);

      expect(mockToggleBrandActive).toHaveBeenCalledWith("brand-1", false);
    });

    it("actualiza optimistamente el badge a 'Inactiva' al desactivar", async () => {
      let resolveToggle!: (value: { success: boolean }) => void;
      mockToggleBrandActive.mockReturnValueOnce(
        new Promise((resolve) => { resolveToggle = resolve; }),
      );
      const user = userEvent.setup();
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      const toggleBtn = within(firstRow).getByRole("button", { name: "Desactivar" });
      await user.click(toggleBtn);

      await waitFor(() => {
        const badges = within(firstRow).getAllByText(/^(Activa|Inactiva)$/);
        expect(badges.some((b) => b.textContent === "Inactiva")).toBe(true);
      });

      resolveToggle({ success: true });
    });

    it("llama a toggleBrandActive(id, true) al hacer clic en Activar", async () => {
      mockToggleBrandActive.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const toggleBtn = within(rows[2] as HTMLElement).getByRole("button", { name: "Activar" });
      await user.click(toggleBtn);

      expect(mockToggleBrandActive).toHaveBeenCalledWith("brand-3", true);
    });
  });

  describe("BrandTable — Reordenamiento", () => {
    it("muestra controles de subir/bajar por marca", () => {
      render(<BrandTable brands={sampleBrands} />);

      const upButtons = screen.getAllByLabelText("Subir");
      const downButtons = screen.getAllByLabelText("Bajar");

      expect(upButtons.length).toBeGreaterThanOrEqual(sampleBrands.length);
      expect(downButtons.length).toBeGreaterThanOrEqual(sampleBrands.length);
    });

    it("llama a reorderBrands al mover una marca hacia abajo", async () => {
      mockReorderBrands.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRowDownBtn = within(rows[0] as HTMLElement).getByLabelText("Bajar");
      await user.click(firstRowDownBtn);

      expect(mockReorderBrands).toHaveBeenCalledWith([
        "brand-2",
        "brand-1",
        "brand-3",
      ]);
    });

    it("deshabilita botón 'Subir' en la primera marca", () => {
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstUpBtn = within(rows[0] as HTMLElement).getByLabelText("Subir");

      expect(firstUpBtn).toBeDisabled();
    });

    it("deshabilita botón 'Bajar' en la última marca", () => {
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const lastDownBtn = within(rows[rows.length - 1] as HTMLElement).getByLabelText("Bajar");

      expect(lastDownBtn).toBeDisabled();
    });
  });

  describe("BrandTable — Eliminar marca", () => {
    it("abre dialog de confirmación al hacer clic en Eliminar", async () => {
      const user = userEvent.setup();
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Eliminar" });
      await user.click(deleteBtn);

      expect(screen.getByText(/eliminar marca/i, { selector: "h2" })).toBeInTheDocument();
      expect(screen.getByText(/Wilton/, { selector: "strong" })).toBeInTheDocument();
    });

    it("llama a deleteBrand al confirmar eliminación", async () => {
      mockDeleteBrand.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BrandTable brands={sampleBrands} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Eliminar" });
      await user.click(deleteBtn);

      const dialogDeleteBtn = screen.getAllByRole("button", { name: /eliminar$/i })
        .find((btn) => btn.closest("[class*='fixed']"));
      await user.click(dialogDeleteBtn!);

      expect(mockDeleteBrand).toHaveBeenCalledWith("brand-1");
    });
  });

  describe("BrandTable — Vista mobile", () => {
    it("muestra botones con icono y label visible en cards mobile", () => {
      render(<BrandTable brands={sampleBrands} />);

      const mobileCards = document.querySelectorAll(".md\\:hidden > div");
      const firstCard = mobileCards[0] as HTMLElement;

      expect(within(firstCard).getByText("Editar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Desactivar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Eliminar")).toBeInTheDocument();
    });
  });

  describe("Escenario 1: BrandForm — Crear marca exitosamente", () => {
    it("muestra el formulario con campos nombre, logo, sitio web y toggle activa", () => {
      render(<BrandForm />);

      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Sitio web")).toBeInTheDocument();
      expect(screen.getByText("Activa")).toBeInTheDocument();
      expect(document.getElementById("is_active")).toBeInTheDocument();
    });

    it("muestra 'Crear marca' en modo creación", () => {
      render(<BrandForm />);

      expect(screen.getByRole("button", { name: /crear marca/i })).toBeInTheDocument();
    });

    it("muestra 'Guardar cambios' en modo edición", () => {
      render(<BrandForm brand={sampleBrands[0]} />);

      expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
    });

    it("pre-carga datos de la marca en modo edición", () => {
      render(<BrandForm brand={sampleBrands[0]} />);

      expect(screen.getByDisplayValue("Wilton")).toBeInTheDocument();
      expect(screen.getByDisplayValue("https://www.wilton.com")).toBeInTheDocument();
    });

    it("muestra link 'Volver a marcas'", () => {
      render(<BrandForm />);

      expect(screen.getByRole("link", { name: /volver a marcas/i })).toBeInTheDocument();
    });
  });

  describe("Escenario 3: BrandForm — Validación nombre obligatorio", () => {
    it("muestra error 'El nombre es obligatorio.' al enviar sin nombre", async () => {
      const user = userEvent.setup();
      render(<BrandForm />);

      const submitButton = screen.getByRole("button", { name: /crear marca/i });
      await user.click(submitButton);

      expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
      expect(mockCreateBrand).not.toHaveBeenCalled();
    });

    it("limpia el error al escribir en el campo nombre", async () => {
      const user = userEvent.setup();
      render(<BrandForm />);

      await user.click(screen.getByRole("button", { name: /crear marca/i }));
      expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();

      await user.type(screen.getByLabelText(/nombre/i), "W");
      expect(screen.queryByText("El nombre es obligatorio.")).not.toBeInTheDocument();
    });
  });
});
