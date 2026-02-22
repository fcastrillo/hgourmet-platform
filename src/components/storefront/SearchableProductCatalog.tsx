"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/storefront/SearchBar";
import { CategoryFilter } from "@/components/storefront/CategoryFilter";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { searchProducts } from "@/lib/supabase/queries/search";
import type { Product, Category, CategoryWithProductCount } from "@/types/database";

interface SearchableProductCatalogProps {
  categories: CategoryWithProductCount[];
}

export function SearchableProductCatalog({
  categories,
}: SearchableProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isActive = searchTerm.trim().length > 0 || selectedCategory !== null;

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
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
    }).then((data) => {
      if (!cancelled) {
        setResults(data);
        setIsSearching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [searchTerm, selectedCategory, isActive]);

  const activeCategories: Category[] = categories;

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  return (
    <div>
      <div className="mt-6 space-y-4">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter
          categories={activeCategories}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {!isActive ? (
        categories.length === 0 ? (
          <p className="mt-12 text-center text-muted">
            No hay categorías disponibles por el momento.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            {searchTerm.trim()
              ? ` para '${searchTerm.trim()}'`
              : ""}
            {selectedCategoryName
              ? ` en ${selectedCategoryName}`
              : ""}
            . Intenta con otro término o explora nuestras categorías.
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
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted">
            {results.length} {results.length === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
