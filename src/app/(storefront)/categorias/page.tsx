import type { Metadata } from "next";
import { SearchableProductCatalog } from "@/components/storefront/SearchableProductCatalog";
import { fetchCategoriesWithCount } from "@/lib/supabase/queries/categories";

export const metadata: Metadata = {
  title: "Catálogo | HGourmet",
  description:
    "Explora nuestras categorías de insumos gourmet: chocolate, harinas, moldes, sprinkles y más.",
};

export default async function CategoriasPage() {
  const categoriesWithCount = await fetchCategoriesWithCount();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-text">
        Nuestro <span className="text-accent">Catálogo</span>
      </h1>
      <p className="mt-2 text-muted">
        Explora nuestras categorías de insumos gourmet
      </p>

      <SearchableProductCatalog categories={categoriesWithCount} />
    </section>
  );
}
