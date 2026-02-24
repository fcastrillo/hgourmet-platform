"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toggleProductVisibility } from "@/app/(admin)/admin/productos/actions";
import { DeleteProductDialog } from "./DeleteProductDialog";
import type { ProductWithCategory } from "@/types/database";

interface ProductTableProps {
  products: ProductWithCategory[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  currentSearch: string;
}

export function ProductTable({
  products,
  totalCount,
  currentPage,
  pageSize,
  currentSearch,
}: ProductTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithCategory | null>(null);
  const [, startToggle] = useTransition();
  const [visibilityOverrides, setVisibilityOverrides] = useState<Record<string, boolean>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  function handleSearchChange(value: string) {
    setSearchValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.replace(`/admin/productos?${params.toString()}`);
    }, 300);
  }

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    router.replace(`/admin/productos?${params.toString()}`);
  }

  function getEffectiveVisibility(product: ProductWithCategory): boolean {
    return product.id in visibilityOverrides
      ? visibilityOverrides[product.id]
      : product.is_visible;
  }

  function handleToggleVisibility(product: ProductWithCategory) {
    const newVisible = !getEffectiveVisibility(product);
    setVisibilityOverrides((prev) => ({ ...prev, [product.id]: newVisible }));

    startToggle(async () => {
      await toggleProductVisibility(product.id, newVisible);
      setVisibilityOverrides((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    });
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text">Productos</h1>
          <p className="mt-1 text-sm text-muted">
            {totalCount} producto{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/productos/importar"
            className="inline-flex items-center gap-1.5 rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-secondary/50"
            aria-label="Importar CSV"
          >
            <svg className="h-4 w-4 shrink-0" width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Importar CSV
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-secondary bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-secondary py-16 text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted/50"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="mt-4 text-sm font-medium text-text">
            {currentSearch ? "Sin resultados" : "No hay productos"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {currentSearch
              ? `No se encontraron productos para "${currentSearch}".`
              : "Crea el primer producto para empezar a llenar el catálogo."}
          </p>
          {!currentSearch && (
            <Link
              href="/admin/productos/nuevo"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              + Nuevo producto
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-secondary md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-secondary bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted">Imagen</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Categoría</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">Precio</th>
                  <th className="px-4 py-3 text-center font-medium text-muted">Estado</th>
                  <th className="px-4 py-3 text-center font-medium text-muted">Flags</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {products.map((product) => {
                  const isVisible = getEffectiveVisibility(product);
                  return (
                    <tr key={product.id} className="bg-white transition-colors hover:bg-secondary/10">
                      <td className="px-4 py-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50 text-muted">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-text">{product.name}</p>
                        <p className="font-mono text-xs text-muted">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {product.categories?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-text">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              isVisible
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isVisible ? "Visible" : "Oculto"}
                          </span>
                          {!product.is_available && (
                            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                              Agotado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {product.is_featured && (
                            <span className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                              Destacado
                            </span>
                          )}
                          {product.is_seasonal && (
                            <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                              Temporada
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/productos/${product.id}/editar`}
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                            aria-label="Editar"
                            title="Editar"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleToggleVisibility(product)}
                            className={`rounded-lg p-2 transition-colors ${
                              isVisible
                                ? "text-green-600 hover:bg-green-50 hover:text-green-700"
                                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            }`}
                            aria-label={isVisible ? "Ocultar" : "Mostrar"}
                            title={isVisible ? "Ocultar" : "Mostrar"}
                          >
                            {isVisible ? (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-error/10 hover:text-error"
                            aria-label="Eliminar"
                            title="Eliminar"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {products.map((product) => {
              const isVisible = getEffectiveVisibility(product);
              return (
                <div key={product.id} className="rounded-xl border border-secondary bg-white p-4">
                  <div className="flex gap-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-muted">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-text">{product.name}</h3>
                        <span className="text-sm font-medium text-text">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {product.categories?.name ?? "Sin categoría"}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            isVisible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isVisible ? "Visible" : "Oculto"}
                        </span>
                        {!product.is_available && (
                          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            Agotado
                          </span>
                        )}
                        {product.is_featured && (
                          <span className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                            Destacado
                          </span>
                        )}
                        {product.is_seasonal && (
                          <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                            Temporada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-secondary pt-3">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                      aria-label="Editar"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      className={`flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isVisible
                          ? "border-green-300 text-green-700 hover:bg-green-50"
                          : "border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                      aria-label={isVisible ? "Ocultar" : "Mostrar"}
                    >
                      {isVisible ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                      {isVisible ? "Ocultar" : "Mostrar"}
                    </button>
                    <button
                      onClick={() => setDeletingProduct(product)}
                      className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-error/30 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10"
                      aria-label="Eliminar"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="rounded-lg border border-secondary px-3 py-1.5 text-sm text-text transition-colors hover:bg-secondary/50 disabled:opacity-30"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1,
                  )
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0) {
                      const prev = arr[idx - 1];
                      if (p - prev > 1) acc.push("ellipsis");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 py-1.5 text-sm text-muted"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          item === currentPage
                            ? "bg-primary text-white"
                            : "border border-secondary text-text hover:bg-secondary/50"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="rounded-lg border border-secondary px-3 py-1.5 text-sm text-text transition-colors hover:bg-secondary/50 disabled:opacity-30"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete dialog */}
      {deletingProduct && (
        <DeleteProductDialog
          productId={deletingProduct.id}
          productName={deletingProduct.name}
          onClose={() => setDeletingProduct(null)}
        />
      )}
    </>
  );
}
