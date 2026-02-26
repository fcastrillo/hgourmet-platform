"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { parseCsvText } from "@/lib/import/csv/parseCsv";
import { validateRows } from "@/lib/import/csv/validators";
import { upsertProducts } from "@/lib/import/csv/upsert";
import { persistStagingBatch, loadMappingRules } from "@/lib/import/csv/staging";
import type { ImportSummary } from "@/lib/import/csv/types";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateProductPaths() {
  revalidatePath("/admin/productos");
  revalidatePath("/categorias", "layout");
  revalidatePath("/");
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

async function uploadProductImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<string | null> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return null;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return null;
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(fileName);

  return publicUrl;
}

async function deleteProductImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string,
): Promise<void> {
  const parts = imageUrl.split("/product-images/");
  if (parts.length < 2) return;
  const filePath = parts[1];
  await supabase.storage.from("product-images").remove([filePath]);
}

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  excludeId?: string,
): Promise<string> {
  const baseSlug = slugify(name);
  if (baseSlug.length === 0) return "";

  let candidate = baseSlug;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("slug", candidate);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { count } = await query;

    if (!count || count === 0) return candidate;

    suffix++;
    candidate = `${baseSlug}-${suffix}`;
  }
}

export async function createProduct(
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string | null;
  const description =
    (formData.get("description") as string | null) || null;
  const priceStr = formData.get("price") as string | null;
  const categoryId = formData.get("category_id") as string | null;
  const sku = (formData.get("sku") as string | null) || null;
  const imageFile = formData.get("image") as File | null;
  const isAvailable = formData.get("is_available") === "true";
  const isFeatured = formData.get("is_featured") === "true";
  const isSeasonal = formData.get("is_seasonal") === "true";
  const isVisible = formData.get("is_visible") === "true";

  if (!name || name.trim().length === 0) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  const price = parseFloat(priceStr ?? "");
  if (isNaN(price) || price <= 0) {
    return {
      success: false,
      error: "El precio debe ser mayor a 0.",
    };
  }

  if (!categoryId) {
    return { success: false, error: "La categoría es obligatoria." };
  }

  const supabase = await createClient();

  const slug = await generateUniqueSlug(supabase, name);
  if (slug.length === 0) {
    return {
      success: false,
      error: "El nombre no genera un slug válido.",
    };
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return {
        success: false,
        error:
          "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
      };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: "La imagen no debe superar los 5 MB.",
      };
    }
    imageUrl = await uploadProductImage(supabase, imageFile);
    if (!imageUrl) {
      return {
        success: false,
        error: "Error al subir la imagen. Intenta de nuevo.",
      };
    }
  }

  const row = {
    name: name.trim(),
    slug,
    description,
    price,
    category_id: categoryId,
    sku,
    image_url: imageUrl,
    is_available: isAvailable,
    is_featured: isFeatured,
    is_seasonal: isSeasonal,
    is_visible: isVisible,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("products").insert(row as any);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "Ya existe un producto con ese SKU.",
      };
    }
    return { success: false, error: "Error al crear el producto." };
  }

  revalidateProductPaths();
  return { success: true };
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string | null;
  const description =
    (formData.get("description") as string | null) || null;
  const priceStr = formData.get("price") as string | null;
  const categoryId = formData.get("category_id") as string | null;
  const sku = (formData.get("sku") as string | null) || null;
  const imageFile = formData.get("image") as File | null;
  const existingImageUrl =
    (formData.get("existing_image_url") as string | null) || null;
  const isAvailable = formData.get("is_available") === "true";
  const isFeatured = formData.get("is_featured") === "true";
  const isSeasonal = formData.get("is_seasonal") === "true";
  const isVisible = formData.get("is_visible") === "true";

  if (!name || name.trim().length === 0) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  const price = parseFloat(priceStr ?? "");
  if (isNaN(price) || price <= 0) {
    return {
      success: false,
      error: "El precio debe ser mayor a 0.",
    };
  }

  if (!categoryId) {
    return { success: false, error: "La categoría es obligatoria." };
  }

  const supabase = await createClient();

  const slug = await generateUniqueSlug(supabase, name, id);
  if (slug.length === 0) {
    return {
      success: false,
      error: "El nombre no genera un slug válido.",
    };
  }

  let imageUrl: string | null = existingImageUrl;

  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return {
        success: false,
        error:
          "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
      };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: "La imagen no debe superar los 5 MB.",
      };
    }

    if (existingImageUrl) {
      await deleteProductImage(supabase, existingImageUrl);
    }

    imageUrl = await uploadProductImage(supabase, imageFile);
    if (!imageUrl) {
      return {
        success: false,
        error: "Error al subir la imagen. Intenta de nuevo.",
      };
    }
  }

  const changes = {
    name: name.trim(),
    slug,
    description,
    price,
    category_id: categoryId,
    sku,
    image_url: imageUrl,
    is_available: isAvailable,
    is_featured: isFeatured,
    is_seasonal: isSeasonal,
    is_visible: isVisible,
    updated_at: new Date().toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("products") as any)
    .update(changes)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "Ya existe un producto con ese SKU.",
      };
    }
    return {
      success: false,
      error: "Error al actualizar el producto.",
    };
  }

  revalidateProductPaths();
  return { success: true };
}

