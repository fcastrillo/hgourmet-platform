import type { Metadata } from "next";
import { HomepageHero } from "@/components/storefront/HomepageHero";

export const metadata: Metadata = {
  title: "HGourmet | Insumos Gourmet para Repostería en Mérida",
  description:
    "Descubre nuestra selección de chocolate, harinas, moldes, sprinkles y más. Tu tienda de insumos gourmet en Mérida.",
};

export default function HomePage() {
  return <HomepageHero />;
}
