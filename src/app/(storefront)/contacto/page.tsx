import type { Metadata } from "next";
import { ContactForm } from "@/components/storefront/ContactForm";
import { SOCIAL_LINKS, STORE_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto | HGourmet — Mérida",
  description:
    "Visítanos o escríbenos. HGourmet: insumos gourmet para repostería en Mérida, Yucatán.",
  openGraph: {
    title: "Contacto | HGourmet",
    description: "Escríbenos o visítanos en nuestra tienda en Mérida, Yucatán.",
  },
};

// ─── Inline SVG icons (ADR-011: standard classes + native width/height) ────────

function MapPinIcon({ large = false }: { large?: boolean }) {
  const size = large ? 24 : 18;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={large ? "h-6 w-6" : "h-4 w-4"}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

const INFO_ITEMS = [
  {
    label: "Dirección",
    value: STORE_INFO.address,
    icon: <MapPinIcon />,
    href: null as string | null,
  },
  {
    label: "Teléfono",
    value: STORE_INFO.phone,
    icon: <PhoneIcon />,
    href: `tel:${STORE_INFO.phone}`,
  },
  {
    label: "Email",
    value: STORE_INFO.email,
    icon: <MailIcon />,
    href: `mailto:${STORE_INFO.email}`,
  },
  {
    label: "Horario",
    value: STORE_INFO.hours,
    icon: <ClockIcon />,
    href: null,
  },
] as const;

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      {/* Page heading */}
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Contáctanos
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Estamos para ayudarte. Escríbenos o visítanos en nuestra tienda en
          Mérida.
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── Left: contact info + map + social ─────────────────── */}
        <div className="space-y-8">
          {/* Contact info list */}
          <ul className="space-y-5" aria-label="Información de contacto">
            {INFO_ITEMS.map((item) => (
              <li key={item.label} className="flex gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-accent"
                  style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-text">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-0.5 text-sm text-muted transition-colors hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Map placeholder */}
          <div
            className="flex h-52 w-full flex-col items-center justify-center gap-3 rounded-xl border bg-muted/20 text-muted"
            aria-label="Mapa de ubicación"
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-accent"
              style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
            >
              <MapPinIcon large />
            </span>
            <p className="text-sm font-medium">Mapa de ubicación</p>
            <p className="text-xs text-muted/70">{STORE_INFO.address}</p>
          </div>

          {/* Social buttons — ADR-006: inline style for brand colors */}
          <div className="flex flex-wrap gap-3">
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "#ffffff" }}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Facebook de HGourmet"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1877F2", color: "#ffffff" }}
            >
              <FacebookIcon />
              Facebook
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Instagram de HGourmet"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)",
                color: "#ffffff",
              }}
            >
              <InstagramIcon />
              Instagram
            </a>
          </div>
        </div>

        {/* ── Right: contact form ────────────────────────────────── */}
        <ContactForm />
      </div>
    </div>
  );
}
