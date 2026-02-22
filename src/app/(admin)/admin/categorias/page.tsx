import { fetchAllCategoriesAdmin } from "@/lib/supabase/queries/admin-categories";
import { CategoryTable } from "@/components/admin/CategoryTable";

export default async function CategoriasAdminPage() {
  const categories = await fetchAllCategoriesAdmin();

  return <CategoryTable categories={categories} />;
}
