"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchMaxRecipeDisplayOrder } from "@/lib/supabase/queries/admin-recipes";

type ActionResult = { success: true } | { success: false; error: string };

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function revalidateRecipePaths() {
  revalidatePath("/admin/recetas");
  revalidatePath("/recetas");
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function uploadRecipeImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<string | null> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null;
  if (file.size > MAX_IMAGE_SIZE) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("recipe-images")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from("recipe-images").getPublicUrl(fileName);

  return publicUrl;
}

async function deleteRecipeImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string,
): Promise<void> {
  const parts = imageUrl.split("/recipe-images/");
  if (parts.length < 2) return;
  await supabase.storage.from("recipe-images").remove([parts[1]]);
}

export async function createRecipe(formData: FormData): Promise<ActionResult> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const content = (formData.get("content") as string | null)?.trim() ?? "";
  const imageFile = formData.get("image") as File | null;
  const isPublished = formData.get("is_published") === "true";

  if (!title) return { success: false, error: "El título es obligatorio." };
  if (!content) return { success: false, error: "El contenido es obligatorio." };

  const supabase = await createClient();
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return { success: false, error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF." };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return { success: false, error: "La imagen no debe superar los 5 MB." };
    }
    imageUrl = await uploadRecipeImage(supabase, imageFile);
    if (!imageUrl) return { success: false, error: "Error al subir la imagen. Intenta de nuevo." };
  }

  const maxOrder = await fetchMaxRecipeDisplayOrder();
  const slug = toSlug(title);

  const row = {
    title,
    slug,
    content,
    image_url: imageUrl,
    is_published: isPublished,
    display_order: maxOrder + 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("recipes").insert(row as any);
  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ya existe una receta con ese título. Usa un título diferente." };
    }
    return { success: false, error: "Error al crear la receta." };
  }

  revalidateRecipePaths();
  return { success: true };
}

export async function updateRecipe(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const content = (formData.get("content") as string | null)?.trim() ?? "";
  const imageFile = formData.get("image") as File | null;
  const existingImageUrl = (formData.get("existing_image_url") as string | null) || null;
  const isPublished = formData.get("is_published") === "true";

  if (!title) return { success: false, error: "El título es obligatorio." };
  if (!content) return { success: false, error: "El contenido es obligatorio." };

  const supabase = await createClient();
  let imageUrl: string | null = existingImageUrl;

  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return { success: false, error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF." };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return { success: false, error: "La imagen no debe superar los 5 MB." };
    }
    if (existingImageUrl) {
      await deleteRecipeImage(supabase, existingImageUrl);
    }
    imageUrl = await uploadRecipeImage(supabase, imageFile);
    if (!imageUrl) return { success: false, error: "Error al subir la imagen. Intenta de nuevo." };
  }

  const changes = {
    title,
    content,
    image_url: imageUrl,
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase.from("recipes").update(changes).eq("id", id);
  if (error) return { success: false, error: "Error al actualizar la receta." };

  revalidateRecipePaths();
  return { success: true };
}

export async function deleteRecipe(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("image_url")
    .eq("id", id)
    .single();

  const imageUrl = (recipe as { image_url: string | null } | null)?.image_url;
  if (imageUrl) {
    await deleteRecipeImage(supabase, imageUrl);
  }

  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) return { success: false, error: "Error al eliminar la receta." };

  revalidateRecipePaths();
  return { success: true };
}

export async function toggleRecipePublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase.from("recipes").update({ is_published: isPublished, updated_at: new Date().toISOString() }).eq("id", id);

  if (error) return { success: false, error: "Error al cambiar el estado de la receta." };

  revalidateRecipePaths();
  return { success: true };
}

export async function reorderRecipes(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    // @ts-expect-error — ADR-005
    supabase.from("recipes").update({ display_order: index + 1 }).eq("id", id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: "Error al reordenar las recetas." };

  revalidateRecipePaths();
  return { success: true };
}
