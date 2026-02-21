import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/database";
import { formatPrice, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group overflow-hidden rounded-lg border border-secondary bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Sin imagen
          </div>
        )}

        {!product.is_available && (
          <div className="absolute inset-0 flex items-start justify-end bg-black/10 p-2">
            <span className="rounded-full bg-error px-3 py-1 text-xs font-semibold text-white">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-heading text-sm font-semibold text-text line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.is_available ? (
            <span className="text-xs font-medium text-success">Disponible</span>
          ) : (
            <span className="text-xs font-medium text-error">Agotado</span>
          )}
        </div>
      </div>
    </Link>
  );
}
