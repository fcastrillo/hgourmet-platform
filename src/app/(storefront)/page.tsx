import type { Metadata } from "next";
import { HomepageHero } from "@/components/storefront/HomepageHero";
import { ProductSection } from "@/components/storefront/ProductSection";
import {
  fetchFeaturedProducts,
  fetchSeasonalProducts,
} from "@/lib/supabase/queries/products";

export const metadata: Metadata = {
  title: "HGourmet | Insumos Gourmet para Repostería en Mérida",
  description:
    "Descubre nuestra selección de chocolate, harinas, moldes, sprinkles y más. Tu tienda de insumos gourmet en Mérida.",
};

export default async function HomePage() {
  const [featuredProducts, seasonalProducts] = await Promise.all([
    fetchFeaturedProducts(),
    fetchSeasonalProducts(),
  ]);

  return (
    <>
      <HomepageHero />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductSection
          title="Lo más vendido"
          products={featuredProducts}
          viewAllHref="/productos/destacados"
        />
        <ProductSection
          title="Productos de temporada"
          products={seasonalProducts}
          viewAllHref="/productos/temporada"
        />
      </div>
    </>
  );
}
