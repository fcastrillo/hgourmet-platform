import Link from "next/link";
import type { Product } from "@/types/database";
import { ProductCard } from "./ProductCard";

interface ProductSectionProps {
  title: string;
  accentWord?: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductSection({
  title,
  accentWord,
  products,
  viewAllHref,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  const renderTitle = () => {
    if (!accentWord) return title;
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="text-accent">{accentWord}</span>
        {parts[1] ?? ""}
      </>
    );
  };

  return (
    <section className="py-12">
      <div className="relative mb-8 text-center">
        <h2 className="font-heading text-3xl font-bold text-text">
          {renderTitle()}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Ver todos →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
