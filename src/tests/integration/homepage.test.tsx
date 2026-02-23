import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomepageHero } from "@/components/storefront/HomepageHero";

describe("Homepage Hero", () => {
  it("renders the store logo with accessible alt text", () => {
    render(<HomepageHero />);
    expect(screen.getByAltText("HGourmet")).toBeInTheDocument();
  });

  it("renders the aspirational headline", () => {
    render(<HomepageHero />);
    expect(screen.getByText(/ingredientes/i)).toBeInTheDocument();
    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<HomepageHero />);
    expect(screen.getByText(/hagamos magia/i)).toBeInTheDocument();
  });

  it("renders a CTA link to browse the catalog", () => {
    render(<HomepageHero />);
    const ctaLink = screen.getByRole("link", {
      name: /explora nuestro catálogo/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/categorias");
  });

  it("renders a background hero image as decorative", () => {
    render(<HomepageHero />);
    const heroImg = screen.getByRole("presentation");
    expect(heroImg).toBeInTheDocument();
  });
});
