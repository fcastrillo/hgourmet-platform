import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryNotFound } from "@/components/storefront/CategoryNotFound";

describe("BDD Scenario 5: Categoría inactiva no visible — 404 Page", () => {
  it("shows a friendly not-found message", () => {
    render(<CategoryNotFound />);
    expect(
      screen.getByText(/categoría no encontrada/i),
    ).toBeInTheDocument();
  });

  it("provides a link back to the categories listing", () => {
    render(<CategoryNotFound />);
    const link = screen.getByRole("link", { name: /ver todas las categorías/i });
    expect(link).toHaveAttribute("href", "/categorias");
  });

  it("shows an informative description", () => {
    render(<CategoryNotFound />);
    expect(
      screen.getByText(
        /la categoría que buscas no existe o ya no está disponible/i,
      ),
    ).toBeInTheDocument();
  });
});
