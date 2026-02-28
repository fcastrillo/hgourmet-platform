/**
 * recipe-content.ts — HU-6.2: Structured Recipe Content Contract
 *
 * Priority rule for storefront rendering:
 *   1. Structured fields (ingredients_text, preparation_text, tip_text) — new recipes (HU-6.2+)
 *   2. Legacy fallback: parse markdown `content` field — pre-HU-6.2 recipes
 *
 * This ensures zero breaking changes for existing recipes.
 */

import {
  parseRecipeContent,
  IngredientsSection,
  StepsSection,
  TipSection,
  RecipeSection,
} from "@/lib/recipe-parser";
import type { Recipe } from "@/types/database";

/**
 * Returns renderable sections for a Recipe.
 * Uses structured fields when available; falls back to legacy markdown parsing.
 */
export function getRecipeSections(recipe: Recipe): RecipeSection[] {
  if (recipe.ingredients_text !== null && recipe.ingredients_text !== undefined) {
    return buildSectionsFromStructured(
      recipe.ingredients_text,
      recipe.preparation_text ?? "",
      recipe.tip_text ?? "",
    );
  }
  return parseRecipeContent(recipe.content);
}

/**
 * Builds renderable sections from the 3 plain-text structured fields.
 */
export function buildSectionsFromStructured(
  ingredientsText: string,
  preparationText: string,
  tipText: string,
): RecipeSection[] {
  const sections: RecipeSection[] = [];

  const ingredientItems = ingredientsText
    .split("\n")
    .map((l) => l.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
  if (ingredientItems.length > 0) {
    sections.push({ type: "ingredientes", items: ingredientItems });
  }

  const preparationSteps = preparationText
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s+/, "").replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
  if (preparationSteps.length > 0) {
    sections.push({ type: "preparacion", steps: preparationSteps });
  }

  const tip = tipText.trim();
  if (tip) {
    sections.push({ type: "tip", text: tip });
  }

  return sections;
}

/**
 * Derives a Markdown `content` string from the 3 structured fields.
 * Used by Server Actions to keep the legacy `content` column in sync,
 * so that RSS feeds, SEO, or any future consumer of `content` keeps working.
 */
export function buildContentFromStructured(
  ingredientsText: string,
  preparationText: string,
  tipText: string,
): string {
  const parts: string[] = [];
  if (ingredientsText.trim()) {
    parts.push(`## Ingredientes\n\n${ingredientsText.trim()}`);
  }
  if (preparationText.trim()) {
    parts.push(`## Preparación\n\n${preparationText.trim()}`);
  }
  if (tipText.trim()) {
    parts.push(`## Tip HGourmet\n\n${tipText.trim()}`);
  }
  return parts.join("\n\n");
}

/**
 * Extracts initial form field values from a Recipe for the admin form.
 *
 * Strategy:
 *  - Structured recipe (HU-6.2+): return structured fields directly.
 *  - Legacy recipe (only `content`): auto-parse markdown into structured fields
 *    so the admin can review and save in the new format without losing data.
 */
export function extractFormFields(recipe: Recipe): {
  ingredients: string;
  preparation: string;
  tip: string;
} {
  if (recipe.ingredients_text !== null && recipe.ingredients_text !== undefined) {
    return {
      ingredients: recipe.ingredients_text ?? "",
      preparation: recipe.preparation_text ?? "",
      tip: recipe.tip_text ?? "",
    };
  }

  const sections = parseRecipeContent(recipe.content);
  const ing = sections.find((s): s is IngredientsSection => s.type === "ingredientes");
  const prep = sections.find((s): s is StepsSection => s.type === "preparacion");
  const tip = sections.find((s): s is TipSection => s.type === "tip");

  return {
    ingredients: ing?.items.join("\n") ?? "",
    preparation: prep?.steps.join("\n") ?? "",
    tip: tip?.text ?? "",
  };
}
