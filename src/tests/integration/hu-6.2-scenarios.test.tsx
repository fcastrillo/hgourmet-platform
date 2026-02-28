/**
 * HU-6.2 — Edición de recetas en campos estructurados (ingredientes, preparación, tip)
 *
 * BDD covered:
 *  AC1 — Captura estructurada sin Markdown obligatorio
 *  AC2 — Compatibilidad con contenido legacy (auto-migration on edit)
 *  AC3 — Escenario de excepción: validación por sección obligatoria
 *  + unit tests for recipe-content.ts helpers
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecipeForm } from "@/components/admin/RecipeForm";
import {
  getRecipeSections,
  buildContentFromStructured,
  buildSectionsFromStructured,
  extractFormFields,
} from "@/lib/recipe-content";
import type { Recipe } from "@/types/database";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/recetas",
  useRouter: () => ({ push: vi.fn() }),
}));

const mockCreateRecipe = vi.fn();
const mockUpdateRecipe = vi.fn();

vi.mock("@/app/(admin)/admin/recetas/actions", () => ({
  createRecipe: (...args: unknown[]) => mockCreateRecipe(...args),
  updateRecipe: (...args: unknown[]) => mockUpdateRecipe(...args),
  deleteRecipe: vi.fn(),
  reorderRecipes: vi.fn(),
  toggleRecipePublished: vi.fn(),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseRecipe = {
  id: "r1",
  slug: "brownies",
  image_url: null,
  is_published: true,
  display_order: 1,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
} satisfies Partial<Recipe>;

const legacyRecipe: Recipe = {
  ...baseRecipe,
  title: "Brownies Legacy",
  content: "## Ingredientes\n\n- 200g Chocolate Callebaut\n- 100g mantequilla\n\n## Preparación\n\n1. Precalentar el horno.\n2. Derretir el chocolate.\n\n## Tip HGourmet\n\nDejar reposar 1 hora en frío.",
  ingredients_text: null,
  preparation_text: null,
  tip_text: null,
};

const structuredRecipe: Recipe = {
  ...baseRecipe,
  title: "Brownies Estructurado",
  content: "## Ingredientes\n\n200g Chocolate Callebaut\n100g mantequilla",
  ingredients_text: "200g Chocolate Callebaut\n100g mantequilla",
  preparation_text: "Precalentar el horno.\nDerretir el chocolate.",
  tip_text: "Dejar reposar 1 hora en frío.",
};

const noTipRecipe: Recipe = {
  ...baseRecipe,
  title: "Sin Tip",
  content: "## Ingredientes\n\napple\n\n## Preparación\n\nstep1",
  ingredients_text: "apple",
  preparation_text: "step1",
  tip_text: null,
};

// ─── Unit tests — recipe-content.ts ──────────────────────────────────────────

describe("recipe-content.ts — getRecipeSections()", () => {
  it("AC2: legacy recipe (ingredients_text IS NULL) falls back to parseRecipeContent", () => {
    const sections = getRecipeSections(legacyRecipe);

    expect(sections.some((s) => s.type === "ingredientes")).toBe(true);
    expect(sections.some((s) => s.type === "preparacion")).toBe(true);
    expect(sections.some((s) => s.type === "tip")).toBe(true);
  });

  it("AC1: structured recipe (ingredients_text set) uses structured fields directly", () => {
    const sections = getRecipeSections(structuredRecipe);

    const ing = sections.find((s) => s.type === "ingredientes");
    const prep = sections.find((s) => s.type === "preparacion");
    const tip = sections.find((s) => s.type === "tip");

    expect(ing).toBeDefined();
    expect(ing?.type === "ingredientes" && ing.items).toEqual([
      "200g Chocolate Callebaut",
      "100g mantequilla",
    ]);
    expect(prep).toBeDefined();
    expect(prep?.type === "preparacion" && prep.steps).toEqual([
      "Precalentar el horno.",
      "Derretir el chocolate.",
    ]);
    expect(tip).toBeDefined();
    expect(tip?.type === "tip" && tip.text).toBe("Dejar reposar 1 hora en frío.");
  });

  it("AC1: structured recipe without tip omits tip section", () => {
    const sections = getRecipeSections(noTipRecipe);
    expect(sections.some((s) => s.type === "tip")).toBe(false);
  });
});

describe("recipe-content.ts — buildContentFromStructured()", () => {
  it("generates valid markdown from 3 fields", () => {
    const content = buildContentFromStructured(
      "200g Chocolate\n100g mantequilla",
      "Paso 1\nPaso 2",
      "Tip de prueba",
    );

    expect(content).toContain("## Ingredientes");
    expect(content).toContain("200g Chocolate");
    expect(content).toContain("## Preparación");
    expect(content).toContain("Paso 1");
    expect(content).toContain("## Tip HGourmet");
    expect(content).toContain("Tip de prueba");
  });

  it("omits tip section when tip is empty", () => {
    const content = buildContentFromStructured("ingrediente", "paso", "");
    expect(content).not.toContain("## Tip HGourmet");
  });
});

describe("recipe-content.ts — buildSectionsFromStructured()", () => {
  it("strips leading list markers from ingredients", () => {
    const sections = buildSectionsFromStructured(
      "- 200g Chocolate\n* 100g mantequilla",
      "Paso",
      "",
    );
    const ing = sections.find((s) => s.type === "ingredientes");
    expect(ing?.type === "ingredientes" && ing.items).toEqual([
      "200g Chocolate",
      "100g mantequilla",
    ]);
  });

  it("strips leading numbers from preparation steps", () => {
    const sections = buildSectionsFromStructured(
      "ingred",
      "1. Paso uno\n2. Paso dos",
      "",
    );
    const prep = sections.find((s) => s.type === "preparacion");
    expect(prep?.type === "preparacion" && prep.steps).toEqual([
      "Paso uno",
      "Paso dos",
    ]);
  });
});

describe("recipe-content.ts — extractFormFields()", () => {
  it("AC2: legacy recipe auto-parses markdown content into structured form fields", () => {
    const fields = extractFormFields(legacyRecipe);

    expect(fields.ingredients).toContain("200g Chocolate Callebaut");
    expect(fields.preparation).toContain("Precalentar el horno.");
    expect(fields.tip).toContain("Dejar reposar 1 hora en frío.");
  });

  it("AC1: structured recipe returns structured fields directly", () => {
    const fields = extractFormFields(structuredRecipe);

    expect(fields.ingredients).toBe("200g Chocolate Callebaut\n100g mantequilla");
    expect(fields.preparation).toBe("Precalentar el horno.\nDerretir el chocolate.");
    expect(fields.tip).toBe("Dejar reposar 1 hora en frío.");
  });

  it("AC1: structured recipe without tip returns empty string for tip", () => {
    const fields = extractFormFields(noTipRecipe);
    expect(fields.tip).toBe("");
  });
});

// ─── RecipeForm component tests ───────────────────────────────────────────────

describe("HU-6.2 — RecipeForm: 3 campos estructurados", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("AC1: campos del formulario sin Markdown obligatorio", () => {
    it("muestra campos: Título, Ingredientes, Preparación, Tip HGourmet, Publicada", () => {
      render(<RecipeForm />);

      expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ingredientes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preparación/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tip hgourmet/i)).toBeInTheDocument();
      expect(screen.getByText("Publicada")).toBeInTheDocument();
    });

    it("NO muestra el campo genérico 'Contenido' del diseño anterior", () => {
      render(<RecipeForm />);
      expect(screen.queryByLabelText(/^contenido/i)).not.toBeInTheDocument();
    });

    it("llama a createRecipe con FormData conteniendo ingredients, preparation y tip", async () => {
      mockCreateRecipe.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Receta de prueba");
      await user.type(screen.getByLabelText(/ingredientes/i), "100g azúcar");
      await user.type(screen.getByLabelText(/preparación/i), "Mezclar todo.");
      await user.type(screen.getByLabelText(/tip hgourmet/i), "Servir frío.");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      await waitFor(() => expect(mockCreateRecipe).toHaveBeenCalledOnce());

      const formData: FormData = mockCreateRecipe.mock.calls[0][0];
      expect(formData.get("ingredients")).toBe("100g azúcar");
      expect(formData.get("preparation")).toBe("Mezclar todo.");
      expect(formData.get("tip")).toBe("Servir frío.");
    });
  });

  describe("AC2: compatibilidad con recetas legacy", () => {
    it("pre-carga campos desde auto-parseo del content legacy", () => {
      render(<RecipeForm recipe={legacyRecipe} />);

      expect(screen.getByDisplayValue(/200g Chocolate Callebaut/)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Precalentar el horno/)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Dejar reposar 1 hora/)).toBeInTheDocument();
    });

    it("pre-carga campos desde los campos estructurados de receta nueva", () => {
      render(<RecipeForm recipe={structuredRecipe} />);

      expect(screen.getByDisplayValue(/200g Chocolate Callebaut/)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Precalentar el horno/)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Dejar reposar 1 hora/)).toBeInTheDocument();
    });

    it("muestra 'Guardar cambios' en modo edición", () => {
      render(<RecipeForm recipe={legacyRecipe} />);
      expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
    });

    it("llama a updateRecipe (no createRecipe) al guardar receta existente", async () => {
      mockUpdateRecipe.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<RecipeForm recipe={structuredRecipe} />);

      await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

      await waitFor(() => expect(mockUpdateRecipe).toHaveBeenCalledWith("r1", expect.any(FormData)));
      expect(mockCreateRecipe).not.toHaveBeenCalled();
    });
  });

  describe("AC3: escenario de excepción — validaciones por campo", () => {
    it("muestra error en 'Ingredientes' al intentar guardar sin ese campo", async () => {
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Receta");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      expect(screen.getByText("Los ingredientes son obligatorios.")).toBeInTheDocument();
      expect(mockCreateRecipe).not.toHaveBeenCalled();
    });

    it("muestra error en 'Preparación' al intentar guardar sin ese campo", async () => {
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Receta");
      await user.type(screen.getByLabelText(/ingredientes/i), "Un ingrediente");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      expect(screen.getByText("La preparación es obligatoria.")).toBeInTheDocument();
      expect(mockCreateRecipe).not.toHaveBeenCalled();
    });

    it("limpia el error de ingredientes al escribir en el campo", async () => {
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Receta");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));
      expect(screen.getByText("Los ingredientes son obligatorios.")).toBeInTheDocument();

      await user.type(screen.getByLabelText(/ingredientes/i), "X");
      expect(screen.queryByText("Los ingredientes son obligatorios.")).not.toBeInTheDocument();
    });

    it("el campo Tip es opcional — NO bloquea el envío si está vacío", async () => {
      mockCreateRecipe.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Receta sin tip");
      await user.type(screen.getByLabelText(/ingredientes/i), "Ingrediente");
      await user.type(screen.getByLabelText(/preparación/i), "Paso único");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      await waitFor(() => expect(mockCreateRecipe).toHaveBeenCalledOnce());
    });

    it("muestra error de servidor devuelto por createRecipe", async () => {
      mockCreateRecipe.mockResolvedValueOnce({
        success: false,
        error: "Ya existe una receta con ese título.",
      });
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Duplicado");
      await user.type(screen.getByLabelText(/ingredientes/i), "X");
      await user.type(screen.getByLabelText(/preparación/i), "Y");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      await waitFor(() => {
        expect(screen.getByText("Ya existe una receta con ese título.")).toBeInTheDocument();
      });
    });
  });
});
