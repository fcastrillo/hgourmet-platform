import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "@/types/database";
import { getRecipeExcerpt } from "@/lib/recipe-parser";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const excerpt = getRecipeExcerpt(recipe.content);

  return (
    <Link
      href={`/recetas/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-secondary bg-white shadow-sm transition-all hover:shadow-lg"
    >
      {/* Imagen aspect-video — Visual Invariant #3 */}
      <div className="aspect-video overflow-hidden bg-secondary/30">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Sin imagen
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        {/* Título — se vuelve dorado (primary) en hover — Visual Invariant #4 */}
        <h2 className="font-heading text-base font-bold leading-snug text-text transition-colors group-hover:text-primary md:text-lg">
          {recipe.title}
        </h2>

        {excerpt && (
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
            {excerpt}
          </p>
        )}

        {/* CTA dorado suave — Visual Invariant #3 */}
        <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          Ver receta
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
