"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

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

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase
    .from("products")
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

export async function toggleProductVisibility(
  id: string,
  isVisible: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase
    .from("products")
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
