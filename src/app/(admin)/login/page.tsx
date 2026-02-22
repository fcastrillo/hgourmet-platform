import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — Panel de Administración",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authError = params.error === "auth";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">HGourmet</h1>
          <p className="mt-2 text-sm text-muted">Panel de Administración</p>
        </div>

        <div className="rounded-xl border border-secondary bg-white p-6 shadow-sm">
          <LoginForm authError={authError} />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Solo personal autorizado. Si necesitas acceso, contacta a la administradora.
        </p>
      </div>
    </div>
  );
}
