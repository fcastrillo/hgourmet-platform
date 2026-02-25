"use client";

import { useState } from "react";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";

type FormState = "idle" | "sent" | "blocked";

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(
  name: string,
  phone: string,
  email: string,
  message: string,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "El nombre es obligatorio.";
  if (!phone.trim()) errors.phone = "El teléfono es obligatorio.";
  if (email.trim() && !EMAIL_RE.test(email)) {
    errors.email = "El email no tiene un formato válido.";
  }
  if (!message.trim()) errors.message = "El mensaje es obligatorio.";
  return errors;
}

// ─── WhatsApp icon (small) ────────────────────────────────────────────────────

function WhatsAppIconSm() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      width={20}
      height={20}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Sent state (honest confirmation — not "message sent") ───────────────────

function SentMessage({ fallbackUrl }: { fallbackUrl: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(37,211,102,0.12)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 shrink-0"
          width={28}
          height={28}
          style={{ color: "#25D366" }}
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>
      <p className="text-lg font-semibold text-text">¡Abrimos WhatsApp!</p>
      <p className="mt-2 text-sm text-muted">
        Si no se abrió automáticamente, usa el enlace directo.
      </p>
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#25D366" }}
      >
        <WhatsAppIconSm />
        Abrir WhatsApp
      </a>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormState>("idle");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  if (status === "sent") {
    return <SentMessage fallbackUrl={whatsappUrl} />;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate(name, phone, email, message);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const url = buildContactWhatsAppUrl({
      name,
      phone,
      email: email.trim() || undefined,
      message,
    });
    setWhatsappUrl(url);

    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened === null) {
      setStatus("blocked");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-xl font-bold text-text">
        Envíanos un mensaje
      </h2>

      {status === "blocked" && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Tu navegador bloqueó la apertura de WhatsApp. Puedes{" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            abrir el enlace directamente
          </a>{" "}
          o intentarlo de nuevo.
        </div>
      )}

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
            <p id="name-error" role="alert" className="text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-phone"
            className="block text-sm font-medium text-text"
          >
            Teléfono
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Tu número de teléfono"
            aria-describedby={errors.phone ? "phone-error" : undefined}
            aria-invalid={!!errors.phone}
            className="w-full rounded-xl border px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email — optional */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-text"
          >
            Email{" "}
            <span className="font-normal text-muted">(opcional)</span>
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
            <p id="email-error" role="alert" className="text-xs text-red-600">
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

        {/* Submit — ADR-006: inline style for WhatsApp green */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75"
          style={{ backgroundColor: "#25D366" }}
        >
          <WhatsAppIconSm />
          Enviar por WhatsApp
        </button>
      </form>
    </div>
  );
}
