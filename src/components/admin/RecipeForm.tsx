"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRecipe, updateRecipe } from "@/app/(admin)/admin/recetas/actions";
import { extractFormFields } from "@/lib/recipe-content";
import type { Recipe } from "@/types/database";

interface RecipeFormProps {
  recipe?: Recipe;
}

interface FormErrors {
  title?: string;
  ingredients?: string;
  preparation?: string;
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!recipe;

  const initialFields = recipe ? extractFormFields(recipe) : { ingredients: "", preparation: "", tip: "" };

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [ingredients, setIngredients] = useState(initialFields.ingredients);
  const [preparation, setPreparation] = useState(initialFields.preparation);
  const [tip, setTip] = useState(initialFields.tip);
  const [isPublished, setIsPublished] = useState(recipe?.is_published ?? false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    recipe?.image_url ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "El título es obligatorio.";
    if (!ingredients.trim()) newErrors.ingredients = "Los ingredientes son obligatorios.";
    if (!preparation.trim()) newErrors.preparation = "La preparación es obligatoria.";
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
    formData.set("ingredients", ingredients.trim());
    formData.set("preparation", preparation.trim());
    formData.set("tip", tip.trim());
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

        {/* Ingredientes */}
        <div>
          <label htmlFor="ingredients" className="mb-1 block text-sm font-medium text-text">
            Ingredientes <span className="text-error">*</span>
          </label>
          <p className="mb-2 text-xs text-muted">
            Escribe un ingrediente por línea. Ej: 200g Chocolate Callebaut 70%
          </p>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => {
              setIngredients(e.target.value);
              if (errors.ingredients) setErrors((prev) => ({ ...prev, ingredients: undefined }));
            }}
            rows={6}
            placeholder={"200g Chocolate Callebaut 70%\n150g mantequilla sin sal\n200g azúcar moscabado\n3 huevos grandes"}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:ring-1 ${
              errors.ingredients
                ? "border-error focus:border-error focus:ring-error"
                : "border-secondary focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.ingredients && (
            <p className="mt-1 text-xs text-error">{errors.ingredients}</p>
          )}
        </div>

        {/* Preparación */}
        <div>
          <label htmlFor="preparation" className="mb-1 block text-sm font-medium text-text">
            Preparación <span className="text-error">*</span>
          </label>
          <p className="mb-2 text-xs text-muted">
            Escribe un paso por línea. Se numerarán automáticamente en la receta.
          </p>
          <textarea
            id="preparation"
            value={preparation}
            onChange={(e) => {
              setPreparation(e.target.value);
              if (errors.preparation) setErrors((prev) => ({ ...prev, preparation: undefined }));
            }}
            rows={8}
            placeholder={"Precalentar el horno a 175°C y engrasar un molde cuadrado de 20cm.\nDerretir el chocolate Callebaut con la mantequilla a baño María.\nBatir los huevos con el azúcar hasta que la mezcla blanquee."}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:ring-1 ${
              errors.preparation
                ? "border-error focus:border-error focus:ring-error"
                : "border-secondary focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.preparation && (
            <p className="mt-1 text-xs text-error">{errors.preparation}</p>
          )}
        </div>

        {/* Tip HGourmet (opcional) */}
        <div>
          <label htmlFor="tip" className="mb-1 block text-sm font-medium text-text">
            Tip HGourmet{" "}
            <span className="text-xs font-normal text-muted">(opcional)</span>
          </label>
          <p className="mb-2 text-xs text-muted">
            Un consejo especial de HGourmet para que la receta salga perfecta.
          </p>
          <textarea
            id="tip"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            rows={3}
            placeholder="Para un acabado brillante, deja reposar los brownies en el refrigerador 1 hora antes de cortarlos."
            className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
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
