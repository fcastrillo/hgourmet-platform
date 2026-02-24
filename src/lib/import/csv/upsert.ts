"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ValidatedRow } from "./types";
import { slugify } from "@/lib/slugify";

interface UpsertResult {
  created: number;
  updated: number;
  skipped: number;
}

/**
 * Upserts validated product rows into the products table.
 * Idempotency key: `sku` (clave1).
 * Rows without SKU are always inserted (no idempotency guarantee).
 *
 * Strategy:
 *   - If SKU exists → UPDATE (name, description, price, category_id, flags, updated_at)
 *   - If SKU does not exist → INSERT with a generated slug
 *   - Rows skipped due to SKU clash were already removed in validateRows()
 */
export async function upsertProducts(
  supabase: SupabaseClient,
  validatedRows: ValidatedRow[],
): Promise<UpsertResult> {
  let created = 0;
  let updated = 0;
  const skipped = 0;

  // Fetch existing SKUs that match our batch to decide insert vs update
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

  // Process in chunks to avoid hitting request limits
  const CHUNK = 50;
  const chunks = chunkArray(validatedRows, CHUNK);

  for (const chunk of chunks) {
    const inserts: Record<string, unknown>[] = [];
    const updates: Array<{ id: string; changes: Record<string, unknown> }> = [];

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
        updates.push({ id: existingSkuMap.get(data.sku)!, changes: base });
      } else {
        inserts.push({ ...base, slug: await generateSlug(supabase, data.name) });
      }
    }

    // Batch insert
    if (inserts.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from("products").insert(inserts as any);
      if (!error) created += inserts.length;
    }

    // Individual updates (Supabase doesn't support bulk update by arbitrary id list)
    for (const { id, changes } of updates) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("products")
        .update(changes)
        .eq("id", id);
      if (!error) updated++;
    }
  }

  return { created, updated, skipped };
}

async function generateSlug(
  supabase: SupabaseClient,
  name: string,
): Promise<string> {
  const base = slugify(name);
  if (!base) return `producto-${Date.now()}`;

  let candidate = base;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("slug", candidate);

    if (!count || count === 0) return candidate;
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
