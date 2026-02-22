import { notFound } from "next/navigation";
import { fetchProductByIdAdmin } from "@/lib/supabase/queries/admin-products";
import { fetchAllCategoriesAdmin } from "@/lib/supabase/queries/admin-categories";
import { ProductForm } from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categoriesWithCount] = await Promise.all([
    fetchProductByIdAdmin(id),
    fetchAllCategoriesAdmin(),
  ]);

  if (!product) {
    notFound();
  }

  const categories = categoriesWithCount.map(({ id, name, slug, description, display_order, is_active, created_at }) => ({
    id,
    name,
    slug,
    description,
    display_order,
    is_active,
    created_at,
  }));

  return <ProductForm product={product} categories={categories} />;
}
