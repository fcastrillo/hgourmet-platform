import Link from "next/link";

export function HomepageHero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
      <h1 className="font-heading text-5xl font-bold text-text sm:text-6xl">
        HGourmet
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">
        Tu tienda de insumos gourmet para repostería en Mérida. Chocolate,
        harinas, moldes y todo lo que necesitas para crear.
      </p>
      <Link
        href="/categorias"
        className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-heading text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
      >
        Explorar catálogo
      </Link>
    </section>
  );
}
