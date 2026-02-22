import { Suspense } from "react";
import {
  fetchProductsAdmin,
  fetchProductsCountAdmin,
} from "@/lib/supabase/queries/admin-products";
import { ProductTable } from "@/components/admin/ProductTable";

const PAGE_SIZE = 10;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function ProductosAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const search = params.search ?? "";

  const [products, totalCount] = await Promise.all([
    fetchProductsAdmin(page, PAGE_SIZE, search),
    fetchProductsCountAdmin(search),
  ]);

  return (
    <Suspense fallback={<div className="text-sm text-muted">Cargando productos...</div>}>
      <ProductTable
        products={products}
        totalCount={totalCount}
        currentPage={page}
        pageSize={PAGE_SIZE}
        currentSearch={search}
      />
    </Suspense>
  );
}
