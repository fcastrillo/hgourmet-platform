import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomepageHero } from "@/components/storefront/HomepageHero";

describe("Homepage", () => {
  it("renders the store name prominently", () => {
    render(<HomepageHero />);
    expect(screen.getByText("HGourmet")).toBeInTheDocument();
  });

  it("renders a CTA link to browse categories", () => {
    render(<HomepageHero />);
    const ctaLink = screen.getByRole("link", { name: /explorar catálogo/i });
    expect(ctaLink).toHaveAttribute("href", "/categorias");
  });

  it("renders a tagline or description", () => {
    render(<HomepageHero />);
    expect(
      screen.getByText(/insumos gourmet/i),
    ).toBeInTheDocument();
  });
});
