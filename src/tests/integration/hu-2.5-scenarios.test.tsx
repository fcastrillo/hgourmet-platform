import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BannerTable } from "@/components/admin/BannerTable";
import { BannerForm } from "@/components/admin/BannerForm";
import type { Banner } from "@/types/database";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/banners",
  useRouter: () => ({ push: vi.fn() }),
}));

const mockCreateBanner = vi.fn();
const mockUpdateBanner = vi.fn();
const mockDeleteBanner = vi.fn();
const mockReorderBanners = vi.fn();
const mockToggleBannerActive = vi.fn();

vi.mock("@/app/(admin)/admin/banners/actions", () => ({
  createBanner: (...args: unknown[]) => mockCreateBanner(...args),
  updateBanner: (...args: unknown[]) => mockUpdateBanner(...args),
  deleteBanner: (...args: unknown[]) => mockDeleteBanner(...args),
  reorderBanners: (...args: unknown[]) => mockReorderBanners(...args),
  toggleBannerActive: (...args: unknown[]) => mockToggleBannerActive(...args),
}));

const sampleBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Promoción Navidad",
    subtitle: "Hasta 30% de descuento",
    image_url: "https://example.com/banner1.jpg",
    link_url: "/categorias/chocolate",
    is_active: true,
    display_order: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "banner-2",
    title: "Nuevos Moldes",
    subtitle: null,
    image_url: "https://example.com/banner2.jpg",
    link_url: null,
    is_active: true,
    display_order: 2,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "banner-3",
    title: "Temporada Pasada",
    subtitle: "Ya terminó",
    image_url: "https://example.com/banner3.jpg",
    link_url: null,
    is_active: false,
    display_order: 3,
    created_at: "2026-01-03T00:00:00Z",
  },
];

