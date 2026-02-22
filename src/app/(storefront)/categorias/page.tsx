import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SearchableProductCatalog } from "@/components/storefront/SearchableProductCatalog";
import type { Category, CategoryWithProductCount } from "@/types/database";

export const metadata: Metadata = {
  title: "Catálogo | HGourmet",
  description:
    "Explora nuestras categorías de insumos gourmet: chocolate, harinas, moldes, sprinkles y más.",
};

interface CategoryWithProducts extends Category {
  products: { count: number }[];
}

async function fetchCategoriesWithCount(): Promise<CategoryWithProductCount[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*, products(count)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const categories = (data as CategoryWithProducts[] | null) ?? [];
  return categories.map((cat) => ({
    ...cat,
    product_count: cat.products?.[0]?.count ?? 0,
  }));
}

export default async function CategoriasPage() {
  const categoriesWithCount = await fetchCategoriesWithCount();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-text">Catálogo</h1>
      <p className="mt-2 text-muted">
        Explora nuestras categorías de insumos gourmet
      </p>

      <SearchableProductCatalog categories={categoriesWithCount} />
    </section>
  );
}
