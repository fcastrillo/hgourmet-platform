import type { Metadata } from "next";
import Link from "next/link";
import { fetchPublishedRecipes } from "@/lib/supabase/queries/recipes";
import { RecipeCard } from "@/components/storefront/RecipeCard";

export const metadata: Metadata = {
  title: "Recetas & Tips | HGourmet",
  description:
    "Inspírate con nuestras recetas elaboradas con ingredientes gourmet seleccionados.",
};

export default async function RecetasPage() {
  const recipes = await fetchPublishedRecipes();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      {/* Encabezado centrado — Visual Invariant #1 */}
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Recetas &amp; <span className="text-accent">Tips</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Inspírate con nuestras recetas elaboradas con ingredientes gourmet
          seleccionados.
        </p>
      </div>

      {recipes.length === 0 ? (
        /* Estado vacío */
        <div className="mt-12 text-center">
          <p className="text-muted">
            No hay recetas publicadas por el momento.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      ) : (
        /* Grid responsive 1/2/3 — Visual Invariant #2 */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
