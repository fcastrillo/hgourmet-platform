"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/types/database";

interface MobileNavProps {
  categories: Category[];
}

export function MobileNav({ categories }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>

      {isOpen && (
        <nav
          className="absolute left-0 top-full w-full border-b border-secondary bg-white shadow-lg"
          aria-label="Menú móvil"
        >
          <div className="flex flex-col px-4 py-4">
            <Link
              href="/categorias"
              onClick={() => setIsOpen(false)}
              className="py-3 text-sm font-medium text-text transition-colors hover:text-primary"
            >
              Ver todo el catálogo
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                onClick={() => setIsOpen(false)}
                className="border-t border-secondary/50 py-3 text-sm font-medium text-text transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