describe("HU-2.5 — Gestión de banners rotativos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("BannerTable — Lista de banners", () => {
    it("muestra título, imagen, link, orden y estado de cada banner", () => {
      render(<BannerTable banners={sampleBanners} />);

      expect(screen.getAllByText("Promoción Navidad").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Nuevos Moldes").length).toBeGreaterThanOrEqual(1);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThanOrEqual(sampleBanners.length);
    });

    it("muestra estado Activo/Inactivo con badges", () => {
      render(<BannerTable banners={sampleBanners} />);

      const badges = screen.getAllByText(/^(Activo|Inactivo)$/);
      const activeBadges = badges.filter((b) => b.textContent === "Activo");
      const inactiveBadges = badges.filter((b) => b.textContent === "Inactivo");

      expect(activeBadges.length).toBeGreaterThanOrEqual(2);
      expect(inactiveBadges.length).toBeGreaterThanOrEqual(1);
    });

    it("muestra estado vacío cuando no hay banners", () => {
      render(<BannerTable banners={[]} />);

      expect(screen.getByText(/no hay banners/i)).toBeInTheDocument();
      expect(screen.getByText(/crea el primer banner/i)).toBeInTheDocument();
    });

    it("muestra link 'Nuevo banner'", () => {
      render(<BannerTable banners={sampleBanners} />);

      expect(screen.getByRole("link", { name: /nuevo banner/i })).toBeInTheDocument();
    });
  });

  describe("BannerTable — Icon buttons (ADR-009)", () => {
    it("muestra tres acciones por fila: Editar (link), Desactivar/Activar, Eliminar", () => {
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      expect(within(firstRow).getByRole("link", { name: "Editar" })).toBeInTheDocument();
      expect(within(firstRow).getByRole("button", { name: "Desactivar" })).toBeInTheDocument();
      expect(within(firstRow).getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
    });

    it("muestra 'Activar' para banners inactivos", () => {
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const inactiveRow = rows[2] as HTMLElement;

      expect(within(inactiveRow).getByRole("button", { name: "Activar" })).toBeInTheDocument();
    });

    it("los icon buttons tienen tooltip nativo (atributo title)", () => {
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      expect(within(firstRow).getByTitle("Editar")).toBeInTheDocument();
      expect(within(firstRow).getByTitle("Desactivar")).toBeInTheDocument();
      expect(within(firstRow).getByTitle("Eliminar")).toBeInTheDocument();
    });
  });

  describe("Escenario 2: Toggle desactivar banner (optimista)", () => {
    it("llama a toggleBannerActive(id, false) al hacer clic en Desactivar", async () => {
      mockToggleBannerActive.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const toggleBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Desactivar" });
      await user.click(toggleBtn);

      expect(mockToggleBannerActive).toHaveBeenCalledWith("banner-1", false);
    });

    it("actualiza optimistamente el badge a 'Inactivo' al desactivar", async () => {
      let resolveToggle!: (value: { success: boolean }) => void;
      mockToggleBannerActive.mockReturnValueOnce(
        new Promise((resolve) => { resolveToggle = resolve; }),
      );
      const user = userEvent.setup();
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      const toggleBtn = within(firstRow).getByRole("button", { name: "Desactivar" });
      await user.click(toggleBtn);

      await waitFor(() => {
        const badges = within(firstRow).getAllByText(/^(Activo|Inactivo)$/);
        expect(badges.some((b) => b.textContent === "Inactivo")).toBe(true);
      });

      resolveToggle({ success: true });
    });

    it("llama a toggleBannerActive(id, true) al hacer clic en Activar", async () => {
      mockToggleBannerActive.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const toggleBtn = within(rows[2] as HTMLElement).getByRole("button", { name: "Activar" });
      await user.click(toggleBtn);

      expect(mockToggleBannerActive).toHaveBeenCalledWith("banner-3", true);
    });
  });

  describe("BannerTable — Reordenamiento", () => {
    it("muestra controles de subir/bajar por banner", () => {
      render(<BannerTable banners={sampleBanners} />);

      const upButtons = screen.getAllByLabelText("Subir");
      const downButtons = screen.getAllByLabelText("Bajar");

      expect(upButtons.length).toBeGreaterThanOrEqual(sampleBanners.length);
      expect(downButtons.length).toBeGreaterThanOrEqual(sampleBanners.length);
    });

    it("llama a reorderBanners al mover un banner hacia abajo", async () => {
      mockReorderBanners.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRowDownBtn = within(rows[0] as HTMLElement).getByLabelText("Bajar");
      await user.click(firstRowDownBtn);

      expect(mockReorderBanners).toHaveBeenCalledWith([
        "banner-2",
        "banner-1",
        "banner-3",
      ]);
    });

    it("deshabilita botón 'Subir' en el primer banner", () => {
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstUpBtn = within(rows[0] as HTMLElement).getByLabelText("Subir");

      expect(firstUpBtn).toBeDisabled();
    });

    it("deshabilita botón 'Bajar' en el último banner", () => {
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const lastDownBtn = within(rows[rows.length - 1] as HTMLElement).getByLabelText("Bajar");

      expect(lastDownBtn).toBeDisabled();
    });
  });

  describe("BannerTable — Eliminar banner", () => {
    it("abre dialog de confirmación al hacer clic en Eliminar", async () => {
      const user = userEvent.setup();
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Eliminar" });
      await user.click(deleteBtn);

      expect(screen.getByText(/eliminar banner/i, { selector: "h2" })).toBeInTheDocument();
      expect(screen.getByText(/Promoción Navidad/, { selector: "strong" })).toBeInTheDocument();
    });

    it("llama a deleteBanner al confirmar eliminación", async () => {
      mockDeleteBanner.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BannerTable banners={sampleBanners} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Eliminar" });
      await user.click(deleteBtn);

      const dialogDeleteBtn = screen.getAllByRole("button", { name: /eliminar$/i })
        .find((btn) => btn.closest("[class*='fixed']"));
      await user.click(dialogDeleteBtn!);

      expect(mockDeleteBanner).toHaveBeenCalledWith("banner-1");
    });
  });

  describe("BannerTable — Vista mobile", () => {
    it("muestra botones con icono y label visible en cards mobile", () => {
      render(<BannerTable banners={sampleBanners} />);

      const mobileCards = document.querySelectorAll(".md\\:hidden > div");
      const firstCard = mobileCards[0] as HTMLElement;

      expect(within(firstCard).getByText("Editar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Desactivar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Eliminar")).toBeInTheDocument();
    });
  });

  describe("Escenario 3: BannerForm — Validación de imagen obligatoria", () => {
    it("muestra error 'La imagen es obligatoria' al enviar sin imagen", async () => {
      const user = userEvent.setup();
      render(<BannerForm />);

      const submitButton = screen.getByRole("button", { name: /crear banner/i });
      await user.click(submitButton);

      expect(screen.getByText("La imagen es obligatoria.")).toBeInTheDocument();
      expect(mockCreateBanner).not.toHaveBeenCalled();
    });

    it("muestra el formulario con campos título, subtítulo, link y toggle activo", () => {
      render(<BannerForm />);

      expect(screen.getByLabelText("Título")).toBeInTheDocument();
      expect(screen.getByLabelText("Subtítulo")).toBeInTheDocument();
      expect(screen.getByLabelText("Link destino")).toBeInTheDocument();
      expect(screen.getByText("Activo")).toBeInTheDocument();
      expect(document.getElementById("is_active")).toBeInTheDocument();
    });

    it("muestra 'Guardar cambios' en modo edición", () => {
      render(<BannerForm banner={sampleBanners[0]} />);

      expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
    });

    it("pre-carga datos del banner en modo edición", () => {
      render(<BannerForm banner={sampleBanners[0]} />);

      expect(screen.getByDisplayValue("Promoción Navidad")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Hasta 30% de descuento")).toBeInTheDocument();
      expect(screen.getByDisplayValue("/categorias/chocolate")).toBeInTheDocument();
    });

    it("no requiere imagen en modo edición cuando ya hay imagen existente", async () => {
      mockUpdateBanner.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<BannerForm banner={sampleBanners[0]} />);

      await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

      expect(screen.queryByText("La imagen es obligatoria.")).not.toBeInTheDocument();
    });

    it("muestra link 'Volver a banners'", () => {
      render(<BannerForm />);

      expect(screen.getByRole("link", { name: /volver a banners/i })).toBeInTheDocument();
    });
  });
});
