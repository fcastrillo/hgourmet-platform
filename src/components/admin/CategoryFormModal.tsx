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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  const slugPreview = slugify(name);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("is_active", String(isActive));

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

          <div>
            <label htmlFor="cat-desc" className="mb-1 block text-sm font-medium text-text">
              Descripción <span className="text-xs text-muted">(opcional)</span>
            </label>
            <textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-secondary px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Descripción breve de la categoría..."
            />
          </div>

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
