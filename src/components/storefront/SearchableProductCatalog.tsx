"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/storefront/SearchBar";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { searchProducts } from "@/lib/supabase/queries/search";
import { cn } from "@/lib/utils";
import type { Product, CategoryWithProductCount } from "@/types/database";

interface SearchableProductCatalogProps {
  categories: CategoryWithProductCount[];
}

const PRICE_MAX_DEFAULT = 1500;

export function SearchableProductCatalog({
  categories,
}: SearchableProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX_DEFAULT);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isActive =
    searchTerm.trim().length > 0 ||
    selectedCategory !== null ||
    priceMax < PRICE_MAX_DEFAULT ||
    availableOnly;

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    searchProducts({
      query: searchTerm.trim() || undefined,
      categoryId: selectedCategory,
      priceMax: priceMax < PRICE_MAX_DEFAULT ? priceMax : null,
      availableOnly,
    }).then((data) => {
      if (!cancelled) {
        setResults(data);
        setIsSearching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [searchTerm, selectedCategory, priceMax, availableOnly, isActive]);

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  return (
    <div className="catalog-layout">

      {/* ── Sidebar de filtros ───────────────────────────────── */}
      <aside
        className="self-start rounded-2xl border border-secondary bg-white p-5 shadow-sm"
        aria-label="Filtros de catálogo"
      >
        <h2 className="mb-4 font-heading text-base font-semibold text-text">
          Filtros
        </h2>

        {/* Categoría */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Categoría
          </p>
          <ul className="space-y-1" role="group" aria-label="Filtrar por categoría">
            <li>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                  selectedCategory === null
                    ? "font-semibold text-accent"
                    : "text-text hover:text-primary"
                )}
                aria-pressed={selectedCategory === null}
              >
                <span
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 rounded-full border-2",
                    selectedCategory === null
                      ? "border-accent bg-accent"
                      : "border-muted bg-white"
                  )}
                />
                Todas
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )
                  }
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                    selectedCategory === cat.id
                      ? "font-semibold text-accent"
                      : "text-text hover:text-primary"
                  )}
                  aria-pressed={selectedCategory === cat.id}
                >
                  <span
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 rounded-full border-2",
                      selectedCategory === cat.id
                        ? "border-accent bg-accent"
                        : "border-muted bg-white"
                    )}
                  />
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Precio */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Precio (MXN)
          </p>
          <input
            type="range"
            min={0}
            max={PRICE_MAX_DEFAULT}
            step={50}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full accent-accent"
            aria-label="Precio máximo"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>$0</span>
            <span>
              {priceMax < PRICE_MAX_DEFAULT ? `$${priceMax}` : `$${PRICE_MAX_DEFAULT}+`}
            </span>
          </div>
        </div>

        {/* Disponibilidad */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Disponibilidad
          </p>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-text">
            {/* ADR-010: React state-driven toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={availableOnly}
              onClick={() => setAvailableOnly((v) => !v)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors",
                availableOnly ? "bg-accent" : "bg-secondary"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                  availableOnly ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
            Solo en stock
          </label>
        </div>
      </aside>

      {/* ── Área principal ───────────────────────────────────── */}
      <div className="min-w-0">
        {/* Buscador */}
        <SearchBar onSearch={handleSearch} />

        {/* Resultados */}
        <div className="mt-6">
          {!isActive ? (
            categories.length === 0 ? (
              <p className="mt-12 text-center text-muted">
                No hay categorías disponibles por el momento.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )
          ) : isSearching ? (
            <div className="mt-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-primary" />
            </div>
          ) : results.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-lg text-muted">
                No encontramos productos
                {searchTerm.trim() ? ` para '${searchTerm.trim()}'` : ""}
                {selectedCategoryName ? ` en ${selectedCategoryName}` : ""}.
                Intenta con otro término o explora nuestras categorías.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(category.id);
                    }}
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary/10"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">
                {results.length}{" "}
                {results.length === 1 ? "producto encontrado" : "productos encontrados"}
              </p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
