import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchPublishedRecipeBySlug } from "@/lib/supabase/queries/recipes";
import { getRecipeSections } from "@/lib/recipe-content";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";

interface RecetaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RecetaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await fetchPublishedRecipeBySlug(slug);

  if (!recipe) {
    return { title: "Receta no encontrada | HGourmet" };
  }

  return {
    title: `${recipe.title} | HGourmet`,
    description: `Aprende a preparar ${recipe.title} con ingredientes gourmet de HGourmet.`,
    openGraph: {
      title: `${recipe.title} | HGourmet`,
      description: `Aprende a preparar ${recipe.title} con ingredientes gourmet de HGourmet.`,
      images: recipe.image_url ? [{ url: recipe.image_url }] : [],
    },
  };
}

export default async function RecetaDetailPage({
  params,
}: RecetaDetailPageProps) {
  const { slug } = await params;
  const recipe = await fetchPublishedRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const sections = getRecipeSections(recipe);

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Recetas", href: "/recetas" },
    { label: recipe.title },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* Breadcrumb — Visual Invariant #5 */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero image panorámica con bordes redondeados — Visual Invariant #6 */}
      {recipe.image_url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Título */}
      <h1 className="font-heading mb-8 text-2xl font-bold leading-tight text-text md:text-4xl">
        {recipe.title}
      </h1>

      {sections.map((section, i) => {
        /* Sección Ingredientes — Visual Invariant #7 */
        if (section.type === "ingredientes") {
          return (
            <section key={i} className="mb-8">
              <h2 className="font-heading mb-4 text-xl font-bold text-primary">
                Ingredientes
              </h2>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-sm md:text-base"
                  >
                    {/* CheckCircle icon — h-4/w-4 (ADR-006: no arbitrary px in Tailwind 4) */}
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      width={16}
                      height={16}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        /* Sección Preparación con pasos numerados — Visual Invariant #7 y #8 */
        if (section.type === "preparacion") {
          return (
            <section key={i} className="mb-8">
              <h2 className="font-heading mb-4 text-xl font-bold text-primary">
                Preparación
              </h2>
              <ol className="space-y-4">
                {section.steps.map((step, j) => (
                  <li key={j} className="flex gap-4">
                    {/* Círculo numerado dorado — Visual Invariant #8 */}
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {j + 1}
                    </span>
                    <p className="text-sm leading-relaxed md:text-base">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          );
        }

        /* Card Tip HGourmet — Visual Invariant #9 */
        if (section.type === "tip") {
          return (
            <div
              key={i}
              className="mb-8 flex gap-3 rounded-xl border border-primary/30 bg-primary/10 p-5"
            >
              {/* Lightbulb icon — h-5/w-5 (ADR-006: no arbitrary px in Tailwind 4) */}
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                width={20}
                height={20}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
              <div>
                <p className="font-semibold text-primary">Tip HGourmet</p>
                <p className="mt-1 text-sm leading-relaxed">{section.text}</p>
              </div>
            </div>
          );
        }

        /* Fallback: bloque de texto genérico */
        return (
          <div
            key={i}
            className="mb-8 whitespace-pre-wrap text-sm leading-relaxed text-text md:text-base"
          >
            {section.content}
          </div>
        );
      })}

      {/* CTA final centrado — Visual Invariant #10 */}
      <div className="mt-10 text-center">
        <Link
          href="/recetas"
          className="inline-flex items-center gap-2 rounded-xl border border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          ← Ver todas las recetas
        </Link>
      </div>
    </article>
  );
}
