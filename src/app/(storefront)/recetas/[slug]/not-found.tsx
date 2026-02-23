import Link from "next/link";

export default function RecetaNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-text">
        Receta no encontrada
      </h1>
      <p className="mt-3 text-muted">
        Esta receta no está disponible o no existe.
      </p>
      <Link
        href="/recetas"
        className="mt-6 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        Volver a recetas
      </Link>
    </div>
  );
}
