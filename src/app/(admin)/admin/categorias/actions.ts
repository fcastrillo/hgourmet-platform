"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { fetchMaxDisplayOrder } from "@/lib/supabase/queries/admin-categories";

type ActionResult = { success: true } | { success: false; error: string };

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

function revalidateCategoryPaths() {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/categorias");
}

// ADR-005: Supabase TS resolves insert/update params as `never` when chaining.
// We use typed helpers with explicit casts on the query result/params.

async function uploadCategoryImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<string | null> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null;
  if (file.size > MAX_IMAGE_SIZE) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("category-images")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from("category-images").getPublicUrl(fileName);

  return publicUrl;
}

async function deleteCategoryImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string,
): Promise<void> {
  const parts = imageUrl.split("/category-images/");
  if (parts.length < 2) return;
  const filePath = parts[1];
  await supabase.storage.from("category-images").remove([filePath]);
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const name = formData.get("name") as string | null;
  const description = (formData.get("description") as string | null) || null;
  const isActive = formData.get("is_active") === "true";
  const imageFile = formData.get("image") as File | null;

  if (!name || name.trim().length === 0) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return {
        success: false,
        error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
      };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return { success: false, error: "La imagen no debe superar los 5 MB." };
    }
  }

  const slug = slugify(name);
  if (slug.length === 0) {
    return { success: false, error: "El nombre no genera un slug válido." };
  }

  const maxOrder = await fetchMaxDisplayOrder();
  const supabase = await createClient();

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadCategoryImage(supabase, imageFile);
    if (!imageUrl) {
      return { success: false, error: "Error al subir la imagen. Intenta de nuevo." };
    }
  }

  const row = {
    name: name.trim(),
    slug,
    description,
    image_url: imageUrl,
    display_order: maxOrder + 1,
    is_active: isActive,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("categories").insert(row as any);

  if (error) {
    if (imageUrl) await deleteCategoryImage(supabase, imageUrl);
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
  const imageFile = formData.get("image") as File | null;
  const existingImageUrl =
    (formData.get("existing_image_url") as string | null) || null;

  if (!name || name.trim().length === 0) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return {
        success: false,
        error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
      };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return { success: false, error: "La imagen no debe superar los 5 MB." };
    }
  }

  const slug = slugify(name);
  if (slug.length === 0) {
    return { success: false, error: "El nombre no genera un slug válido." };
  }

  const supabase = await createClient();

  // Fetch current image URL from DB so we can clean up Storage on remove/replace.
  const { data: currentRow } = await supabase
    .from("categories")
    .select("image_url")
    .eq("id", id)
    .single();
  const currentImageUrl =
    (currentRow as { image_url: string | null } | null)?.image_url ?? null;

  let imageUrl: string | null = existingImageUrl;

  if (imageFile && imageFile.size > 0) {
    // Replace: delete old file (if any) then upload new one.
    if (currentImageUrl) {
      await deleteCategoryImage(supabase, currentImageUrl);
    }
    imageUrl = await uploadCategoryImage(supabase, imageFile);
    if (!imageUrl) {
      return { success: false, error: "Error al subir la imagen. Intenta de nuevo." };
    }
  } else if (!existingImageUrl && currentImageUrl) {
    // No new file and no keep-flag → user explicitly removed the image.
    await deleteCategoryImage(supabase, currentImageUrl);
    imageUrl = null;
  }

  const changes = {
    name: name.trim(),
    slug,
    description,
    image_url: imageUrl,
    is_active: isActive,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("categories") as any).update(changes).eq("id", id);

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

  const { data: category } = await supabase
    .from("categories")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Error al eliminar la categoría." };
  }

  const imageUrl = (category as { image_url: string | null } | null)?.image_url;
  if (imageUrl) {
    await deleteCategoryImage(supabase, imageUrl);
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function toggleCategoryActive(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("categories") as any)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("categories") as any).update({ display_order: index + 1 }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    return { success: false, error: "Error al reordenar las categorías." };
  }

  revalidateCategoryPaths();
  return { success: true };
}
