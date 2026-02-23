"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchMaxBannerDisplayOrder } from "@/lib/supabase/queries/admin-banners";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateBannerPaths() {
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

async function uploadBannerImage(
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
    .from("banner-images")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from("banner-images").getPublicUrl(fileName);

  return publicUrl;
}

async function deleteBannerImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string,
): Promise<void> {
  const parts = imageUrl.split("/banner-images/");
  if (parts.length < 2) return;
  const filePath = parts[1];
  await supabase.storage.from("banner-images").remove([filePath]);
}

export async function createBanner(
  formData: FormData,
): Promise<ActionResult> {
  const title = (formData.get("title") as string | null) || null;
  const subtitle = (formData.get("subtitle") as string | null) || null;
  const linkUrl = (formData.get("link_url") as string | null) || null;
  const imageFile = formData.get("image") as File | null;
  const isActive = formData.get("is_active") === "true";

  if (!imageFile || imageFile.size === 0) {
    return { success: false, error: "La imagen es obligatoria." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    return {
      success: false,
      error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
    };
  }
  if (imageFile.size > MAX_IMAGE_SIZE) {
    return {
      success: false,
      error: "La imagen no debe superar los 5 MB.",
    };
  }

  const supabase = await createClient();

  const imageUrl = await uploadBannerImage(supabase, imageFile);
  if (!imageUrl) {
    return {
      success: false,
      error: "Error al subir la imagen. Intenta de nuevo.",
    };
  }

  const maxOrder = await fetchMaxBannerDisplayOrder();

  const row = {
    title,
    subtitle,
    image_url: imageUrl,
    link_url: linkUrl,
    is_active: isActive,
    display_order: maxOrder + 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("banners").insert(row as any);

  if (error) {
    return { success: false, error: "Error al crear el banner." };
  }

  revalidateBannerPaths();
  return { success: true };
}

export async function updateBanner(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const title = (formData.get("title") as string | null) || null;
  const subtitle = (formData.get("subtitle") as string | null) || null;
  const linkUrl = (formData.get("link_url") as string | null) || null;
  const imageFile = formData.get("image") as File | null;
  const existingImageUrl =
    (formData.get("existing_image_url") as string | null) || null;
  const isActive = formData.get("is_active") === "true";

  let imageUrl: string | null = existingImageUrl;

  const supabase = await createClient();

  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return {
        success: false,
        error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
      };
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: "La imagen no debe superar los 5 MB.",
      };
    }

    if (existingImageUrl) {
      await deleteBannerImage(supabase, existingImageUrl);
    }

    imageUrl = await uploadBannerImage(supabase, imageFile);
    if (!imageUrl) {
      return {
        success: false,
        error: "Error al subir la imagen. Intenta de nuevo.",
      };
    }
  }

  if (!imageUrl) {
    return { success: false, error: "La imagen es obligatoria." };
  }

  const changes = {
    title,
    subtitle,
    image_url: imageUrl,
    link_url: linkUrl,
    is_active: isActive,
  };

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase.from("banners").update(changes).eq("id", id);

  if (error) {
    return { success: false, error: "Error al actualizar el banner." };
  }

  revalidateBannerPaths();
  return { success: true };
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: banner } = await supabase
    .from("banners")
    .select("image_url")
    .eq("id", id)
    .single();

  const imageUrl = (banner as { image_url: string } | null)?.image_url;
  if (imageUrl) {
    await deleteBannerImage(supabase, imageUrl);
  }

  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Error al eliminar el banner." };
  }

  revalidateBannerPaths();
  return { success: true };
}

export async function toggleBannerActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase.from("banners").update({ is_active: isActive }).eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Error al cambiar el estado del banner.",
    };
  }

  revalidateBannerPaths();
  return { success: true };
}

export async function reorderBanners(
  orderedIds: string[],
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
    supabase.from("banners").update({ display_order: index + 1 }).eq("id", id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    return { success: false, error: "Error al reordenar los banners." };
  }

  revalidateBannerPaths();
  return { success: true };
}
