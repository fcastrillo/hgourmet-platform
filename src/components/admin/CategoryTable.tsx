"use client";

import { useState, useTransition } from "react";
import { reorderCategories } from "@/app/(admin)/admin/categorias/actions";
import { CategoryFormModal } from "./CategoryFormModal";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import type { CategoryWithProductCount } from "@/types/database";

interface CategoryTableProps {
  categories: CategoryWithProductCount[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryWithProductCount | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithProductCount | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isReordering, startReorder] = useTransition();

  function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newOrder = categories.map((c) => c.id);
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];

    startReorder(async () => {
      await reorderCategories(newOrder);
    });
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text">Categorías</h1>
          <p className="mt-1 text-sm text-muted">
            {categories.length} categoría{categories.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          + Nueva categoría
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-secondary py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-muted/50" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <p className="mt-4 text-sm font-medium text-text">No hay categorías</p>
          <p className="mt-1 text-xs text-muted">Crea la primera categoría para organizar el catálogo.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            + Nueva categoría
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-secondary md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-secondary bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted">Orden</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Slug</th>
                  <th className="px-4 py-3 text-center font-medium text-muted">Productos</th>
                  <th className="px-4 py-3 text-center font-medium text-muted">Estado</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {categories.map((cat, index) => (
                  <tr key={cat.id} className="bg-white transition-colors hover:bg-secondary/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0 || isReordering}
                          className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                          aria-label="Subir"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMove(index, "down")}
                          disabled={index === categories.length - 1 || isReordering}
                          className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                          aria-label="Bajar"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <span className="ml-1 text-xs text-muted">{cat.display_order}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-text">{cat.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{cat.slug}</td>
                    <td className="px-4 py-3 text-center text-muted">{cat.product_count}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          cat.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.is_active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {categories.map((cat, index) => (
              <div key={cat.id} className="rounded-xl border border-secondary bg-white p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-text">{cat.name}</h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          cat.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.is_active ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-muted">{cat.slug}</p>
                    <p className="mt-1 text-xs text-muted">
                      {cat.product_count} producto{cat.product_count !== 1 ? "s" : ""} · Orden: {cat.display_order}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0 || isReordering}
                      className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                      aria-label="Subir"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={index === categories.length - 1 || isReordering}
                      className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                      aria-label="Bajar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-secondary pt-3">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="flex-1 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeletingCategory(cat)}
                    className="flex-1 rounded-lg border border-error/30 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CategoryFormModal onClose={() => setShowCreateModal(false)} />
      )}

      {editingCategory && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryDialog
          categoryId={deletingCategory.id}
          categoryName={deletingCategory.name}
          productCount={deletingCategory.product_count}
          onClose={() => setDeletingCategory(null)}
        />
      )}
    </>
  );
}
