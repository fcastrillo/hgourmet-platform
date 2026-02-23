import { notFound } from "next/navigation";
import { fetchRecipeByIdAdmin } from "@/lib/supabase/queries/admin-recipes";
import { RecipeForm } from "@/components/admin/RecipeForm";

interface EditarRecetaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarRecetaPage({ params }: EditarRecetaPageProps) {
  const { id } = await params;
  const recipe = await fetchRecipeByIdAdmin(id);

  if (!recipe) notFound();

  return <RecipeForm recipe={recipe} />;
}
