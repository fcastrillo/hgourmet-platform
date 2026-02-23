import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/database";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/categorias", label: "Catálogo" },
  { href: "/recetas", label: "Recetas" },
  { href: "/contacto", label: "Contacto" },
] as const;

interface HeaderProps {
  categories: Category[];
}

export function Header({ categories }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-secondary bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="HGourmet"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/categorias"
            className="rounded-full p-2 text-text transition-colors hover:bg-secondary hover:text-primary"
            aria-label="Buscar productos"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <button
            className="rounded-full p-2 text-text transition-colors hover:bg-secondary hover:text-primary"
            aria-label="Mi cuenta"
            disabled
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
        </div>

        <MobileNav categories={categories} />
      </div>
    </header>
  );
}
