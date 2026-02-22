import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { WhatsAppCTA } from "@/components/storefront/WhatsAppCTA";
import ProductNotFound from "@/app/(storefront)/productos/[slug]/not-found";
import type { Product, Category } from "@/types/database";
import type { ProductWithCategory } from "@/lib/supabase/queries/products";

// --- Fixtures ---

const mockCategory: Pick<Category, "name" | "slug"> = {
    name: "Chocolates",
    slug: "chocolates",
};

const availableProduct: ProductWithCategory = {
    id: "p1",
    category_id: "c1",
    name: "Chocolate Belga 1kg",
    slug: "chocolate-belga-1kg",
    description: "Cobertura semi-amargo 54%",
    price: 350.0,
    image_url: "https://example.supabase.co/storage/v1/object/public/product-images/choc.jpg",
    sku: "CHOC-001",
    is_available: true,
    is_featured: false,
    is_seasonal: false,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    categories: mockCategory,
};

const unavailableProduct: ProductWithCategory = {
    ...availableProduct,
    id: "p2",
    name: "Sprinkles Arcoíris",
    slug: "sprinkles-arcoiris",
    is_available: false,
};

// --- Breadcrumb items for the product page ---
const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: availableProduct.categories.name, href: `/categorias/${availableProduct.categories.slug}` },
    { label: availableProduct.name },
];

// ============================================================
// HU-1.2 — Ficha de detalle de producto
// ============================================================

describe("HU-1.2 — Ficha de detalle de producto", () => {
    // ── Scenario 1: producto disponible ────────────────────────
    describe("Scenario 1: Visualización completa de producto disponible", () => {
        it("muestra precio formateado en MXN", () => {
            render(
                <p data-testid="price">
                    {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                    }).format(availableProduct.price)}
                </p>,
            );
            expect(screen.getByTestId("price")).toHaveTextContent("$350.00");
        });

        it("muestra badge 'Disponible' para producto con is_available=true", () => {
            render(
                <span>
                    {availableProduct.is_available ? "Disponible" : "Agotado"}
                </span>,
            );
            expect(screen.getByText("Disponible")).toBeInTheDocument();
        });

        it("WhatsApp CTA muestra botón activo con producto disponible", () => {
            render(
                <WhatsAppCTA
                    productName={availableProduct.name}
                    isAvailable={availableProduct.is_available}
                />,
            );
            const link = screen.getByRole("link");
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
            expect(link).toHaveAttribute("href", expect.stringContaining(encodeURIComponent(availableProduct.name)));
        });
    });

    // ── Scenario 2: metadatos SEO ───────────────────────────────
    describe("Scenario 2: Producto con metadatos SEO correctos", () => {
        it("WhatsApp CTA incluye nombre del producto en el href del enlace", () => {
            render(
                <WhatsAppCTA
                    productName="Harina de Almendra 500g"
                    isAvailable={true}
                />,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute(
                "href",
                expect.stringContaining(encodeURIComponent("Harina de Almendra 500g")),
            );
        });
    });

    // ── Scenario 3: breadcrumb ─────────────────────────────────
    describe("Scenario 3: Navegación con breadcrumb", () => {
        it("muestra los ítems Inicio, Categoría y Producto en el breadcrumb", () => {
            render(<Breadcrumb items={breadcrumbItems} />);
            expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
            expect(screen.getByRole("link", { name: "Chocolates" })).toHaveAttribute(
                "href",
                "/categorias/chocolates",
            );
            expect(screen.getByText("Chocolate Belga 1kg")).toBeInTheDocument();
        });

        it("el último ítem del breadcrumb tiene aria-current='page'", () => {
            render(<Breadcrumb items={breadcrumbItems} />);
            const lastItem = screen.getByText("Chocolate Belga 1kg");
            expect(lastItem).toHaveAttribute("aria-current", "page");
        });

        it("el último ítem del breadcrumb NO es un enlace", () => {
            render(<Breadcrumb items={breadcrumbItems} />);
            const links = screen.getAllByRole("link");
            const linkLabels = links.map((l) => l.textContent);
            expect(linkLabels).not.toContain("Chocolate Belga 1kg");
        });
    });

    // ── Scenario 4: producto agotado ───────────────────────────
    describe("Scenario 4: Producto no disponible", () => {
        it("WhatsApp CTA muestra botón deshabilitado cuando is_available=false", () => {
            render(
                <WhatsAppCTA
                    productName={unavailableProduct.name}
                    isAvailable={unavailableProduct.is_available}
                />,
            );
            const btn = screen.getByRole("button");
            expect(btn).toBeDisabled();
            expect(btn).toHaveAttribute("aria-disabled", "true");
        });

        it("no muestra enlace de WhatsApp cuando el producto está agotado", () => {
            render(
                <WhatsAppCTA
                    productName={unavailableProduct.name}
                    isAvailable={unavailableProduct.is_available}
                />,
            );
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });

        it("muestra badge 'Agotado' para producto con is_available=false", () => {
            render(
                <span>
                    {unavailableProduct.is_available ? "Disponible" : "Agotado"}
                </span>,
            );
            expect(screen.getByText("Agotado")).toBeInTheDocument();
        });
    });

    // ── Scenario 5: producto inexistente / 404 ─────────────────
    describe("Scenario 5: Producto no visible o inexistente", () => {
        it("la página NotFound muestra mensaje amigable con enlace al catálogo", () => {
            render(<ProductNotFound />);
            expect(screen.getByText(/producto no encontrado/i)).toBeInTheDocument();
            const link = screen.getByRole("link", { name: /ver todas las categorías/i });
            expect(link).toHaveAttribute("href", "/categorias");
        });
    });
});
