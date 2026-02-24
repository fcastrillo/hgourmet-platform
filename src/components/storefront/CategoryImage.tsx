"use client";

import { useState } from "react";

const CATEGORY_ICONS: Record<string, string> = {
  chocolate: "🍫",
  harinas: "🌾",
  moldes: "🧁",
  sprinkles: "✨",
  colorantes: "🎨",
  fondant: "🎂",
  empaques: "📦",
  utensilios: "🍴",
  decoracion: "🌸",
  bases: "🎂",
  desechables: "🥤",
  insumos: "🛒",
};

function getCategoryIcon(slug: string): string {
  return CATEGORY_ICONS[slug] ?? "🛒";
}

interface CategoryImageProps {
  imageUrl: string | null;
  slug: string;
  name: string;
  /** Tailwind class for the container height, e.g. "h-32" or "h-40" */
  heightClass?: string;
}

export function CategoryImage({
  imageUrl,
  slug,
  name,
  heightClass = "h-36",
}: CategoryImageProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = imageUrl && !imgError;

  return (
    <div
      className={`w-full overflow-hidden rounded-t-xl bg-background ${heightClass} flex items-center justify-center`}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-5xl" role="img" aria-hidden="true">
          {getCategoryIcon(slug)}
        </span>
      )}
    </div>
  );
}
