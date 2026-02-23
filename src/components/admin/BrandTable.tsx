"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  reorderBrands,
  toggleBrandActive,
} from "@/app/(admin)/admin/marcas/actions";
import { DeleteBrandDialog } from "./DeleteBrandDialog";
import type { Brand } from "@/types/database";

interface BrandTableProps {
  brands: Brand[];
}

export function BrandTable({ brands }: BrandTableProps) {
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [isReordering, startReorder] = useTransition();
  const [, startToggle] = useTransition();
  const [activeOverrides, setActiveOverrides] = useState<
    Record<string, boolean>
  >({});

  function getEffectiveActive(brand: Brand): boolean {
    return brand.id in activeOverrides
      ? activeOverrides[brand.id]
      : brand.is_active;
  }

  function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= brands.length) return;

    const newOrder = brands.map((b) => b.id);
    [newOrder[index], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[index],
    ];

    startReorder(async () => {
      await reorderBrands(newOrder);
    });
  }

  function handleToggle(brand: Brand) {
    const newActive = !getEffectiveActive(brand);
    setActiveOverrides((prev) => ({ ...prev, [brand.id]: newActive }));

    startToggle(async () => {
      await toggleBrandActive(brand.id, newActive);
      setActiveOverrides((prev) => {
        const next = { ...prev };
        delete next[brand.id];
        return next;
      });
    });
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text">
            Marcas
          </h1>
          <p className="mt-1 text-sm text-muted">
            {brands.length} marca{brands.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/marcas/nuevo"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          + Nueva marca
        </Link>
      </div>

      {brands.length === 0 ? (
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
              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6h.008v.008H6V6Z"
            />
          </svg>
          <p className="mt-4 text-sm font-medium text-text">
            No hay marcas
          </p>
          <p className="mt-1 text-xs text-muted">
            Agrega la primera marca para la sección &ldquo;Nuestras Marcas&rdquo;.
          </p>
          <Link
            href="/admin/marcas/nuevo"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            + Nueva marca
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-secondary md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-secondary bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Orden
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Logo
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Sitio web
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {brands.map((brand, index) => {
                  const isActive = getEffectiveActive(brand);
                  return (
                    <tr
                      key={brand.id}
                      className="bg-white transition-colors hover:bg-secondary/10"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0 || isReordering}
                            className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                            aria-label="Subir"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 15.75l7.5-7.5 7.5 7.5"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMove(index, "down")}
                            disabled={
                              index === brands.length - 1 || isReordering
                            }
                            className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                            aria-label="Bajar"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </button>
                          <span className="ml-1 text-xs text-muted">
                            {brand.display_order}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {brand.logo_url ? (
                          <img
                            src={brand.logo_url}
                            alt={brand.name}
                            className="h-10 w-10 rounded-md object-contain"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary/50 text-xs text-muted">
                            —
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-text">{brand.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        {brand.website_url ? (
                          <span
                            className="max-w-[200px] truncate text-xs text-muted"
                            title={brand.website_url}
                          >
                            {brand.website_url}
                          </span>
                        ) : (
                          <span className="text-xs text-muted/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isActive ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/marcas/${brand.id}/editar`}
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                            aria-label="Editar"
                            title="Editar"
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
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleToggle(brand)}
                            className={`rounded-lg p-2 transition-colors ${
                              isActive
                                ? "text-green-600 hover:bg-green-50 hover:text-green-700"
                                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            }`}
                            aria-label={isActive ? "Desactivar" : "Activar"}
                            title={isActive ? "Desactivar" : "Activar"}
                          >
                            {isActive ? (
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
                                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                              </svg>
                            ) : (
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
                                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => setDeletingBrand(brand)}
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-error/10 hover:text-error"
                            aria-label="Eliminar"
                            title="Eliminar"
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
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
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
            {brands.map((brand, index) => {
              const isActive = getEffectiveActive(brand);
              return (
                <div
                  key={brand.id}
                  className="rounded-xl border border-secondary bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="h-12 w-12 flex-shrink-0 rounded-md object-contain"
                      />
                    ) : (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-secondary/50 text-xs text-muted">
                        —
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-text">{brand.name}</h3>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isActive ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        Orden: {brand.display_order}
                        {brand.website_url && ` · ${brand.website_url}`}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0 || isReordering}
                        className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                        aria-label="Subir"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15.75l7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={
                          index === brands.length - 1 || isReordering
                        }
                        className="rounded p-1 text-muted transition-colors hover:bg-secondary hover:text-text disabled:opacity-30"
                        aria-label="Bajar"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-secondary pt-3">
                    <Link
                      href={`/admin/marcas/${brand.id}/editar`}
                      className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                      aria-label="Editar"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleToggle(brand)}
                      className={`flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isActive
                          ? "border-green-300 text-green-700 hover:bg-green-50"
                          : "border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                      aria-label={isActive ? "Desactivar" : "Activar"}
                    >
                      {isActive ? (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      )}
                      {isActive ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => setDeletingBrand(brand)}
                      className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-error/30 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10"
                      aria-label="Eliminar"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {deletingBrand && (
        <DeleteBrandDialog
          brandId={deletingBrand.id}
          brandName={deletingBrand.name}
          onClose={() => setDeletingBrand(null)}
        />
      )}
    </>
  );
}
