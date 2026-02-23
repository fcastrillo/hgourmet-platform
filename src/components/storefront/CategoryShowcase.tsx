import Link from "next/link";
import type { CategoryWithProductCount } from "@/types/database";

const CATEGORY_ICONS: Record<string, string> = {
  chocolate: "🍫",
  harinas: "🌾",
  moldes: "🧁",
  sprinkles: "✨",
  colorantes: "🎨",
  fondant: "🎂",
  empaques: "📦",
  utensilios: "🍴",
};

function getCategoryIcon(slug: string): string {
  return CATEGORY_ICONS[slug] ?? "🛒";
}

interface CategoryShowcaseProps {
  categories: CategoryWithProductCount[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16">
      <h2 className="text-center font-heading text-3xl font-bold text-text">
        Nuestras <span className="text-primary">Categorías</span>
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
              className="group flex flex-col items-center rounded-xl border border-secondary bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <span className="text-4xl" role="img" aria-hidden="true">
                {getCategoryIcon(category.slug)}
              </span>
              <h3 className="mt-3 font-heading text-sm font-semibold text-text transition-colors group-hover:text-primary sm:text-base">
                {category.name}
              </h3>
              <p className="mt-1 text-xs text-muted">
                {category.product_count} {productLabel}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
