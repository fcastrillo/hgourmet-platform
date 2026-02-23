import type { Metadata } from "next";
import { HomepageHero } from "@/components/storefront/HomepageHero";
import { BannerCarousel } from "@/components/storefront/BannerCarousel";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { ProductSection } from "@/components/storefront/ProductSection";
import { BrandSection } from "@/components/storefront/BrandSection";
import {
  fetchFeaturedProducts,
  fetchSeasonalProducts,
} from "@/lib/supabase/queries/products";
import { fetchActiveBanners } from "@/lib/supabase/queries/banners";
import { fetchActiveBrands } from "@/lib/supabase/queries/brands";
import { fetchCategoriesWithCount } from "@/lib/supabase/queries/categories";

export const metadata: Metadata = {
  title: "HGourmet | Insumos Gourmet para Repostería en Mérida",
  description:
    "Descubre nuestra selección de chocolate, harinas, moldes, sprinkles y más. Tu tienda de insumos gourmet en Mérida.",
};

export default async function HomePage() {
  const [
    featuredProducts,
    seasonalProducts,
    activeBanners,
    activeBrands,
    categoriesWithCount,
  ] = await Promise.all([
    fetchFeaturedProducts(),
    fetchSeasonalProducts(),
    fetchActiveBanners(),
    fetchActiveBrands(),
    fetchCategoriesWithCount(),
  ]);

  return (
    <>
      {activeBanners.length > 0 ? (
        <BannerCarousel banners={activeBanners} />
      ) : (
        <HomepageHero />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryShowcase categories={categoriesWithCount} />
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
        <BrandSection brands={activeBrands} />
      </div>
    </>
  );
}
