import Link from "next/link";
import type { Product } from "@/types/database";
import { ProductCard } from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductSection({
  title,
  products,
  viewAllHref,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-text">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Ver todos
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
