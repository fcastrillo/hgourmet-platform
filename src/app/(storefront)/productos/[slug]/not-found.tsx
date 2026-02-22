import Link from "next/link";

export default function ProductNotFound() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <p className="text-5xl" aria-hidden="true">
                🔍
            </p>
            <h1 className="mt-4 font-heading text-2xl font-bold text-text">
                Producto no encontrado
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted">
                El producto que buscas no existe o ya no está disponible en nuestro
                catálogo.
            </p>
            <Link
                href="/categorias"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
                Ver todas las categorías
            </Link>
        </div>
    );
}
