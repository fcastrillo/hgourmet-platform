import Link from "next/link";

export function CategoryNotFound() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
      <h1 className="font-heading text-4xl font-bold text-text">
        Categoría no encontrada
      </h1>
      <p className="mt-4 max-w-md text-muted">
        La categoría que buscas no existe o ya no está disponible.
      </p>
      <Link
        href="/categorias"
        className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        Ver todas las categorías
      </Link>
    </section>
  );
}
