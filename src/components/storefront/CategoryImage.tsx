"use client";

import { useState } from "react";

/**
 * Curated static fallback images served from /public/images/categories/{slug}.jpg.
 * These are the 7 canonical curated categories from ENABLER-2.
 */
const STATIC_FALLBACKS = new Set([
  "bases",
  "chocolates",
  "decoracion",
  "desechables",
  "insumos",
  "moldes",
  "utensilios",
]);

/** Ultimate emoji fallback for unknown/future slugs */
const EMOJI_FALLBACK: Record<string, string> = {
  harinas: "🌾",
  sprinkles: "✨",
  colorantes: "🎨",
  fondant: "🎂",
  empaques: "📦",
};
const DEFAULT_EMOJI = "🛒";

interface CategoryImageProps {
  imageUrl: string | null;
  slug: string;
  name: string;
  /** Tailwind class for the container height, e.g. "h-32" or "h-28" */
  heightClass?: string;
}

type FallbackLevel = "real" | "static" | "emoji";

export function CategoryImage({
  imageUrl,
  slug,
  name,
  heightClass = "h-36",
}: CategoryImageProps) {
  const initialLevel: FallbackLevel = imageUrl ? "real" : "static";
  const [level, setLevel] = useState<FallbackLevel>(initialLevel);

  const handleRealError = () => setLevel("static");
  const handleStaticError = () => setLevel("emoji");

  const hasStatic = STATIC_FALLBACKS.has(slug);

  return (
    <div
      className={`w-full overflow-hidden rounded-t-xl bg-secondary/30 ${heightClass} flex items-center justify-center`}
    >
      {level === "real" && imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-contain p-2"
          style={{ mixBlendMode: "multiply" }}
          onError={handleRealError}
        />
      )}

      {level === "static" && hasStatic && (
        <img
          src={`/images/categories/${slug}.jpg`}
          alt={name}
          className="h-full w-full object-contain p-2"
          style={{ mixBlendMode: "multiply" }}
          onError={handleStaticError}
        />
      )}

      {(level === "emoji" || (level === "static" && !hasStatic)) && (
        <span className="text-5xl" role="img" aria-hidden="true">
          {EMOJI_FALLBACK[slug] ?? DEFAULT_EMOJI}
        </span>
      )}
    </div>
  );
}
