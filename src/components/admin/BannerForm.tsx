"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createBanner,
  updateBanner,
} from "@/app/(admin)/admin/banners/actions";
import type { Banner } from "@/types/database";

interface BannerFormProps {
  banner?: Banner;
}

interface FormErrors {
  image?: string;
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!banner;

  const [title, setTitle] = useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? "");
  const [linkUrl, setLinkUrl] = useState(banner?.link_url ?? "");
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);
  const [imagePreview, setImagePreview] = useState<string | null>(
    banner?.image_url ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!isEditing && !selectedFile) {
      newErrors.image = "La imagen es obligatoria.";
    }

    if (isEditing && !selectedFile && !banner?.image_url) {
      newErrors.image = "La imagen es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrors({});
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setServerError(null);
    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("subtitle", subtitle.trim());
    formData.set("link_url", linkUrl.trim());
    formData.set("is_active", String(isActive));

    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    if (isEditing && banner?.image_url && !selectedFile) {
      formData.set("existing_image_url", banner.image_url);
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateBanner(banner!.id, formData)
        : await createBanner(formData);

      if (result.success) {
        router.push("/admin/banners");
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <div>
      <Link
        href="/admin/banners"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Volver a banners
      </Link>

      <h1 className="font-heading text-2xl font-bold text-text">
        {isEditing ? "Editar banner" : "Nuevo banner"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {isEditing
          ? "Modifica los datos del banner."
          : "Completa los datos para agregar un nuevo banner al carrusel."}
      </p>

      {serverError && (
        <div className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
        {/* Image upload */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Imagen del banner <span className="text-error">*</span>
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-full max-w-md rounded-lg border border-secondary object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white shadow-md transition-colors hover:bg-error/90"
                aria-label="Quitar imagen"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                errors.image
                  ? "border-error hover:border-error/70"
                  : "border-secondary hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <svg
                className="h-8 w-8 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                />
              </svg>
              <p className="mt-2 text-sm text-muted">
                Haz clic para subir una imagen
              </p>
              <p className="mt-1 text-xs text-muted">
                JPG, PNG, WebP o GIF. Máximo 5 MB. Recomendado: 1200×400px.
              </p>
            </div>
          )}
          {errors.image && (
            <p className="mt-1 text-xs text-error">{errors.image}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-text"
          >
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Promoción Navidad"
            className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted">
            Opcional. Se superpone sobre la imagen en el carrusel.
          </p>
        </div>

        {/* Subtitle */}
        <div>
          <label
            htmlFor="subtitle"
            className="mb-1 block text-sm font-medium text-text"
          >
            Subtítulo
          </label>
          <input
            id="subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ej: Hasta 30% de descuento en chocolate"
            className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Link URL */}
        <div>
          <label
            htmlFor="link_url"
            className="mb-1 block text-sm font-medium text-text"
          >
            Link destino
          </label>
          <input
            id="link_url"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Ej: /categorias/chocolate"
            className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted">
            Opcional. URL a la que redirige al hacer clic en el banner.
          </p>
        </div>

        {/* Active toggle */}
        <div className="rounded-lg border border-secondary p-4">
          <label
            htmlFor="is_active"
            className="flex cursor-pointer items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-text">Activo</p>
              <p className="text-xs text-muted">
                Se muestra en el carrusel de la página principal
              </p>
            </div>
            <div className="relative">
              <input
                id="is_active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`h-6 w-11 rounded-full transition-colors ${
                  isActive ? "bg-primary" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Crear banner"}
          </button>
          <Link
            href="/admin/banners"
            className="rounded-lg border border-secondary px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
