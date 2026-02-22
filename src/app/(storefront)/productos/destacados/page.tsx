import type { Metadata } from "next";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductCard } from "@/components/storefront/ProductCard";
import { fetchAllFeaturedProducts } from "@/lib/supabase/queries/products";

export const metadata: Metadata = {
  title: "Lo más vendido | HGourmet",
  description:
    "Descubre los productos más populares de HGourmet. Chocolate, harinas, moldes y más insumos gourmet para repostería en Mérida.",
};

export default async function FeaturedProductsPage() {
  const products = await fetchAllFeaturedProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Lo más vendido" },
        ]}
      />

      <h1 className="font-heading text-3xl font-bold text-text">
        Lo más vendido
      </h1>
      <p className="mt-2 text-muted">
        Nuestros productos más populares entre los reposteros de Mérida.
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
            No hay productos destacados en este momento.
          </p>
        </div>
      )}
    </div>
  );
}
