import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const mockSignInWithOtp = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
    },
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
}));

vi.mock("@/app/(admin)/admin/actions", () => ({
  signOut: vi.fn(),
}));

describe("HU-2.1 — Autenticación de administradoras", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Escenario 1: Solicitar Magic Link", () => {
    it("muestra campo de email y botón de envío", () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /enviar enlace/i })).toBeInTheDocument();
    });

    it("envía OTP al ingresar email válido y muestra confirmación", async () => {
      mockSignInWithOtp.mockResolvedValueOnce({ error: null });
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/correo electrónico/i), "admin@hgourmet.com");
      await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: "admin@hgourmet.com",
        options: {
          emailRedirectTo: expect.stringContaining("/auth/callback"),
        },
      });

      expect(await screen.findByText(/revisa tu correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByText("admin@hgourmet.com")).toBeInTheDocument();
    });
  });

  describe("Escenario 3: Cerrar sesión", () => {
    it("muestra botón de cerrar sesión en el sidebar con el email del usuario", () => {
      render(<AdminSidebar userEmail="admin@hgourmet.com" />);

      expect(screen.getByText("admin@hgourmet.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeInTheDocument();
    });

    it("muestra la navegación del panel de administración", () => {
      render(<AdminSidebar userEmail="admin@hgourmet.com" />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Productos")).toBeInTheDocument();
      expect(screen.getByText("Categorías")).toBeInTheDocument();
      expect(screen.getByText("Banners")).toBeInTheDocument();
      expect(screen.getByText("Marcas")).toBeInTheDocument();
    });
  });

  describe("Escenario 4: Acceso no autorizado (middleware)", () => {
    it("el middleware helper exporta updateSession para proteger rutas", async () => {
      const middleware = await import("@/lib/supabase/middleware");
      expect(middleware.updateSession).toBeDefined();
      expect(typeof middleware.updateSession).toBe("function");
    });
  });

  describe("Escenario 5: Email no registrado (error)", () => {
    it("muestra el mismo mensaje de confirmación sin revelar si el email existe", async () => {
      mockSignInWithOtp.mockResolvedValueOnce({ error: null });
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/correo electrónico/i), "noexiste@email.com");
      await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

      expect(await screen.findByText(/revisa tu correo electrónico/i)).toBeInTheDocument();
    });

    it("muestra error cuando el servicio de OTP falla", async () => {
      mockSignInWithOtp.mockResolvedValueOnce({
        error: new Error("Rate limit exceeded"),
      });
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/correo electrónico/i), "admin@hgourmet.com");
      await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

      expect(await screen.findByText(/ocurrió un error/i)).toBeInTheDocument();
    });

    it("muestra error de enlace expirado cuando llega con ?error=auth", () => {
      render(<LoginForm authError />);

      expect(screen.getByText(/enlace de acceso es inválido/i)).toBeInTheDocument();
    });
  });

  describe("LoginForm — interacciones adicionales", () => {
    it("permite volver a ingresar otro email después de enviar", async () => {
      mockSignInWithOtp.mockResolvedValueOnce({ error: null });
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/correo electrónico/i), "admin@hgourmet.com");
      await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

      await screen.findByText(/revisa tu correo electrónico/i);
      await user.click(screen.getByText(/usar otro correo/i));

      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    });

    it("muestra estado de loading al enviar", async () => {
      mockSignInWithOtp.mockReturnValue(new Promise(() => {}));
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/correo electrónico/i), "admin@hgourmet.com");
      await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

      expect(screen.getByText(/enviando enlace/i)).toBeInTheDocument();
    });
  });
});
