import type { Metadata } from "next";
import { SearchableProductCatalog } from "@/components/storefront/SearchableProductCatalog";
import { fetchCategoriesWithCount } from "@/lib/supabase/queries/categories";
import type { CatalogInitialFilters, PriceMode } from "@/components/storefront/SearchableProductCatalog";

export const metadata: Metadata = {
  title: "Catálogo | HGourmet",
  description:
    "Explora nuestras categorías de insumos gourmet: chocolate, harinas, moldes, sprinkles y más.",
};

interface CategoriasPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function clampPrice(value: number): number {
  return Math.max(0, Math.min(value, 1500));
}

function parseCatalogInitialFilters(
  rawSearchParams: Record<string, string | string[] | undefined> | undefined
): CatalogInitialFilters {
  const query = getSingleParam(rawSearchParams?.q)?.trim() ?? "";
  const categoryId = getSingleParam(rawSearchParams?.category) ?? null;
  const rawMode = getSingleParam(rawSearchParams?.mode);
  const priceMode: PriceMode = rawMode === "min" ? "min" : "max";

  const rawPrice = getSingleParam(rawSearchParams?.price);
  const parsedPrice =
    rawPrice && Number.isFinite(Number(rawPrice))
      ? clampPrice(Number(rawPrice))
      : undefined;

  const price = parsedPrice ?? (priceMode === "min" ? 0 : 1500);
  const rawInStock = getSingleParam(rawSearchParams?.inStock)?.toLowerCase();
  const inStock = rawInStock === "1" || rawInStock === "true";

  return {
    query,
    categoryId,
    priceMode,
    price,
    inStock,
  };
}

export default async function CategoriasPage({ searchParams }: CategoriasPageProps) {
  const categoriesWithCount = await fetchCategoriesWithCount();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialFilters = parseCatalogInitialFilters(resolvedSearchParams);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-text">
        Nuestro <span className="text-accent">Catálogo</span>
      </h1>
      <p className="mt-2 text-muted">
        Explora nuestras categorías de insumos gourmet
      </p>

      <SearchableProductCatalog
        categories={categoriesWithCount}
        initialFilters={initialFilters}
      />
    </section>
  );
}
