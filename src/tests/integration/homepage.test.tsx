import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BannerCarousel } from "@/components/storefront/BannerCarousel";
import type { Banner } from "@/types/database";

const makeBanner = (overrides: Partial<Banner> = {}): Banner => ({
  id: "banner-1",
  title: "Oferta especial",
  subtitle: "Solo por hoy",
  image_url: "/images/banner-test.jpg",
  link_url: null,
  is_active: true,
  display_order: 1,
  created_at: new Date().toISOString(),
  ...overrides,
});

// ── BDD: Escenario 1 — Hero visible siempre (sin banners) ──────────────────
describe("BannerCarousel — Hero solo (sin banners)", () => {
  it("renders the store logo with accessible alt text", () => {
    render(<BannerCarousel banners={[]} />);
    expect(screen.getByAltText("HGourmet")).toBeInTheDocument();
  });

  it("renders the aspirational headline", () => {
    render(<BannerCarousel banners={[]} />);
    expect(screen.getByText(/ingredientes/i)).toBeInTheDocument();
    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<BannerCarousel banners={[]} />);
    expect(screen.getByText(/hagamos magia/i)).toBeInTheDocument();
  });

  it("renders a CTA link to browse the catalog", () => {
    render(<BannerCarousel banners={[]} />);
    const ctaLink = screen.getByRole("link", {
      name: /explora nuestro catálogo/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/categorias");
  });

  it("does NOT render navigation arrows when no banners", () => {
    render(<BannerCarousel banners={[]} />);
    expect(
      screen.queryByRole("button", { name: /slide anterior/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /slide siguiente/i })
    ).not.toBeInTheDocument();
  });
});

// ── BDD: Escenario 2 — Hero + banners activos con controles ───────────────
describe("BannerCarousel — Hero + banners activos", () => {
  it("renders navigation arrows when there are active banners", () => {
    render(<BannerCarousel banners={[makeBanner()]} />);
    expect(
      screen.getByRole("button", { name: /slide anterior/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /slide siguiente/i })
    ).toBeInTheDocument();
  });

  it("renders dot indicators equal to (1 hero + N banners) when there are banners", () => {
    const banners = [makeBanner({ id: "b1" }), makeBanner({ id: "b2" })];
    render(<BannerCarousel banners={banners} />);
    // 1 hero + 2 banners = 3 dots
    const dots = screen.getAllByRole("button", { name: /ir al slide/i });
    expect(dots).toHaveLength(3);
  });

  it("hero slide is shown first (headline visible on initial render)", () => {
    render(<BannerCarousel banners={[makeBanner()]} />);
    expect(screen.getByText(/ingredientes/i)).toBeInTheDocument();
  });
});

// ── BDD: Escenario 3 — Sección "¿Por qué elegirnos?" ─────────────────────
describe("WhyChooseSection — Bloque de confianza", () => {
  it("is importable without errors", async () => {
    const { WhyChooseSection } = await import(
      "@/components/storefront/WhyChooseSection"
    );
    render(<WhyChooseSection />);
    expect(
      screen.getByRole("heading", { name: /por qué elegirnos/i })
    ).toBeInTheDocument();
  });

  it("renders exactly 3 trust cards", async () => {
    const { WhyChooseSection } = await import(
      "@/components/storefront/WhyChooseSection"
    );
    render(<WhyChooseSection />);
    // Each card has an h3 heading
    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards).toHaveLength(3);
  });
});
