import type { RecentActivityItem } from "@/lib/supabase/queries/admin-dashboard";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENTITY_BADGE_CLASSES: Record<string, string> = {
  product: "bg-blue-100 text-blue-700",
  category: "bg-green-100 text-green-700",
  recipe: "bg-amber-100 text-amber-700",
  brand: "bg-purple-100 text-purple-700",
  banner: "bg-pink-100 text-pink-700",
};

const DEFAULT_BADGE = "bg-gray-100 text-gray-700";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  items: RecentActivityItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminRecentActivity({ items }: Props) {
  return (
    <section aria-label="Actividad reciente">
      <h2 className="mb-4 font-heading text-lg font-semibold text-text">
        Actividad reciente
      </h2>

      {items.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-secondary bg-white p-8 text-center text-sm text-muted"
          role="status"
          data-testid="recent-activity-empty"
        >
          No hay actividad reciente registrada.
        </div>
      ) : (
        <ul
          className="divide-y divide-secondary rounded-xl border border-secondary bg-white shadow-sm"
          data-testid="recent-activity-list"
        >
          {items.map((item) => (
            <li
              key={`${item.entity}-${item.id}`}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ENTITY_BADGE_CLASSES[item.entity] ?? DEFAULT_BADGE}`}
              >
                {item.entityLabel}
              </span>
              <span className="flex-1 truncate text-sm text-text">
                {item.name}
              </span>
              <time dateTime={item.date} className="shrink-0 text-xs text-muted">
                {formatDate(item.date)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
