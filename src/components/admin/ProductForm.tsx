"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createProduct,
  updateProduct,
} from "@/app/(admin)/admin/productos/actions";
import { slugify } from "@/lib/slugify";
import type { Product, Category } from "@/types/database";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

interface FormErrors {
  name?: string;
  price?: string;
  category_id?: string;
  image?: string;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isSeasonal, setIsSeasonal] = useState(product?.is_seasonal ?? false);
  const [isVisible, setIsVisible] = useState(product?.is_visible ?? true);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const slugPreview = slugify(name);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "El precio debe ser mayor a 0.";
    }

    if (!categoryId) {
      newErrors.category_id = "La categoría es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
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
    formData.set("name", name.trim());
    formData.set("description", description.trim());
    formData.set("price", price);
    formData.set("category_id", categoryId);
    formData.set("sku", sku.trim());
    formData.set("is_available", String(isAvailable));
    formData.set("is_featured", String(isFeatured));
    formData.set("is_seasonal", String(isSeasonal));
    formData.set("is_visible", String(isVisible));

    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    if (isEditing && product?.image_url && !selectedFile) {
      formData.set("existing_image_url", product.image_url);
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(product!.id, formData)
        : await createProduct(formData);

      if (result.success) {
        router.push("/admin/productos");
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <div>
      <Link
        href="/admin/productos"
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
        Volver a productos
      </Link>

      <h1 className="font-heading text-2xl font-bold text-text">
        {isEditing ? "Editar producto" : "Nuevo producto"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {isEditing
          ? "Modifica los datos del producto."
          : "Completa los datos para agregar un nuevo producto al catálogo."}
      </p>

      {serverError && (
        <div className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
        {/* Name + slug preview */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-text">
            Nombre <span className="text-error">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Chocolate Amargo 70%"
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 ${
              errors.name
                ? "border-error focus:border-error focus:ring-error"
                : "border-secondary focus:border-primary focus:ring-primary"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error">{errors.name}</p>
          )}
          {slugPreview && (
            <p className="mt-1 text-xs text-muted">
              Slug: <span className="font-mono">{slugPreview}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-text">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descripción del producto..."
            className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Price + Category (two columns) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-text">
              Precio (MXN) <span className="text-error">*</span>
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 ${
                errors.price
                  ? "border-error focus:border-error focus:ring-error"
                  : "border-secondary focus:border-primary focus:ring-primary"
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-error">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="category_id" className="mb-1 block text-sm font-medium text-text">
              Categoría <span className="text-error">*</span>
            </label>
            <select
              id="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-1 ${
                errors.category_id
                  ? "border-error focus:border-error focus:ring-error"
                  : "border-secondary focus:border-primary focus:ring-primary"
              }`}
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-xs text-error">{errors.category_id}</p>
            )}
          </div>
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="mb-1 block text-sm font-medium text-text">
            SKU
          </label>
          <input
            id="sku"
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Código de producto (opcional)"
            className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Imagen del producto
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 rounded-lg border border-secondary object-cover"
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
                JPG, PNG, WebP o GIF. Máximo 5 MB.
              </p>
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

        {/* Toggles */}
        <div className="rounded-lg border border-secondary p-4">
          <h3 className="mb-3 text-sm font-medium text-text">Opciones</h3>
          <div className="space-y-3">
            <ToggleField
              id="is_available"
              label="Disponible"
              description="El producto está en stock"
              checked={isAvailable}
              onChange={setIsAvailable}
            />
            <ToggleField
              id="is_visible"
              label="Visible en catálogo"
              description="Se muestra en el storefront público"
              checked={isVisible}
              onChange={setIsVisible}
            />
            <ToggleField
              id="is_featured"
              label="Producto destacado"
              description='Aparece en la sección "Lo más vendido"'
              checked={isFeatured}
              onChange={setIsFeatured}
            />
            <ToggleField
              id="is_seasonal"
              label="Producto de temporada"
              description='Aparece en "Productos de temporada"'
              checked={isSeasonal}
              onChange={setIsSeasonal}
            />
          </div>
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
                : "Crear producto"}
          </button>
          <Link
            href="/admin/productos"
            className="rounded-lg border border-secondary px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

function ToggleField({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/30" />
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}
