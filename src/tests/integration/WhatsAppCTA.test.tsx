import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppCTA } from "@/components/storefront/WhatsAppCTA";
import { WHATSAPP_NUMBER } from "@/lib/constants";

describe("WhatsAppCTA Component", () => {
    const productName = "Chocolate Belga 1kg";

    describe("cuando el producto está disponible (isAvailable=true)", () => {
        it("renderiza un enlace (no un botón)", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={true} />);
            expect(screen.getByRole("link")).toBeInTheDocument();
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("el enlace apunta a wa.me con el número correcto", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={true} />);
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", expect.stringContaining(`wa.me/${WHATSAPP_NUMBER}`));
        });

        it("el enlace incluye el nombre del producto encodificado en el mensaje", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={true} />);
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute(
                "href",
                expect.stringContaining(encodeURIComponent(productName)),
            );
        });

        it("abre en nueva pestaña con rel='noopener noreferrer'", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={true} />);
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("muestra el texto 'Pide por WhatsApp'", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={true} />);
            expect(screen.getByText(/pide por whatsapp/i)).toBeInTheDocument();
        });
    });

    describe("cuando el producto no está disponible (isAvailable=false)", () => {
        it("renderiza un botón deshabilitado (no un enlace)", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={false} />);
            expect(screen.getByRole("button")).toBeInTheDocument();
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });

        it("el botón tiene el atributo disabled", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={false} />);
            expect(screen.getByRole("button")).toBeDisabled();
        });

        it("el botón tiene aria-disabled='true'", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={false} />);
            expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
        });

        it("muestra texto indicando que está agotado", () => {
            render(<WhatsAppCTA productName={productName} isAvailable={false} />);
            expect(screen.getByText(/agotado/i)).toBeInTheDocument();
        });
    });

    describe("con diferentes nombres de producto", () => {
        it("incluye el nombre del producto correcto en el href", () => {
            const product = "Harina de Almendra 500g";
            render(<WhatsAppCTA productName={product} isAvailable={true} />);
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute(
                "href",
                expect.stringContaining(encodeURIComponent(product)),
            );
        });
    });
});
