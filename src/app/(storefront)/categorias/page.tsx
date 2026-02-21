import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryCard } from "@/components/storefront/CategoryCard";
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

      {categoriesWithCount.length === 0 ? (
        <p className="mt-12 text-center text-muted">
          No hay categorías disponibles por el momento.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesWithCount.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
