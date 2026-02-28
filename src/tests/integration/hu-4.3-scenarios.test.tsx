import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeCard } from "@/components/storefront/RecipeCard";
import RecetaNotFound from "@/app/(storefront)/recetas/[slug]/not-found";
import {
  parseRecipeContent,
  getRecipeExcerpt,
} from "@/lib/recipe-parser";
import type { Recipe } from "@/types/database";

// --- Fixtures ---

const publishedRecipe: Recipe = {
  id: "r1",
  title: "Brownies de Chocolate Callebaut",
  slug: "brownies-de-chocolate-callebaut",
  content: [
    "## Ingredientes",
    "",
    "- 200g Chocolate Callebaut 70%",
    "- 150g mantequilla sin sal",
    "- 200g azúcar moscabado",
    "",
    "## Preparación",
    "",
    "1. Precalentar el horno a 175°C.",
    "2. Derretir el chocolate con mantequilla.",
    "3. Mezclar huevos y azúcar.",
    "",
    "## Tip HGourmet",
    "",
    "Deja reposar los brownies 1 hora antes de cortarlos.",
  ].join("\n"),
  ingredients_text: null,
  preparation_text: null,
  tip_text: null,
  image_url: "https://example.supabase.co/storage/v1/object/public/recipe-images/brownies.jpg",
  is_published: true,
  display_order: 1,
  created_at: "2024-11-15T00:00:00Z",
  updated_at: "2024-11-15T00:00:00Z",
};

const noImageRecipe: Recipe = {
  ...publishedRecipe,
  id: "r2",
  title: "Cupcakes de Vainilla con Fondant",
  slug: "cupcakes-de-vainilla-con-fondant",
  image_url: null,
  display_order: 2,
};

const unstructuredRecipe: Recipe = {
  ...publishedRecipe,
  id: "r3",
  title: "Receta sin estructura",
  slug: "receta-sin-estructura",
  content: "Contenido libre sin secciones markdown estructuradas.",
  image_url: null,
  display_order: 3,
};

// ============================================================
// HU-4.3 — Sección de recetas y tips
// ============================================================

describe("HU-4.3 — Sección de recetas y tips", () => {
  // --- parseRecipeContent ---

  describe("parseRecipeContent — Content Rendering Contract", () => {
    it("parsea sección Ingredientes como lista de items", () => {
      const sections = parseRecipeContent(publishedRecipe.content);
      const ingredientes = sections.find((s) => s.type === "ingredientes");

      expect(ingredientes).toBeDefined();
      expect(ingredientes?.type).toBe("ingredientes");
      if (ingredientes?.type === "ingredientes") {
        expect(ingredientes.items).toContain("200g Chocolate Callebaut 70%");
        expect(ingredientes.items).toContain("150g mantequilla sin sal");
      }
    });

    it("parsea sección Preparación como lista de pasos ordenados", () => {
      const sections = parseRecipeContent(publishedRecipe.content);
      const preparacion = sections.find((s) => s.type === "preparacion");

      expect(preparacion).toBeDefined();
      if (preparacion?.type === "preparacion") {
        expect(preparacion.steps[0]).toBe("Precalentar el horno a 175°C.");
        expect(preparacion.steps).toHaveLength(3);
      }
    });

    it("parsea sección Tip HGourmet como bloque de tip", () => {
      const sections = parseRecipeContent(publishedRecipe.content);
      const tip = sections.find((s) => s.type === "tip");

      expect(tip).toBeDefined();
      if (tip?.type === "tip") {
        expect(tip.text).toContain("reposar los brownies");
      }
    });

    it("retorna fallback de texto para contenido sin estructura de secciones ##", () => {
      const sections = parseRecipeContent(unstructuredRecipe.content);

      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe("text");
      if (sections[0].type === "text") {
        expect(sections[0].content).toContain("Contenido libre");
      }
    });

    it("retorna array vacío seguro para contenido vacío (no lanza excepción)", () => {
      const sections = parseRecipeContent("");
      expect(Array.isArray(sections)).toBe(true);
    });
  });

  // --- getRecipeExcerpt ---

  describe("getRecipeExcerpt — generación de resumen para cards", () => {
    it("extrae el primer ítem de la lista de ingredientes como excerpt", () => {
      const excerpt = getRecipeExcerpt(publishedRecipe.content);
      expect(excerpt).toBe("200g Chocolate Callebaut 70%");
    });

    it("retorna string vacío para contenido vacío", () => {
      expect(getRecipeExcerpt("")).toBe("");
    });

    it("recorta excerpt al maxLength especificado y añade ellipsis", () => {
      const longContent = "- " + "A".repeat(200);
      const excerpt = getRecipeExcerpt(longContent, 50);
      expect(excerpt.length).toBeLessThanOrEqual(53); // 50 + "…"
      expect(excerpt.endsWith("…")).toBe(true);
    });
  });

  // --- RecipeCard — Scenario 1: Listado de recetas ---

  describe("Scenario 1: RecipeCard — listado con imagen y datos", () => {
    it("muestra el título de la receta", () => {
      render(<RecipeCard recipe={publishedRecipe} />);
      expect(
        screen.getByText("Brownies de Chocolate Callebaut"),
      ).toBeInTheDocument();
    });

    it("muestra imagen cuando image_url está presente", () => {
      render(<RecipeCard recipe={publishedRecipe} />);
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("alt", publishedRecipe.title);
    });

    it("muestra placeholder cuando no hay imagen", () => {
      render(<RecipeCard recipe={noImageRecipe} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.getByText("Sin imagen")).toBeInTheDocument();
    });

    it("muestra CTA 'Ver receta'", () => {
      render(<RecipeCard recipe={publishedRecipe} />);
      expect(screen.getByText("Ver receta")).toBeInTheDocument();
    });

    it("el enlace de la card apunta a /recetas/[slug]", () => {
      render(<RecipeCard recipe={publishedRecipe} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        `/recetas/${publishedRecipe.slug}`,
      );
    });

    it("muestra excerpt del contenido en la card", () => {
      render(<RecipeCard recipe={publishedRecipe} />);
      expect(
        screen.getByText("200g Chocolate Callebaut 70%"),
      ).toBeInTheDocument();
    });
  });

  // --- RecetaNotFound — Scenario 3: slug inválido/no publicado ---

  describe("Scenario 3: RecetaNotFound — slug inválido o no publicado", () => {
    it("muestra mensaje 'Receta no encontrada'", () => {
      render(<RecetaNotFound />);
      expect(
        screen.getByText(/receta no encontrada/i),
      ).toBeInTheDocument();
    });

    it("muestra texto explicativo", () => {
      render(<RecetaNotFound />);
      expect(
        screen.getByText(/esta receta no está disponible/i),
      ).toBeInTheDocument();
    });

    it("muestra enlace 'Volver a recetas' apuntando a /recetas", () => {
      render(<RecetaNotFound />);
      const link = screen.getByRole("link", { name: /volver a recetas/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/recetas");
    });
  });
});
