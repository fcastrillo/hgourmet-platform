import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardKpis {
  products: number;
  categories: number;
  recipes: number;
  brands: number;
  banners: number;
}

export type EntityType = "product" | "category" | "recipe" | "brand" | "banner";

export interface RecentActivityItem {
  id: string;
  entity: EntityType;
  entityLabel: string;
  name: string;
  date: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  recentActivity: RecentActivityItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ENTITY_LABELS: Record<EntityType, string> = {
  product: "Producto",
  category: "Categoría",
  recipe: "Receta",
  brand: "Marca",
  banner: "Banner",
};

const RECENT_ACTIVITY_LIMIT = 5;
const DASHBOARD_ACTIVITY_MAX = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function fetchCount(client: SupabaseClient, table: string): Promise<number> {
  const { count } = await client
    .from(table)
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

type RawActivityRow = {
  id: string;
  name?: string | null;
  title?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

function toActivityItem(entity: EntityType, raw: RawActivityRow): RecentActivityItem {
  return {
    id: raw.id,
    entity,
    entityLabel: ENTITY_LABELS[entity],
    name: raw.name ?? raw.title ?? "(sin nombre)",
    date: raw.updated_at ?? raw.created_at ?? "",
  };
}

// ─── Main query ───────────────────────────────────────────────────────────────

export async function fetchDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const [products, categories, recipes, brands, banners] = await Promise.all([
    fetchCount(supabase, "products"),
    fetchCount(supabase, "categories"),
    fetchCount(supabase, "recipes"),
    fetchCount(supabase, "brands"),
    fetchCount(supabase, "banners"),
  ]);

  const [
    recentProducts,
    recentCategories,
    recentRecipes,
    recentBrands,
    recentBanners,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false })
      .limit(RECENT_ACTIVITY_LIMIT),
    supabase
      .from("categories")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(RECENT_ACTIVITY_LIMIT),
    supabase
      .from("recipes")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(RECENT_ACTIVITY_LIMIT),
    supabase
      .from("brands")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(RECENT_ACTIVITY_LIMIT),
    supabase
      .from("banners")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(RECENT_ACTIVITY_LIMIT),
  ]);

  const recentActivity: RecentActivityItem[] = [
    ...(recentProducts.data ?? []).map((r) => toActivityItem("product", r as RawActivityRow)),
    ...(recentCategories.data ?? []).map((r) => toActivityItem("category", r as RawActivityRow)),
    ...(recentRecipes.data ?? []).map((r) => toActivityItem("recipe", r as RawActivityRow)),
    ...(recentBrands.data ?? []).map((r) => toActivityItem("brand", r as RawActivityRow)),
    ...(recentBanners.data ?? []).map((r) => toActivityItem("banner", r as RawActivityRow)),
  ]
    .filter((item) => item.date !== "")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, DASHBOARD_ACTIVITY_MAX);

  return {
    kpis: { products, categories, recipes, brands, banners },
    recentActivity,
  };
}
