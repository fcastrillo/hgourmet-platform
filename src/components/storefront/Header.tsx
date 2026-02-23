import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/database";
import { MobileNav } from "./MobileNav";

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

        <nav className="hidden items-center gap-6 md:flex" aria-label="Categorías">
          <Link
            href="/categorias"
            className="text-sm font-medium text-text transition-colors hover:text-primary"
          >
            Catálogo
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="text-sm font-medium text-text transition-colors hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <MobileNav categories={categories} />
      </div>
    </header>
  );
}
