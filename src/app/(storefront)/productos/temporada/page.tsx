import type { Metadata } from "next";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductCard } from "@/components/storefront/ProductCard";
import { fetchAllSeasonalProducts } from "@/lib/supabase/queries/products";

export const metadata: Metadata = {
  title: "Productos de temporada | HGourmet",
  description:
    "Explora nuestros productos de temporada. Ingredientes y accesorios especiales para cada época del año en HGourmet, Mérida.",
};

export default async function SeasonalProductsPage() {
  const products = await fetchAllSeasonalProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Productos de temporada" },
        ]}
      />

      <h1 className="font-heading text-3xl font-bold text-text">
        Productos de temporada
      </h1>
      <p className="mt-2 text-muted">
        Ingredientes y accesorios especiales para cada época del año.
      </p>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted">
            No hay productos de temporada en este momento.
          </p>
        </div>
      )}
    </div>
  );
}
