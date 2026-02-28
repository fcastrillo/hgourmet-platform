import Link from "next/link";
import type { DashboardKpis } from "@/lib/supabase/queries/admin-dashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KpiConfig {
  key: keyof DashboardKpis;
  label: string;
  href: string;
  description: string;
}

interface Props {
  kpis: DashboardKpis;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const KPI_CONFIG: KpiConfig[] = [
  {
    key: "products",
    label: "Productos",
    href: "/admin/productos",
    description: "SKUs en catálogo",
  },
  {
    key: "categories",
    label: "Categorías",
    href: "/admin/categorias",
    description: "Categorías del catálogo",
  },
  {
    key: "recipes",
    label: "Recetas",
    href: "/admin/recetas",
    description: "Recetas en el portal",
  },
  {
    key: "brands",
    label: "Marcas",
    href: "/admin/marcas",
    description: "Marcas y proveedores",
  },
  {
    key: "banners",
    label: "Banners",
    href: "/admin/banners",
    description: "Banners promocionales",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminKpiCards({ kpis }: Props) {
  return (
    <section aria-label="KPIs del negocio">
      <h2 className="mb-4 font-heading text-lg font-semibold text-text">
        Estado del catálogo
      </h2>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        data-testid="kpi-grid"
      >
        {KPI_CONFIG.map(({ key, label, href, description }) => (
          <Link
            key={key}
            href={href}
            className="group flex flex-col rounded-xl border border-secondary bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            aria-label={`${kpis[key]} ${label}`}
          >
            <span className="text-3xl font-bold text-primary">
              {kpis[key]}
            </span>
            <span className="mt-1 font-heading text-base font-semibold text-text group-hover:text-primary">
              {label}
            </span>
            <span className="mt-0.5 text-xs text-muted">{description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
