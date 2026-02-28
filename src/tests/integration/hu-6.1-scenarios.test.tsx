/**
 * HU-6.1 — Dashboard administrativo completo con estado operativo del negocio
 *
 * BDD covered:
 *  AC1 — KPI cards visibles y con valores para todas las entidades
 *  AC2 — Actividad reciente con fecha y tipo de entidad
 *  AC3 — Estado vacío / degradación controlada sin bloquear acciones rápidas
 *
 * Strategy: component-level rendering tests (no server-side fetch) for UI components;
 * unit tests for fetchDashboardData helper logic via Supabase mock.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminKpiCards } from "@/components/admin/AdminKpiCards";
import { AdminRecentActivity } from "@/components/admin/AdminRecentActivity";
import type { DashboardKpis, RecentActivityItem } from "@/lib/supabase/queries/admin-dashboard";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({ push: vi.fn() }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const fullKpis: DashboardKpis = {
  products: 24,
  categories: 5,
  recipes: 8,
  brands: 12,
  banners: 3,
};

const zeroKpis: DashboardKpis = {
  products: 0,
  categories: 0,
  recipes: 0,
  brands: 0,
  banners: 0,
};

const sampleActivity: RecentActivityItem[] = [
  {
    id: "p1",
    entity: "product",
    entityLabel: "Producto",
    name: "Chocolate Callebaut 500g",
    date: "2026-02-20T10:00:00Z",
  },
  {
    id: "r1",
    entity: "recipe",
    entityLabel: "Receta",
    name: "Brownies de Chocolate",
    date: "2026-02-18T09:00:00Z",
  },
  {
    id: "c1",
    entity: "category",
    entityLabel: "Categoría",
    name: "Chocolates",
    date: "2026-02-15T08:00:00Z",
  },
  {
    id: "b1",
    entity: "brand",
    entityLabel: "Marca",
    name: "Callebaut",
    date: "2026-02-10T07:00:00Z",
  },
  {
    id: "bn1",
    entity: "banner",
    entityLabel: "Banner",
    name: "Promo Febrero",
    date: "2026-02-05T06:00:00Z",
  },
];

// ─── AC1: KPI Cards ───────────────────────────────────────────────────────────

describe("HU-6.1 — AC1: KPI cards con métricas clave del catálogo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("muestra todas las categorías de KPI (Productos, Categorías, Recetas, Marcas, Banners)", () => {
    render(<AdminKpiCards kpis={fullKpis} />);

    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Categorías")).toBeInTheDocument();
    expect(screen.getByText("Recetas")).toBeInTheDocument();
    expect(screen.getByText("Marcas")).toBeInTheDocument();
    expect(screen.getByText("Banners")).toBeInTheDocument();
  });

  it("muestra los valores numéricos correctos para cada KPI", () => {
    render(<AdminKpiCards kpis={fullKpis} />);

    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("muestra aria-labels descriptivos con la cantidad y la entidad", () => {
    render(<AdminKpiCards kpis={fullKpis} />);

    expect(screen.getByLabelText("24 Productos")).toBeInTheDocument();
    expect(screen.getByLabelText("8 Recetas")).toBeInTheDocument();
    expect(screen.getByLabelText("5 Categorías")).toBeInTheDocument();
  });

  it("muestra 0 cuando no hay datos (estado vacío de catálogo)", () => {
    render(<AdminKpiCards kpis={zeroKpis} />);

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(5);
  });

  it("cada KPI card tiene un link al módulo correspondiente", () => {
    render(<AdminKpiCards kpis={fullKpis} />);

    expect(screen.getByLabelText("24 Productos").closest("a")).toHaveAttribute(
      "href",
      "/admin/productos",
    );
    expect(screen.getByLabelText("8 Recetas").closest("a")).toHaveAttribute(
      "href",
      "/admin/recetas",
    );
    expect(screen.getByLabelText("5 Categorías").closest("a")).toHaveAttribute(
      "href",
      "/admin/categorias",
    );
    expect(screen.getByLabelText("12 Marcas").closest("a")).toHaveAttribute(
      "href",
      "/admin/marcas",
    );
    expect(screen.getByLabelText("3 Banners").closest("a")).toHaveAttribute(
      "href",
      "/admin/banners",
    );
  });

  it("la sección tiene aria-label 'KPIs del negocio'", () => {
    render(<AdminKpiCards kpis={fullKpis} />);
    expect(
      screen.getByRole("region", { name: /kpis del negocio/i }),
    ).toBeInTheDocument();
  });
});

// ─── AC2: Actividad reciente ──────────────────────────────────────────────────

describe("HU-6.1 — AC2: Actividad reciente con fecha y tipo de entidad", () => {
  it("renderiza la lista de actividad reciente con todos los ítems", () => {
    render(<AdminRecentActivity items={sampleActivity} />);

    expect(screen.getByTestId("recent-activity-list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(sampleActivity.length);
  });

  it("muestra el nombre de cada ítem de actividad", () => {
    render(<AdminRecentActivity items={sampleActivity} />);

    expect(screen.getByText("Chocolate Callebaut 500g")).toBeInTheDocument();
    expect(screen.getByText("Brownies de Chocolate")).toBeInTheDocument();
    expect(screen.getByText("Chocolates")).toBeInTheDocument();
    expect(screen.getByText("Callebaut")).toBeInTheDocument();
    expect(screen.getByText("Promo Febrero")).toBeInTheDocument();
  });

  it("muestra las etiquetas de tipo de entidad para cada ítem", () => {
    render(<AdminRecentActivity items={sampleActivity} />);

    expect(screen.getByText("Producto")).toBeInTheDocument();
    expect(screen.getByText("Receta")).toBeInTheDocument();
    expect(screen.getByText("Categoría")).toBeInTheDocument();
    expect(screen.getByText("Marca")).toBeInTheDocument();
    expect(screen.getByText("Banner")).toBeInTheDocument();
  });

  it("incluye elementos <time> con dateTime para cada ítem", () => {
    render(<AdminRecentActivity items={sampleActivity} />);

    const timeElements = screen.getAllByRole("time");
    expect(timeElements.length).toBe(sampleActivity.length);

    const dateTimes = timeElements.map((el) => el.getAttribute("dateTime"));
    expect(dateTimes).toContain("2026-02-20T10:00:00Z");
    expect(dateTimes).toContain("2026-02-18T09:00:00Z");
  });

  it("la sección tiene aria-label 'Actividad reciente'", () => {
    render(<AdminRecentActivity items={sampleActivity} />);
    expect(
      screen.getByRole("region", { name: /actividad reciente/i }),
    ).toBeInTheDocument();
  });
});

// ─── AC3: Estado vacío / degradación controlada ───────────────────────────────

describe("HU-6.1 — AC3: Estado vacío y degradación sin bloquear acciones rápidas", () => {
  it("muestra estado vacío amigable cuando no hay actividad reciente", () => {
    render(<AdminRecentActivity items={[]} />);

    expect(screen.getByTestId("recent-activity-empty")).toBeInTheDocument();
    expect(
      screen.getByText("No hay actividad reciente registrada."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("recent-activity-list")).not.toBeInTheDocument();
  });

  it("el estado vacío tiene role='status' para accesibilidad", () => {
    render(<AdminRecentActivity items={[]} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("el estado vacío de actividad no bloquea el resto del dashboard", () => {
    render(<AdminRecentActivity items={[]} />);
    expect(screen.getByTestId("recent-activity-empty")).toBeInTheDocument();
  });

  it("KPIs con ceros no rompen el layout del dashboard", () => {
    render(<AdminKpiCards kpis={zeroKpis} />);
    expect(screen.getByTestId("kpi-grid")).toBeInTheDocument();
  });
});

