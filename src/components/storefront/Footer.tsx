import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS, STORE_INFO } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Image
              src="/images/logo.png"
              alt="HGourmet"
              width={180}
              height={60}
              className="h-15 w-auto brightness-0 invert"
            />
            <p className="mt-2 text-sm text-white/80">
              {STORE_INFO.tagline}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {STORE_INFO.city}
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/categorias" className="text-sm text-white/80 hover:text-white">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-white/80 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider">
              Síguenos
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-sm text-white/80 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-sm text-white/80 hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-sm text-white/80 hover:text-white"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-6 text-center text-xs text-white/60">
          © {currentYear} {STORE_INFO.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
