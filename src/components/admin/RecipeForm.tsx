"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRecipe, updateRecipe } from "@/app/(admin)/admin/recetas/actions";
import type { Recipe } from "@/types/database";

interface RecipeFormProps {
  recipe?: Recipe;
}

interface FormErrors {
  title?: string;
  content?: string;
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!recipe;

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [content, setContent] = useState(recipe?.content ?? "");
  const [isPublished, setIsPublished] = useState(recipe?.is_published ?? false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    recipe?.image_url ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "El título es obligatorio.";
    if (!content.trim()) newErrors.content = "El contenido es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

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
    if (!validate()) return;

    setServerError(null);
    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("content", content.trim());
    formData.set("is_published", String(isPublished));

    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    if (isEditing && recipe?.image_url && !selectedFile) {
      formData.set("existing_image_url", recipe.image_url);
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateRecipe(recipe!.id, formData)
        : await createRecipe(formData);

      if (result.success) {
        router.push("/admin/recetas");
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <div>
      <Link
        href="/admin/recetas"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver a recetas
      </Link>

      <h1 className="font-heading text-2xl font-bold text-text">
        {isEditing ? "Editar receta" : "Nueva receta"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {isEditing
          ? "Modifica los datos de la receta."
          : "Completa los datos para agregar una nueva receta."}
      </p>

      {serverError && (
        <div className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-text">
            Título <span className="text-error">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Ej: Brownies de Chocolate Callebaut"
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 ${
              errors.title
                ? "border-error focus:border-error focus:ring-error"
                : "border-secondary focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-error">{errors.title}</p>
          )}
        </div>

        {/* Cover image */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Imagen de portada
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-full max-w-xs rounded-lg border border-secondary object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white shadow-md transition-colors hover:bg-error/90"
                aria-label="Quitar imagen"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary p-8 transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
              <p className="mt-2 text-sm text-muted">Haz clic para subir una imagen</p>
              <p className="mt-1 text-xs text-muted">JPG, PNG, WebP o GIF. Máximo 5 MB.</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Content (Markdown) */}
        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-text">
            Contenido <span className="text-error">*</span>
          </label>
          <p className="mb-2 text-xs text-muted">
            Puedes usar Markdown para dar formato al texto.
          </p>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
            }}
            rows={16}
            placeholder={`## Ingredientes\n\n- 200g Chocolate Callebaut 70%\n- 150g mantequilla sin sal\n\n## Preparación\n\n1. Precalentar el horno a 175°C.\n2. Derretir el chocolate con la mantequilla...\n\n> **Tip HGourmet:** ...`}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 font-mono text-sm text-text placeholder:text-muted/60 focus:outline-none focus:ring-1 ${
              errors.content
                ? "border-error focus:border-error focus:ring-error"
                : "border-secondary focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.content && (
            <p className="mt-1 text-xs text-error">{errors.content}</p>
          )}
        </div>

        {/* Published toggle */}
        <div className="rounded-lg border border-secondary p-4">
          <label
            htmlFor="is_published"
            className="flex cursor-pointer items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-text">Publicada</p>
              <p className="text-xs text-muted">
                Visible para los visitantes del sitio
              </p>
            </div>
            <div className="relative">
              <input
                id="is_published"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`h-6 w-11 rounded-full transition-colors ${
                  isPublished ? "bg-primary" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  isPublished ? "translate-x-5" : "translate-x-0"
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
                : "Crear receta"}
          </button>
          <Link
            href="/admin/recetas"
            className="rounded-lg border border-secondary px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
