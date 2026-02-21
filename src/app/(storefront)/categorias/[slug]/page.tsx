import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/ProductCard";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!category) {
    return { title: "Categoría no encontrada | HGourmet" };
  }

  return {
    title: `${category.name} | HGourmet`,
    description:
      category.description ??
      `Descubre los productos de ${category.name} en HGourmet.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!category) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_visible", true)
    .order("name", { ascending: true });

  const visibleProducts = products ?? [];
  const productLabel =
    visibleProducts.length === 1 ? "producto" : "productos";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/categorias" className="hover:text-primary transition-colors">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text">{category.name}</span>
      </nav>

      <h1 className="font-heading text-3xl font-bold text-text">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-2 text-muted">{category.description}</p>
      )}

      {visibleProducts.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted">
            No hay productos disponibles en esta categoría por el momento
          </p>
          <Link
            href="/categorias"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Ver todas las categorías
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            {visibleProducts.length} {productLabel}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
