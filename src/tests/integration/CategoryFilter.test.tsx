import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "@/components/storefront/CategoryFilter";
import type { Category } from "@/types/database";

const mockCategories: Category[] = [
  {
    id: "c1",
    name: "Chocolates",
    slug: "chocolates",
    description: null,
    display_order: 1,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c2",
    name: "Moldes",
    slug: "moldes",
    description: null,
    display_order: 2,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c3",
    name: "Accesorios",
    slug: "accesorios",
    description: null,
    display_order: 3,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];

describe("CategoryFilter", () => {
  it("renders 'Todas' button plus one button per category", () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedId={null}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("Todas")).toBeInTheDocument();
    expect(screen.getByText("Chocolates")).toBeInTheDocument();
    expect(screen.getByText("Moldes")).toBeInTheDocument();
    expect(screen.getByText("Accesorios")).toBeInTheDocument();
  });

  it("marks 'Todas' as pressed when selectedId is null", () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedId={null}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("Todas")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Chocolates")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("marks the selected category as pressed", () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedId="c2"
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("Todas")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Moldes")).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onSelect(null) when 'Todas' is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedId="c1"
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText("Todas"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("calls onSelect with category id when a category chip is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedId={null}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText("Moldes"));
    expect(onSelect).toHaveBeenCalledWith("c2");
  });

  it("has accessible group label", () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedId={null}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByRole("group", { name: "Filtrar por categoría" })
    ).toBeInTheDocument();
  });
});
