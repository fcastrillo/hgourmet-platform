import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuickAction {
  label: string;
  href: string;
  description: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Nuevo producto",
    href: "/admin/productos/nuevo",
    description: "Agrega un SKU al catálogo",
  },
  {
    label: "Nueva receta",
    href: "/admin/recetas/nueva",
    description: "Publica una receta",
  },
  {
    label: "Nueva categoría",
    href: "/admin/categorias/nueva",
    description: "Organiza el catálogo",
  },
  {
    label: "Nueva marca",
    href: "/admin/marcas/nueva",
    description: "Registra un proveedor",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminQuickActions() {
  return (
    <section aria-label="Acciones rápidas">
      <h2 className="mb-4 font-heading text-lg font-semibold text-text">
        Acciones rápidas
      </h2>
      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        data-testid="quick-actions-grid"
      >
        {QUICK_ACTIONS.map(({ label, href, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-xl border border-secondary bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            aria-label={label}
          >
            <span className="font-heading text-sm font-semibold text-text group-hover:text-primary">
              {label}
            </span>
            <span className="mt-0.5 text-xs text-muted">{description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
