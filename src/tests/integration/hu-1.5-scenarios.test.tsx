/**
 * HU-1.5: Categorías con imagen administrable y visual homologado
 *
 * BDD Scenarios:
 *   1. Admin sube imagen y se refleja en storefront
 *   2. Categoría sin imagen usa fallback homogéneo
 *   3. Error de carga o URL rota no rompe UI
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { CategoryImage } from "@/components/storefront/CategoryImage";
import { CategoryTable } from "@/components/admin/CategoryTable";
import type { CategoryWithProductCount } from "@/types/database";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/categorias",
}));

const mockCreateCategory = vi.fn();
const mockUpdateCategory = vi.fn();
const mockDeleteCategory = vi.fn();
const mockReorderCategories = vi.fn();
const mockToggleCategoryActive = vi.fn();

vi.mock("@/app/(admin)/admin/categorias/actions", () => ({
  createCategory: (...args: unknown[]) => mockCreateCategory(...args),
  updateCategory: (...args: unknown[]) => mockUpdateCategory(...args),
  deleteCategory: (...args: unknown[]) => mockDeleteCategory(...args),
  reorderCategories: (...args: unknown[]) => mockReorderCategories(...args),
  toggleCategoryActive: (...args: unknown[]) => mockToggleCategoryActive(...args),
}));

const categoryWithImage: CategoryWithProductCount = {
  id: "cat-img",
  name: "Chocolates",
  slug: "chocolates",
  description: "Los mejores chocolates",
  image_url: "https://example.com/chocolates.jpg",
  display_order: 1,
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  product_count: 12,
};

const categoryWithoutImage: CategoryWithProductCount = {
  id: "cat-no-img",
  name: "Harinas",
  slug: "harinas",
  description: null,
  image_url: null,
  display_order: 2,
  is_active: true,
  created_at: "2026-01-02T00:00:00Z",
  product_count: 5,
};

// ─── Scenario 2: Fallback homogéneo cuando no hay imagen ─────────────────────

describe("HU-1.5 — Scenario 2: Categoría sin imagen usa fallback homogéneo", () => {
  it("CategoryCard muestra fallback (icono) cuando image_url es null", () => {
    render(<CategoryCard category={categoryWithoutImage} />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Harinas")).toBeInTheDocument();
  });

  it("CategoryShowcase muestra fallback (icono) cuando image_url es null", () => {
    render(<CategoryShowcase categories={[categoryWithoutImage]} />);
    expect(screen.getByText("Harinas")).toBeInTheDocument();
    expect(screen.queryByAltText("Harinas")).toBeNull();
  });

  it("CategoryImage renderiza el emoji fallback cuando imageUrl es null", () => {
    render(
      <CategoryImage imageUrl={null} slug="harinas" name="Harinas" />
    );
    expect(screen.queryByRole("img")).toBeNull();
    const emojiSpan = document.querySelector("[role='img'], span[aria-hidden]");
    expect(emojiSpan ?? document.querySelector("span")).toBeTruthy();
  });

  it("CategoryCard y CategoryShowcase producen el mismo comportamiento de fallback para categoría sin imagen", () => {
    const { unmount: unmountCard } = render(<CategoryCard category={categoryWithoutImage} />);
    const cardHasImg = !!document.querySelector("img");
    unmountCard();

    render(<CategoryShowcase categories={[categoryWithoutImage]} />);
    const showcaseHasImg = !!document.querySelector("img");

    expect(cardHasImg).toBe(showcaseHasImg);
  });
});

// ─── Scenario 1: Imagen real se muestra ──────────────────────────────────────

describe("HU-1.5 — Scenario 1: Imagen real se muestra en storefront", () => {
  it("CategoryCard renderiza la imagen cuando image_url está presente", () => {
    render(<CategoryCard category={categoryWithImage} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/chocolates.jpg");
    expect(img).toHaveAttribute("alt", "Chocolates");
  });

  it("CategoryShowcase renderiza la imagen cuando image_url está presente", () => {
    render(<CategoryShowcase categories={[categoryWithImage]} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/chocolates.jpg");
  });

  it("CategoryCard con imagen sigue enlazando a la ruta correcta", () => {
    render(<CategoryCard category={categoryWithImage} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categorias/chocolates");
  });

  it("CategoryShowcase con imagen muestra nombre y conteo de productos", () => {
    render(<CategoryShowcase categories={[categoryWithImage]} />);
    expect(screen.getByText("Chocolates")).toBeInTheDocument();
    expect(screen.getByText(/12 productos/i)).toBeInTheDocument();
  });
});

// ─── Scenario 3: URL rota no rompe el UI ─────────────────────────────────────

describe("HU-1.5 — Scenario 3: URL de imagen rota cae a fallback sin romper UI", () => {
  it("CategoryImage cae a fallback cuando la imagen produce un error de carga", async () => {
    render(
      <CategoryImage
        imageUrl="https://broken-url.example.com/image.jpg"
        slug="chocolates"
        name="Chocolates"
      />
    );

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();

    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.queryByRole("img")).toBeNull();
    });
  });

  it("layout no se rompe tras el error de imagen (contenedor permanece visible)", async () => {
    const { container } = render(
      <CategoryImage
        imageUrl="https://broken-url.example.com/image.jpg"
        slug="harinas"
        name="Harinas"
      />
    );

    const img = screen.getByRole("img");
    fireEvent.error(img);

    await waitFor(() => {
      expect(container.firstChild).toBeTruthy();
      expect(container.querySelector("div")).toBeTruthy();
    });
  });
});

// ─── Admin: formulario acepta imagen en crear y editar ────────────────────────

describe("HU-1.5 — Admin: CategoryFormModal acepta upload de imagen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra zona de upload de imagen en el modal de nueva categoría", async () => {
    const user = userEvent.setup();
    render(<CategoryTable categories={[categoryWithImage, categoryWithoutImage]} />);

    await user.click(screen.getByRole("button", { name: /nueva categoría/i }));

    expect(screen.getByText(/subir imagen/i)).toBeInTheDocument();
  });

  it("incluye 'image' en el FormData al enviar con archivo seleccionado", async () => {
    mockCreateCategory.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup();
    render(<CategoryTable categories={[]} />);

    // When list is empty, there are two "Nueva categoría" buttons (header + empty state CTA)
    const newBtns = screen.getAllByRole("button", { name: /nueva categoría/i });
    await user.click(newBtns[0]);
    await user.type(screen.getByLabelText(/nombre/i), "Moldes");

    const fileInput = document.querySelector<HTMLInputElement>(
      'input[type="file"]',
    );
    expect(fileInput).toBeTruthy();

    const file = new File(["(binary)"], "moldes.jpg", { type: "image/jpeg" });
    Object.defineProperty(fileInput, "files", { value: [file] });
    fireEvent.change(fileInput!);

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledTimes(1);
    });

    const formData = mockCreateCategory.mock.calls[0][0] as FormData;
    expect(formData.get("name")).toBe("Moldes");
    expect(formData.get("image")).toBeInstanceOf(File);
  });

  it("muestra preview de imagen existente al editar una categoría con image_url", async () => {
    const user = userEvent.setup();
    render(<CategoryTable categories={[categoryWithImage, categoryWithoutImage]} />);

    const desktopTable = document.querySelector("table");
    const rows = desktopTable!.querySelectorAll("tbody tr");
    const editBtn = rows[0].querySelector('[aria-label="Editar"]') as HTMLElement;
    await user.click(editBtn);

    const preview = document.querySelector('img[alt="Vista previa"]');
    expect(preview).toBeTruthy();
    expect(preview).toHaveAttribute("src", "https://example.com/chocolates.jpg");
  });

  it("incluye 'existing_image_url' en FormData al editar sin cambiar imagen", async () => {
    mockUpdateCategory.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup();
    render(<CategoryTable categories={[categoryWithImage, categoryWithoutImage]} />);

    const desktopTable = document.querySelector("table");
    const rows = desktopTable!.querySelectorAll("tbody tr");
    const editBtn = rows[0].querySelector('[aria-label="Editar"]') as HTMLElement;
    await user.click(editBtn);

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(mockUpdateCategory).toHaveBeenCalledTimes(1);
    });

    const formData = mockUpdateCategory.mock.calls[0][1] as FormData;
    expect(formData.get("existing_image_url")).toBe(
      "https://example.com/chocolates.jpg",
    );
  });
});
