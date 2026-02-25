import type { Brand } from "@/types/database";

interface BrandSectionProps {
  brands: Brand[];
}

export function BrandSection({ brands }: BrandSectionProps) {
  if (brands.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-text">
          Nuestras <span className="text-primary">Marcas</span>
        </h2>
        <p className="mt-2 text-sm text-muted">
          Trabajamos con las mejores marcas del mundo repostero
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {brands.map((brand) => (
          <div key={brand.id} className="group flex flex-col items-center gap-2">
            {brand.logo_url ? (
              <a
                href={brand.website_url ?? undefined}
                target={brand.website_url ? "_blank" : undefined}
                rel={brand.website_url ? "noopener noreferrer" : undefined}
                className="flex h-20 w-20 items-center justify-center rounded-xl border border-secondary bg-white p-3 shadow-sm transition-all group-hover:shadow-md sm:h-24 sm:w-24"
              >
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain opacity-70 transition-opacity group-hover:opacity-100"
                />
              </a>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-secondary bg-white p-3 shadow-sm sm:h-24 sm:w-24">
                <span className="text-center text-xs font-medium text-muted">
                  {brand.name}
                </span>
              </div>
            )}
            <span className="text-xs font-medium text-muted">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
