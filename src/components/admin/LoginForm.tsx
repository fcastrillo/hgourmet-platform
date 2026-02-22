"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FormState = "idle" | "loading" | "success" | "error";

export function LoginForm({ authError }: { authError?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>(authError ? "error" : "idle");
  const [errorMessage, setErrorMessage] = useState(
    authError ? "El enlace de acceso es inválido o ha expirado. Solicita uno nuevo." : ""
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setState("error");
      setErrorMessage("Ocurrió un error al enviar el enlace. Intenta de nuevo.");
      return;
    }

    setState("success");
  }

  if (state === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg
            className="h-8 w-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="mb-2 font-heading text-xl font-semibold text-text">
          Revisa tu correo electrónico
        </h2>
        <p className="mb-6 text-sm text-muted">
          Te enviamos un enlace de acceso a <strong className="text-text">{email}</strong>.
          Haz clic en el enlace para iniciar sesión.
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setEmail("");
          }}
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-text">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full rounded-lg border border-secondary bg-white px-4 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {state === "error" && errorMessage && (
        <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-lg bg-primary px-4 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "loading" ? "Enviando enlace..." : "Enviar enlace de acceso"}
      </button>
    </form>
  );
}
