"use client";

import { useRef, useState, useTransition } from "react";
import { createCategory, updateCategory } from "@/app/(admin)/admin/categorias/actions";
import { slugify } from "@/lib/slugify";
import type { Category } from "@/types/database";

interface CategoryFormModalProps {
  category?: Category | null;
  onClose: () => void;
}

export function CategoryFormModal({ category, onClose }: CategoryFormModalProps) {
  const isEditing = !!category;
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image_url ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const slugPreview = slugify(name);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("is_active", String(isActive));

    if (selectedFile) {
      formData.set("image", selectedFile);
    } else if (isEditing && category?.image_url && imagePreview !== null) {
      // User kept the existing image — tell server to preserve it.
      // When imagePreview is null the user explicitly removed the image,
      // so we intentionally omit existing_image_url to signal deletion.
      formData.set("existing_image_url", category.image_url);
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateCategory(category.id, formData)
        : await createCategory(formData);

      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-lg font-bold text-text">
          {isEditing ? "Editar categoría" : "Nueva categoría"}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="cat-name" className="mb-1 block text-sm font-medium text-text">
              Nombre <span className="text-error">*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-secondary px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Ej: Chocolate, Harinas..."
            />
            {name.trim().length > 0 && (
              <p className="mt-1 text-xs text-muted">
                Slug: <span className="font-mono">{slugPreview || "—"}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="cat-desc" className="mb-1 block text-sm font-medium text-text">
              Descripción <span className="text-xs text-muted">(opcional)</span>
            </label>
            <textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-secondary px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Descripción breve de la categoría..."
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text">
              Imagen <span className="text-xs text-muted">(opcional)</span>
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="h-24 w-full max-w-xs rounded-lg border border-secondary object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white shadow-md transition-colors hover:bg-error/90"
                  aria-label="Quitar imagen"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    width={14}
                    height={14}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <svg
                  className="h-8 w-8 text-muted"
                  width={32}
                  height={32}
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
                <p className="mt-2 text-xs text-muted">Haz clic para subir imagen</p>
                <p className="mt-0.5 text-xs text-muted">JPG, PNG, WebP o GIF · máx. 5 MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Subir imagen de categoría"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                isActive ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm text-text">
              {isActive ? "Activa" : "Inactiva"}
            </span>
          </div>

          {error && (
            <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
