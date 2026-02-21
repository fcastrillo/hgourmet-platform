import Link from "next/link";
import type { CategoryWithProductCount } from "@/types/database";

interface CategoryCardProps {
  category: CategoryWithProductCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const productLabel =
    category.product_count === 1 ? "producto" : "productos";

  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group rounded-lg border border-secondary bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
    >
      <h2 className="font-heading text-lg font-bold text-text group-hover:text-primary transition-colors">
        {category.name}
      </h2>
      {category.description && (
        <p className="mt-2 text-sm text-muted line-clamp-2">
          {category.description}
        </p>
      )}
      <p className="mt-3 text-sm font-medium text-primary">
        {category.product_count} {productLabel}
      </p>
    </Link>
  );
}