export async function deleteProduct(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  const imageUrl = (product as { image_url: string | null } | null)
    ?.image_url;
  if (imageUrl) {
    await deleteProductImage(supabase, imageUrl);
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: "Error al eliminar el producto." };
  }

  revalidateProductPaths();
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// HU-2.3: CSV Import Action
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Server Action: receives a CSV File from the import panel, parses + validates
 * + upserts products, persists staging audit records, and returns a summary.
 */
export async function importProductsCsv(
  formData: FormData,
): Promise<{ success: true; summary: ImportSummary } | { success: false; error: string }> {
  const file = formData.get("csv_file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No se recibió ningún archivo CSV." };
  }

  const MAPPING_VERSION = "v1";
  const csvText = await file.text();

  // ── Step 1: Parse raw CSV ────────────────────────────────────────────────
  const { validRows: parsedRows, issues: parseIssues } = parseCsvText(csvText);

  const supabase = await createClient();

  // ── Step 2: Load mapping rules from DB ──────────────────────────────────
  let rules;
  try {
    rules = await loadMappingRules(supabase, MAPPING_VERSION);
  } catch {
    return { success: false, error: "Error al cargar las reglas de mapeo de categorías." };
  }

  // ── Step 3: Load curated categories (name → id) ─────────────────────────
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true);

  if (catError) {
    return { success: false, error: "Error al cargar las categorías del catálogo." };
  }

  const categoryIdsByName = new Map<string, string>(
    (categories ?? []).map((c) => {
      const cat = c as { id: string; name: string };
      return [cat.name, cat.id];
    }),
  );

  // ── Step 4: Load existing SKUs for duplicate detection ──────────────────
  const skusInFile = parsedRows
    .map((r) => r.data.sku)
    .filter((s): s is string => s !== null);

  const existingSkus = new Set<string>();
  if (skusInFile.length > 0) {
    const { data: existingSku } = await supabase
      .from("products")
      .select("sku")
      .in("sku", skusInFile);

    for (const row of existingSku ?? []) {
      const r = row as { sku: string | null };
      if (r.sku) existingSkus.add(r.sku);
    }
  }

  // ── Step 5: Validate + resolve categories ───────────────────────────────
  const { validatedRows, issues: allIssues } = validateRows({
    parsedRows,
    parseIssues,
    rules,
    existingSkus,
    categoryIdsByName,
  });

  // ── Step 6: Upsert valid products ────────────────────────────────────────
  let upsertResult = { created: 0, updated: 0, issues: [] as import("@/lib/import/csv/types").RowIssue[] };
  if (validatedRows.length > 0) {
    try {
      upsertResult = await upsertProducts(supabase, validatedRows);
    } catch {
      return { success: false, error: "Error al importar productos a la base de datos." };
    }
  }

  // ── Step 7: Build consolidated metrics ───────────────────────────────────
  //
  // Invariant: created + updated + skipped + errored = totalRows
  //
  //   totalRows   = parsedRows (passed parse) + parseIssues (rejected at parse level)
  //   skipped     = DUPLICATE_SKU issues (functional rule — row intentionally omitted)
  //   errored     = validation issues (non-DUPLICATE) + DB errors from upsert
  //   created + updated = validatedRows successfully upserted
  //
  const totalRows = parsedRows.length + parseIssues.length;
  const dupSkipCount = allIssues.filter((i) => i.code === "DUPLICATE_SKU").length;
  const validationErrorCount = allIssues.filter((i) => i.code !== "DUPLICATE_SKU").length;
  const dbErrorCount = upsertResult.issues.length;
  const erroredCount = validationErrorCount + dbErrorCount;

  // Merge all issues for the audit trail and UI detail table.
  const mergedIssues = [...allIssues, ...upsertResult.issues];

  // ── Step 8: Persist staging audit ────────────────────────────────────────
  let batchId = "";
  try {
    const rawRows = parsedRows.map((r) => ({
      sourceRow: r.sourceRow,
      payload: r.data as unknown as Record<string, unknown>,
    }));

    batchId = await persistStagingBatch(supabase, {
      filename: file.name,
      fileHash: await computeFileHash(csvText),
      mappingVersion: MAPPING_VERSION,
      totalRows,
      rawRows,
      issues: mergedIssues,
      rowsCreated: upsertResult.created,
      rowsUpdated: upsertResult.updated,
      rowsSkipped: dupSkipCount,
      rowsErrored: erroredCount,
    });
  } catch {
    // Staging failure is non-fatal — products were already upserted.
    batchId = "staging-error";
  }

  revalidatePath("/admin/productos");
  revalidatePath("/categorias", "layout");
  revalidatePath("/");

  const summary: ImportSummary = {
    batchId,
    totalRows,
    created: upsertResult.created,
    updated: upsertResult.updated,
    skipped: dupSkipCount,
    errored: erroredCount,
    issues: mergedIssues,
  };

  return { success: true, summary };
}

/** Lightweight hash using djb2 — avoids Web Crypto API complexity in server actions. */
async function computeFileHash(text: string): Promise<string> {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) ^ text.charCodeAt(i);
    h = h >>> 0; // keep unsigned 32-bit
  }
  return h.toString(16);
}

export async function toggleProductVisibility(
  id: string,
  isVisible: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("products") as any)
    .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Error al cambiar la visibilidad del producto.",
    };
  }

  revalidateProductPaths();
  return { success: true };
}
