import { createClient } from "@/lib/supabase/server";
import { fetchDashboardData } from "@/lib/supabase/queries/admin-dashboard";
import { AdminKpiCards } from "@/components/admin/AdminKpiCards";
import { AdminRecentActivity } from "@/components/admin/AdminRecentActivity";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import type { DashboardData } from "@/lib/supabase/queries/admin-dashboard";

const EMPTY_DASHBOARD: DashboardData = {
  kpis: { products: 0, categories: 0, recipes: 0, brands: 0, banners: 0 },
  recentActivity: [],
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dashboardData: DashboardData = EMPTY_DASHBOARD;
  let loadError: string | null = null;

  try {
    dashboardData = await fetchDashboardData();
  } catch {
    loadError =
      "No se pudo cargar la información del dashboard. Los datos se actualizarán al recargar la página.";
  }

  const displayName = user?.email ? user.email.split("@")[0] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">
          Hola{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Panel de administración de HGourmet
        </p>
      </div>

      {/* Error banner — degradación controlada */}
      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {loadError}
        </div>
      )}

      {/* KPI Cards */}
      <AdminKpiCards kpis={dashboardData.kpis} />

      {/* Quick Actions */}
      <AdminQuickActions />

      {/* Recent Activity */}
      <AdminRecentActivity items={dashboardData.recentActivity} />
    </div>
  );
}
