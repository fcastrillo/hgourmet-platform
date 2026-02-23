import { fetchAllRecipesAdmin } from "@/lib/supabase/queries/admin-recipes";
import { RecipeTable } from "@/components/admin/RecipeTable";

export default async function RecetasAdminPage() {
  const recipes = await fetchAllRecipesAdmin();

  return <RecipeTable recipes={recipes} />;
}
