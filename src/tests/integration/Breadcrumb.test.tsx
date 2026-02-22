import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";

describe("Breadcrumb Component", () => {
    const items = [
        { label: "Inicio", href: "/" },
        { label: "Chocolates", href: "/categorias/chocolates" },
        { label: "Chocolate Belga 1kg" },
    ];

    it("renderiza el número correcto de ítems", () => {
        render(<Breadcrumb items={items} />);
        // 2 links + 1 span (último sin href)
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(2);
    });

    it("el primer ítem enlaza a /", () => {
        render(<Breadcrumb items={items} />);
        expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    });

    it("el segundo ítem enlaza a la categoría", () => {
        render(<Breadcrumb items={items} />);
        expect(screen.getByRole("link", { name: "Chocolates" })).toHaveAttribute(
            "href",
            "/categorias/chocolates",
        );
    });

    it("el último ítem tiene aria-current='page'", () => {
        render(<Breadcrumb items={items} />);
        expect(screen.getByText("Chocolate Belga 1kg")).toHaveAttribute(
            "aria-current",
            "page",
        );
    });

    it("el último ítem NO es un enlace", () => {
        render(<Breadcrumb items={items} />);
        const lastItem = screen.getByText("Chocolate Belga 1kg");
        expect(lastItem.tagName).toBe("SPAN");
    });

    it("el nav tiene aria-label='Breadcrumb' para accesibilidad", () => {
        render(<Breadcrumb items={items} />);
        expect(
            screen.getByRole("navigation", { name: /breadcrumb/i }),
        ).toBeInTheDocument();
    });

    it("funciona correctamente con un único ítem (solo la página actual)", () => {
        render(<Breadcrumb items={[{ label: "Inicio" }]} />);
        expect(screen.getByText("Inicio")).toHaveAttribute("aria-current", "page");
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
