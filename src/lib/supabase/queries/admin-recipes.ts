import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types/database";

export async function fetchAllRecipesAdmin(): Promise<Recipe[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as Recipe[] | null) ?? [];
}

export async function fetchRecipeByIdAdmin(id: string): Promise<Recipe | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  return data as Recipe | null;
}

export async function fetchMaxRecipeDisplayOrder(): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  return (data as { display_order: number } | null)?.display_order ?? 0;
}
