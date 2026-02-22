import { fetchAllCategoriesAdmin } from "@/lib/supabase/queries/admin-categories";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NuevoProductoPage() {
  const categoriesWithCount = await fetchAllCategoriesAdmin();

  const categories = categoriesWithCount.map(({ id, name, slug, description, display_order, is_active, created_at }) => ({
    id,
    name,
    slug,
    description,
    display_order,
    is_active,
    created_at,
  }));

  return <ProductForm categories={categories} />;
}
