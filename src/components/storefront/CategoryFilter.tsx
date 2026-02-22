"use client";

import type { Category } from "@/types/database";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      role="group"
      aria-label="Filtrar por categoría"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          selectedId === null
            ? "bg-primary text-white"
            : "bg-secondary text-text hover:bg-primary/10"
        )}
        aria-pressed={selectedId === null}
      >
        Todas
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            selectedId === category.id
              ? "bg-primary text-white"
              : "bg-secondary text-text hover:bg-primary/10"
          )}
          aria-pressed={selectedId === category.id}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
