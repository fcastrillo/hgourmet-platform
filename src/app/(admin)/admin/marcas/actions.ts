"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchMaxBrandDisplayOrder } from "@/lib/supabase/queries/admin-brands";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateBrandPaths() {
  revalidatePath("/admin/marcas");
  revalidatePath("/");
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

async function uploadBrandLogo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<string | null> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return null;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return null;
  }

  const ext = file.name.split(".").pop() ?? "png";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("brand-logos")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from("brand-logos").getPublicUrl(fileName);

  return publicUrl;
}

async function deleteBrandLogo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  logoUrl: string,
): Promise<void> {
  const parts = logoUrl.split("/brand-logos/");
  if (parts.length < 2) return;
  const filePath = parts[1];
  await supabase.storage.from("brand-logos").remove([filePath]);
}

export async function createBrand(
  formData: FormData,
): Promise<ActionResult> {
  const name = (formData.get("name") as string | null)?.trim() || "";
  const websiteUrl = (formData.get("website_url") as string | null)?.trim() || null;
  const logoFile = formData.get("logo") as File | null;
  const isActive = formData.get("is_active") === "true";

  if (!name) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  const supabase = await createClient();
  let logoUrl: string | null = null;

  if (logoFile && logoFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(logoFile.type)) {
      return {
        success: false,
        error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
      };
    }
    if (logoFile.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: "La imagen no debe superar los 5 MB.",
      };
    }

    logoUrl = await uploadBrandLogo(supabase, logoFile);
    if (!logoUrl) {
      return {
        success: false,
        error: "Error al subir el logo. Intenta de nuevo.",
      };
    }
  }

  const maxOrder = await fetchMaxBrandDisplayOrder();

  const row = {
    name,
    logo_url: logoUrl,
    website_url: websiteUrl,
    is_active: isActive,
    display_order: maxOrder + 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("brands").insert(row as any);

  if (error) {
    return { success: false, error: "Error al crear la marca." };
  }

  revalidateBrandPaths();
  return { success: true };
}

export async function updateBrand(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const name = (formData.get("name") as string | null)?.trim() || "";
  const websiteUrl = (formData.get("website_url") as string | null)?.trim() || null;
  const logoFile = formData.get("logo") as File | null;
  const existingLogoUrl =
    (formData.get("existing_logo_url") as string | null) || null;
  const isActive = formData.get("is_active") === "true";

  if (!name) {
    return { success: false, error: "El nombre es obligatorio." };
  }

  let logoUrl: string | null = existingLogoUrl;

  const supabase = await createClient();

  if (logoFile && logoFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(logoFile.type)) {
      return {
        success: false,
        error: "Formato de imagen no soportado. Usa JPG, PNG, WebP o GIF.",
      };
    }
    if (logoFile.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: "La imagen no debe superar los 5 MB.",
      };
    }

    if (existingLogoUrl) {
      await deleteBrandLogo(supabase, existingLogoUrl);
    }

    logoUrl = await uploadBrandLogo(supabase, logoFile);
    if (!logoUrl) {
      return {
        success: false,
        error: "Error al subir el logo. Intenta de nuevo.",
      };
    }
  }

  const changes = {
    name,
    logo_url: logoUrl,
    website_url: websiteUrl,
    is_active: isActive,
  };

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase.from("brands").update(changes).eq("id", id);

  if (error) {
    return { success: false, error: "Error al actualizar la marca." };
  }

  revalidateBrandPaths();
  return { success: true };
}

export async function deleteBrand(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("logo_url")
    .eq("id", id)
    .single();

  const logoUrl = (brand as { logo_url: string | null } | null)?.logo_url;
  if (logoUrl) {
    await deleteBrandLogo(supabase, logoUrl);
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Error al eliminar la marca." };
  }

  revalidateBrandPaths();
  return { success: true };
}

export async function toggleBrandActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();

  // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
  const { error } = await supabase.from("brands").update({ is_active: isActive }).eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Error al cambiar el estado de la marca.",
    };
  }

  revalidateBrandPaths();
  return { success: true };
}

export async function reorderBrands(
  orderedIds: string[],
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    // @ts-expect-error — ADR-005: Supabase chained .update().eq() resolves param as never
    supabase.from("brands").update({ display_order: index + 1 }).eq("id", id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    return { success: false, error: "Error al reordenar las marcas." };
  }

  revalidateBrandPaths();
  return { success: true };
}
