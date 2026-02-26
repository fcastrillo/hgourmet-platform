"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ValidatedRow, RowIssue } from "./types";
import { slugify } from "@/lib/slugify";

export interface UpsertResult {
  created: number;
  updated: number;
  /** DB-level issues (DB_INSERT_ERROR / DB_UPDATE_ERROR) with sourceRow for traceability. */
  issues: RowIssue[];
}

/**
 * Upserts validated product rows into the products table using a best-effort strategy.
 * Idempotency key: `sku` (clave1).
 *
 * Strategy:
 *   - If SKU exists → UPDATE row; on failure, record DB_UPDATE_ERROR and continue.
 *   - If SKU does not exist → batch INSERT chunk; if the batch fails, fall back to
 *     per-row inserts so valid rows are rescued and each failed row gets a DB_INSERT_ERROR.
 *   - Slug collisions within the same batch are prevented via a local in-memory cache.
 */
export async function upsertProducts(
  supabase: SupabaseClient,
  validatedRows: ValidatedRow[],
): Promise<UpsertResult> {
  let created = 0;
  let updated = 0;
  const issues: RowIssue[] = [];

  // Local slug cache to prevent intra-batch slug collisions without extra DB queries.
  const slugCache = new Set<string>();

  // Fetch existing SKUs that match our batch to decide insert vs update.
  const skusInBatch = validatedRows
    .map((r) => r.data.sku)
    .filter((s): s is string => s !== null);

  const existingSkuMap = new Map<string, string>(); // sku -> product.id

  if (skusInBatch.length > 0) {
    const { data: existing } = await supabase
      .from("products")
      .select("id, sku")
      .in("sku", skusInBatch);

    for (const row of existing ?? []) {
      const r = row as { id: string; sku: string };
      if (r.sku) existingSkuMap.set(r.sku, r.id);
    }
  }

  const CHUNK = 50;
  const chunks = chunkArray(validatedRows, CHUNK);

  for (const chunk of chunks) {
    const insertsQueue: Array<{ sourceRow: number; payload: Record<string, unknown> }> = [];
    const updatesQueue: Array<{ sourceRow: number; id: string; changes: Record<string, unknown> }> = [];

    for (const row of chunk) {
      const { data } = row;
      const base = {
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        sku: data.sku,
        barcode: data.barcode,
        sat_code: data.sat_code,
        is_available: data.is_available,
        is_featured: data.is_featured,
        is_seasonal: data.is_seasonal,
        is_visible: true,
        updated_at: new Date().toISOString(),
      };

      if (data.sku && existingSkuMap.has(data.sku)) {
        updatesQueue.push({
          sourceRow: row.sourceRow,
          id: existingSkuMap.get(data.sku)!,
          changes: base,
        });
      } else {
        const slug = await generateSlug(supabase, data.name, slugCache);
        insertsQueue.push({ sourceRow: row.sourceRow, payload: { ...base, slug } });
      }
    }

    // Attempt batch insert; fall back to per-row on failure to rescue valid rows.
    if (insertsQueue.length > 0) {
      const payloads = insertsQueue.map((i) => i.payload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: batchError } = await supabase.from("products").insert(payloads as any);

      if (!batchError) {
        created += insertsQueue.length;
      } else {
        // Fallback: insert row by row to rescue valid rows and record individual failures.
        for (const { sourceRow, payload } of insertsQueue) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: rowError } = await supabase.from("products").insert([payload] as any);
          if (!rowError) {
            created++;
          } else {
            issues.push({
              sourceRow,
              code: "DB_INSERT_ERROR",
              detail: `Error al insertar producto: ${rowError.message}`,
            });
          }
        }
      }
    }

    // Updates are always per-row (Supabase doesn't support bulk update by id list).
    for (const { sourceRow, id, changes } of updatesQueue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("products")
        .update(changes)
        .eq("id", id);
      if (!error) {
        updated++;
      } else {
        issues.push({
          sourceRow,
          code: "DB_UPDATE_ERROR",
          detail: `Error al actualizar producto: ${error.message}`,
        });
      }
    }
  }

  return { created, updated, issues };
}

/**
 * Generates a unique slug checking both the local in-memory cache (intra-batch)
 * and the DB (cross-batch). The cache prevents multiple DB round-trips for the
 * same base slug within a single import run.
 */
async function generateSlug(
  supabase: SupabaseClient,
  name: string,
  slugCache: Set<string>,
): Promise<string> {
  const base = slugify(name);
  if (!base) {
    const fallback = `producto-${Date.now()}`;
    slugCache.add(fallback);
    return fallback;
  }

  let candidate = base;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!slugCache.has(candidate)) {
      const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("slug", candidate);

      if (!count || count === 0) {
        slugCache.add(candidate);
        return candidate;
      }
    }
    suffix++;
    candidate = `${base}-${suffix}`;
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}
