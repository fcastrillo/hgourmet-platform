"use client";

import { useState } from "react";

type FormState = "idle" | "success";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "El nombre es obligatorio.";
  if (!email.trim()) {
    errors.email = "El email es obligatorio.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "El email no tiene un formato válido.";
  }
  if (!message.trim()) errors.message = "El mensaje es obligatorio.";
  return errors;
}

// ─── Success state ───────────────────────────────────────────────────────────

function SuccessMessage() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 text-accent"
          width={28}
          height={28}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53-1.857-1.857a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.14-.094l3.733-5.267z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-lg font-semibold text-text">¡Mensaje enviado!</p>
      <p className="mt-2 text-sm text-muted">
        Nos pondremos en contacto contigo pronto.
      </p>
    </div>
  );
}

// ─── Form ────────────────────────────────────────────────────────────────────

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormState>("idle");

  if (status === "success") {
    return <SuccessMessage />;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate(name, email, message);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus("success");
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-xl font-bold text-text">
        Envíanos un mensaje
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-text"
          >
            Nombre
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            className="w-full rounded-xl border px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-text"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            className="w-full rounded-xl border px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-text"
          >
            Mensaje
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="¿En qué podemos ayudarte?"
            rows={5}
            aria-describedby={errors.message ? "message-error" : undefined}
            aria-invalid={!!errors.message}
            className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          {errors.message && (
            <p
              id="message-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit — ADR-006: inline style for accent brand color */}
        <button
          type="submit"
          className="w-full rounded-xl py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75"
          style={{ backgroundColor: "#C9A84C" }}
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}
