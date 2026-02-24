import Link from "next/link";
import type { CategoryWithProductCount } from "@/types/database";
import { CategoryImage } from "./CategoryImage";

interface CategoryCardProps {
  category: CategoryWithProductCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const productLabel =
    category.product_count === 1 ? "producto" : "productos";

  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group overflow-hidden rounded-xl border border-secondary bg-white shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
    >
      <CategoryImage
        imageUrl={category.image_url ?? null}
        slug={category.slug}
        name={category.name}
        heightClass="h-32"
      />
      <div className="p-4">
        <h2 className="font-heading text-base font-bold text-text group-hover:text-primary transition-colors">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-1 text-xs text-muted line-clamp-2">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-sm font-medium text-primary">
          {category.product_count} {productLabel}
        </p>
      </div>
    </Link>
  );
}
