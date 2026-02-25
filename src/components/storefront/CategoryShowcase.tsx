import Link from "next/link";
import type { CategoryWithProductCount } from "@/types/database";
import { CategoryImage } from "./CategoryImage";

interface CategoryShowcaseProps {
  categories: CategoryWithProductCount[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-text">
        Nuestras <span className="text-accent">Categorías</span>
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-muted">
        Encuentra todo lo que necesitas para tus creaciones
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const productLabel =
            category.product_count === 1 ? "producto" : "productos";

          return (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group overflow-hidden rounded-xl border border-secondary bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <CategoryImage
                imageUrl={category.image_url ?? null}
                slug={category.slug}
                name={category.name}
                heightClass="h-28"
              />
              <div className="p-3 text-center">
                <h3 className="font-heading text-sm font-semibold text-text transition-colors group-hover:text-primary sm:text-base">
                  {category.name}
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  {category.product_count} {productLabel}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
