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
  initialFilters?: CatalogInitialFilters;
}

const PRICE_MAX_DEFAULT = 1500;
const PRICE_MIN_DEFAULT = 0;

export type PriceMode = "max" | "min";

export interface CatalogInitialFilters {
  query?: string;
  categoryId?: string | null;
  price?: number;
  priceMode?: PriceMode;
  inStock?: boolean;
}

function clampPrice(value: number): number {
  if (Number.isNaN(value)) {
    return PRICE_MAX_DEFAULT;
  }

  return Math.min(Math.max(value, PRICE_MIN_DEFAULT), PRICE_MAX_DEFAULT);
}

function sanitizeInitialFilters(initialFilters?: CatalogInitialFilters) {
  const query = initialFilters?.query?.trim() ?? "";
  const categoryId = initialFilters?.categoryId ?? null;
  const inStock = Boolean(initialFilters?.inStock);
  const priceMode: PriceMode =
    initialFilters?.priceMode === "min" ? "min" : "max";

  const rawPrice =
    typeof initialFilters?.price === "number"
      ? clampPrice(initialFilters.price)
      : null;

  const defaultPrice =
    priceMode === "min" ? PRICE_MIN_DEFAULT : PRICE_MAX_DEFAULT;

  const price = rawPrice ?? defaultPrice;

  return { query, categoryId, inStock, priceMode, price };
}

export function SearchableProductCatalog({
  categories,
  initialFilters,
}: SearchableProductCatalogProps) {
  const sanitizedInitialFilters = sanitizeInitialFilters(initialFilters);

  const [searchTerm, setSearchTerm] = useState(sanitizedInitialFilters.query);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    sanitizedInitialFilters.categoryId
  );
  const [priceMode, setPriceMode] = useState<PriceMode>(
    sanitizedInitialFilters.priceMode
  );
  const [priceValue, setPriceValue] = useState<number>(
    sanitizedInitialFilters.price
  );
  const [availableOnly, setAvailableOnly] = useState(
    sanitizedInitialFilters.inStock
  );
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (
      selectedCategory &&
      !categories.some((category) => category.id === selectedCategory)
    ) {
      setSelectedCategory(null);
    }
  }, [categories, selectedCategory]);

  const isPriceFilterActive =
    priceMode === "min"
      ? priceValue > PRICE_MIN_DEFAULT
      : priceValue < PRICE_MAX_DEFAULT;

  const isActive =
    searchTerm.trim().length > 0 ||
    selectedCategory !== null ||
    isPriceFilterActive ||
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
      priceMin: priceMode === "min" && priceValue > PRICE_MIN_DEFAULT ? priceValue : null,
      priceMax: priceMode === "max" && priceValue < PRICE_MAX_DEFAULT ? priceValue : null,
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
  }, [searchTerm, selectedCategory, priceMode, priceValue, availableOnly, isActive]);

  useEffect(() => {
    const params = new URLSearchParams();

    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm.length > 0) {
      params.set("q", trimmedSearchTerm);
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (priceMode === "min") {
      params.set("mode", "min");
      if (priceValue > PRICE_MIN_DEFAULT) {
        params.set("price", String(priceValue));
      }
    } else if (priceValue < PRICE_MAX_DEFAULT) {
      params.set("mode", "max");
      params.set("price", String(priceValue));
    }

    if (availableOnly) {
      params.set("inStock", "1");
    }

    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${window.location.pathname}?${nextSearch}`
      : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, [searchTerm, selectedCategory, priceMode, priceValue, availableOnly]);

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;
  const sliderValue =
    priceMode === "min" ? PRICE_MAX_DEFAULT - priceValue : priceValue;

  return (
    <div
      style={
        isDesktop
          ? {
              display: "grid",
              gridTemplateColumns: "13rem 1fr",
              gap: "1.5rem",
              marginTop: "2rem",
              alignItems: "start",
            }
          : { marginTop: "2rem" }
      }
    >

      {/* ── Sidebar de filtros ───────────────────────────────── */}
      <aside
        className="rounded-2xl border border-secondary bg-white p-5 shadow-sm"
        style={isDesktop ? {} : { marginBottom: "1.5rem" }}
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
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setPriceMode("max");
                if (priceValue === PRICE_MIN_DEFAULT) {
                  setPriceValue(PRICE_MAX_DEFAULT);
                }
              }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none",
                priceMode === "max"
                  ? "border-transparent bg-accent text-white"
                  : "border-secondary bg-white text-text hover:bg-secondary/20"
              )}
              aria-pressed={priceMode === "max"}
            >
              Hasta
            </button>
            <button
              type="button"
              onClick={() => {
                setPriceMode("min");
                if (priceValue === PRICE_MAX_DEFAULT) {
                  setPriceValue(PRICE_MIN_DEFAULT);
                }
              }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none",
                priceMode === "min"
                  ? "border-transparent bg-accent text-white"
                  : "border-secondary bg-white text-text hover:bg-secondary/20"
              )}
              aria-pressed={priceMode === "min"}
            >
              Desde
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={PRICE_MAX_DEFAULT}
            step={50}
            value={sliderValue}
            onChange={(e) => {
              const rawValue = Number(e.target.value);
              setPriceValue(
                priceMode === "min"
                  ? PRICE_MAX_DEFAULT - rawValue
                  : rawValue
              );
            }}
            className="w-full"
            style={{
              accentColor: "#C9A84C",
              transform: priceMode === "min" ? "scaleX(-1)" : undefined,
            }}
            aria-label={priceMode === "min" ? "Precio mínimo" : "Precio máximo"}
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>
              {priceMode === "min" ? `$${priceValue}` : "$0"}
            </span>
            <span>
              {priceMode === "max"
                ? priceValue < PRICE_MAX_DEFAULT
                  ? `$${priceValue}`
                  : `$${PRICE_MAX_DEFAULT}+`
                : `$${PRICE_MAX_DEFAULT}+`}
            </span>
          </div>
        </div>

        {/* Disponibilidad */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Disponibilidad
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={availableOnly}
            onClick={() => setAvailableOnly((v) => !v)}
            className="flex cursor-pointer items-center gap-3 text-sm text-text focus:outline-none"
          >
            <span
              className={cn(
                "relative inline-flex h-6 w-10 shrink-0 rounded-full transition-colors",
                availableOnly ? "bg-accent" : "bg-secondary/50"
              )}
              aria-hidden="true"
            >
              <span
                className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{
                  transform: availableOnly ? "translateX(16px)" : "translateX(0px)",
                }}
              />
            </span>
            Solo en stock
          </button>
        </div>
      </aside>

      {/* ── Área principal ───────────────────────────────────── */}
      <div className="min-w-0">
        {/* Buscador */}
        <SearchBar onSearch={handleSearch} initialValue={sanitizedInitialFilters.query} />

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
