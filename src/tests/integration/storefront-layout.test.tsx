import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { WhatsAppFloatingButton } from "@/components/storefront/WhatsAppFloatingButton";

const mockCategories = [
  { id: "1", name: "Chocolate", slug: "chocolate", description: null, display_order: 1, is_active: true, created_at: "" },
  { id: "2", name: "Harinas", slug: "harinas", description: null, display_order: 2, is_active: true, created_at: "" },
  { id: "3", name: "Moldes", slug: "moldes", description: null, display_order: 3, is_active: true, created_at: "" },
];

describe("Storefront Header", () => {
  it("renders the store logo with accessible alt text", () => {
    render(<Header categories={mockCategories} />);
    expect(screen.getByAltText("HGourmet")).toBeInTheDocument();
  });

  it("renders 4 main navigation links (Inicio, Catálogo, Recetas, Contacto)", () => {
    render(<Header categories={mockCategories} />);
    const mainNav = screen.getByRole("navigation", { name: /principal/i });
    expect(within(mainNav).getByRole("link", { name: /inicio/i })).toHaveAttribute("href", "/");
    expect(within(mainNav).getByRole("link", { name: /catálogo/i })).toHaveAttribute("href", "/categorias");
    expect(within(mainNav).getByRole("link", { name: /recetas/i })).toHaveAttribute("href", "/recetas");
    expect(within(mainNav).getByRole("link", { name: /contacto/i })).toHaveAttribute("href", "/contacto");
  });

  it("renders search and user icon buttons", () => {
    render(<Header categories={mockCategories} />);
    expect(screen.getByLabelText(/buscar productos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mi cuenta/i)).toBeInTheDocument();
  });

  it("does not render category links in the desktop nav", () => {
    render(<Header categories={mockCategories} />);
    const mainNav = screen.getByRole("navigation", { name: /principal/i });
    expect(within(mainNav).queryByRole("link", { name: /chocolate/i })).not.toBeInTheDocument();
    expect(within(mainNav).queryByRole("link", { name: /harinas/i })).not.toBeInTheDocument();
  });
});

describe("WhatsApp Floating Button — presencia global (HU-3.1)", () => {
  it("renders a wa.me link with accessible label when URL is valid", () => {
    render(<WhatsAppFloatingButton whatsappUrl="https://wa.me/525550682072" />);
    const link = screen.getByRole("link", { name: /contactar por whatsapp/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("renders nothing and does not crash when URL is invalid", () => {
    const { container } = render(<WhatsAppFloatingButton whatsappUrl="" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Storefront Footer", () => {
  it("renders the store logo and tagline", () => {
    render(<Footer />);
    expect(screen.getByAltText("HGourmet")).toBeInTheDocument();
    expect(screen.getByText(/proveedora de productos/i)).toBeInTheDocument();
  });

  it("renders social media links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
  });
});
