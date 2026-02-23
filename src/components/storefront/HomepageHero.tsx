import Link from "next/link";
import Image from "next/image";

export function HomepageHero() {
  return (
    <section className="relative h-[500px] sm:h-[600px]">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <Image
          src="/images/logo.png"
          alt="HGourmet"
          width={160}
          height={80}
          className="mb-6 h-20 w-auto brightness-0 invert"
        />
        <h1 className="font-heading text-4xl font-bold sm:text-6xl">
          Ingredientes <span className="text-accent">premium</span> para tus
          creaciones
        </h1>
        <p className="mt-4 max-w-lg text-lg text-white/80">
          Hagamos magia, hagamos repostería
        </p>
        <Link
          href="/categorias"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 font-heading text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
        >
          Explora nuestro catálogo
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
