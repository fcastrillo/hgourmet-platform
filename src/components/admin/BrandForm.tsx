"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createBrand,
  updateBrand,
} from "@/app/(admin)/admin/marcas/actions";
import type { Brand } from "@/types/database";

interface BrandFormProps {
  brand?: Brand;
}

interface FormErrors {
  name?: string;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!brand;

  const [name, setName] = useState(brand?.name ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(brand?.website_url ?? "");
  const [isActive, setIsActive] = useState(brand?.is_active ?? true);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    brand?.logo_url ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setSelectedFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setServerError(null);
    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("website_url", websiteUrl.trim());
    formData.set("is_active", String(isActive));

    if (selectedFile) {
      formData.set("logo", selectedFile);
    }

    if (isEditing && brand?.logo_url && !selectedFile) {
      formData.set("existing_logo_url", brand.logo_url);
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateBrand(brand!.id, formData)
        : await createBrand(formData);

      if (result.success) {
        router.push("/admin/marcas");
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <div>
      <Link
        href="/admin/marcas"
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
        Volver a marcas
      </Link>

      <h1 className="font-heading text-2xl font-bold text-text">
        {isEditing ? "Editar marca" : "Nueva marca"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {isEditing
          ? "Modifica los datos de la marca."
          : "Completa los datos para agregar una nueva marca."}
      </p>

      {serverError && (
        <div className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-text"
          >
            Nombre <span className="text-error">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({});
            }}
            placeholder="Ej: Wilton"
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 ${
              errors.name
                ? "border-error focus:border-error focus:ring-error"
                : "border-secondary focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error">{errors.name}</p>
          )}
        </div>

        {/* Logo upload */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Logo
          </label>
          {logoPreview ? (
            <div className="relative inline-block">
              <img
                src={logoPreview}
                alt="Preview"
                className="h-24 w-24 rounded-lg border border-secondary object-contain p-2"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white shadow-md transition-colors hover:bg-error/90"
                aria-label="Quitar logo"
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
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary p-8 transition-colors hover:border-primary/50 hover:bg-primary/5"
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
                Haz clic para subir un logo
              </p>
              <p className="mt-1 text-xs text-muted">
                JPG, PNG, WebP o GIF. Máximo 5 MB.
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>

        {/* Website URL */}
        <div>
          <label
            htmlFor="website_url"
            className="mb-1 block text-sm font-medium text-text"
          >
            Sitio web
          </label>
          <input
            id="website_url"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="Ej: https://www.wilton.com"
            className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted">
            Opcional. Enlace al sitio oficial de la marca.
          </p>
        </div>

        {/* Active toggle */}
        <div className="rounded-lg border border-secondary p-4">
          <label
            htmlFor="is_active"
            className="flex cursor-pointer items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-text">Activa</p>
              <p className="text-xs text-muted">
                Se muestra en la sección &ldquo;Nuestras Marcas&rdquo;
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
                : "Crear marca"}
          </button>
          <Link
            href="/admin/marcas"
            className="rounded-lg border border-secondary px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
