"use client";

import { useState, useTransition } from "react";
import { deleteRecipe } from "@/app/(admin)/admin/recetas/actions";

interface DeleteRecipeDialogProps {
  recipeId: string;
  recipeTitle: string;
  onClose: () => void;
}

export function DeleteRecipeDialog({
  recipeId,
  recipeTitle,
  onClose,
}: DeleteRecipeDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteRecipe(recipeId);
      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <svg
            className="h-6 w-6 text-error"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="font-heading text-lg font-bold text-text">
          Eliminar receta
        </h2>
        <p className="mt-2 text-sm text-muted">
          ¿Estás segura de que deseas eliminar la receta{" "}
          <strong className="text-text">&ldquo;{recipeTitle}&rdquo;</strong>?
          La imagen asociada también se eliminará. Esta acción no se puede
          deshacer.
        </p>

        {error && (
          <p className="mt-3 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-error/90 disabled:opacity-50"
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
