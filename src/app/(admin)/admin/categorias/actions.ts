"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { fetchMaxDisplayOrder } from "@/lib/supabase/queries/admin-categories";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateCategoryPaths() {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

// ADR-005: Supabase TS resolves insert/update params as `never` when chaining.
// We use typed helpers with explicit casts on the query result/params.

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const name = formData.get("name") as string | null;
  const description = (formData.get("description") as string | null) || null;
  const isActive = formData.get("is_active") === "true";

  if (!name || name.trim().length === 0) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  const slug = slugify(name);
  if (slug.length === 0) {
    return { success: false, error: "El nombre no genera un slug válido." };
  }

  const maxOrder = await fetchMaxDisplayOrder();
  const supabase = await createClient();

  const row = {
    name: name.trim(),
    slug,
    description,
    display_order: maxOrder + 1,
    is_active: isActive,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("categories").insert(row as any);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ya existe una categoría con ese nombre." };
    }
    return { success: false, error: "Error al crear la categoría." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function updateCategory(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name") as string | null;
  const description = (formData.get("description") as string | null) || null;
  const isActive = formData.get("is_active") === "true";

  if (!name || name.trim().length === 0) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  const slug = slugify(name);
  if (slug.length === 0) {
    return { success: false, error: "El nombre no genera un slug válido." };
  }

  const supabase = await createClient();
  const changes = {
    name: name.trim(),
    slug,
    description,
    is_active: isActive,
  };

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase.from("categories").update(changes).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ya existe una categoría con ese nombre." };
    }
    return { success: false, error: "Error al actualizar la categoría." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      success: false,
      error: `No se puede eliminar: ${count} producto${count === 1 ? "" : "s"} asociado${count === 1 ? "" : "s"}. Mueva o elimine los productos primero.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Error al eliminar la categoría." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function toggleCategoryActive(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Error al cambiar el estado de la categoría." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function reorderCategories(
  orderedIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
    supabase.from("categories").update({ display_order: index + 1 }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    return { success: false, error: "Error al reordenar las categorías." };
  }

  revalidateCategoryPaths();
  return { success: true };
}
