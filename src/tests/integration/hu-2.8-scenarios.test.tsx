import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecipeTable } from "@/components/admin/RecipeTable";
import { RecipeForm } from "@/components/admin/RecipeForm";
import type { Recipe } from "@/types/database";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/recetas",
  useRouter: () => ({ push: vi.fn() }),
}));

const mockCreateRecipe = vi.fn();
const mockUpdateRecipe = vi.fn();
const mockDeleteRecipe = vi.fn();
const mockReorderRecipes = vi.fn();
const mockToggleRecipePublished = vi.fn();

vi.mock("@/app/(admin)/admin/recetas/actions", () => ({
  createRecipe: (...args: unknown[]) => mockCreateRecipe(...args),
  updateRecipe: (...args: unknown[]) => mockUpdateRecipe(...args),
  deleteRecipe: (...args: unknown[]) => mockDeleteRecipe(...args),
  reorderRecipes: (...args: unknown[]) => mockReorderRecipes(...args),
  toggleRecipePublished: (...args: unknown[]) => mockToggleRecipePublished(...args),
}));

const sampleRecipes: Recipe[] = [
  {
    id: "recipe-1",
    title: "Brownies de Chocolate Callebaut",
    slug: "brownies-de-chocolate-callebaut",
    content: "## Ingredientes\n\n- 200g Chocolate Callebaut",
    ingredients_text: "200g Chocolate Callebaut",
    preparation_text: "Precalentar el horno.",
    tip_text: null,
    image_url: "https://example.com/brownies.jpg",
    is_published: true,
    display_order: 1,
    created_at: "2024-11-15T00:00:00Z",
    updated_at: "2024-11-15T00:00:00Z",
  },
  {
    id: "recipe-2",
    title: "Cupcakes de Vainilla con Fondant",
    slug: "cupcakes-de-vainilla-con-fondant",
    content: "## Ingredientes\n\n- 250g harina",
    ingredients_text: "250g harina",
    preparation_text: "Mezclar.",
    tip_text: null,
    image_url: null,
    is_published: true,
    display_order: 2,
    created_at: "2024-11-20T00:00:00Z",
    updated_at: "2024-11-20T00:00:00Z",
  },
  {
    id: "recipe-3",
    title: "Mousse de Chocolate Blanco",
    slug: "mousse-de-chocolate-blanco",
    content: "## Ingredientes\n\n- 300g chocolate blanco",
    ingredients_text: "300g chocolate blanco",
    preparation_text: "Batir.",
    tip_text: null,
    image_url: null,
    is_published: false,
    display_order: 3,
    created_at: "2024-12-10T00:00:00Z",
    updated_at: "2024-12-10T00:00:00Z",
  },
];

describe("HU-2.8 — Gestión de recetas desde el panel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- RecipeTable: lista ---

  describe("RecipeTable — Lista de recetas", () => {
    it("muestra título, fecha y estado de cada receta", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      expect(screen.getAllByText("Brownies de Chocolate Callebaut").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Cupcakes de Vainilla con Fondant").length).toBeGreaterThanOrEqual(1);
    });

    it("muestra badge 'Visible' para recetas publicadas y 'Oculta' para despublicadas", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const visibleBadges = screen.getAllByText("Visible");
      const hiddentBadges = screen.getAllByText("Oculta");

      expect(visibleBadges.length).toBeGreaterThanOrEqual(2);
      expect(hiddentBadges.length).toBeGreaterThanOrEqual(1);
    });

    it("muestra estado vacío cuando no hay recetas", () => {
      render(<RecipeTable recipes={[]} />);

      expect(screen.getByText(/no hay recetas/i)).toBeInTheDocument();
      expect(screen.getByText(/agrega la primera receta/i)).toBeInTheDocument();
    });

    it("muestra link '+ Agregar receta'", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      expect(screen.getByRole("link", { name: /agregar receta/i })).toBeInTheDocument();
    });

    it("muestra imagen miniatura cuando existe image_url", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThanOrEqual(1);
    });
  });

  // --- ADR-009: icon buttons ---

  describe("RecipeTable — Icon buttons (ADR-009)", () => {
    it("muestra tres acciones por fila: Editar (link), Despublicar/Publicar, Eliminar", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      expect(within(firstRow).getByRole("link", { name: "Editar" })).toBeInTheDocument();
      expect(within(firstRow).getByRole("button", { name: "Despublicar" })).toBeInTheDocument();
      expect(within(firstRow).getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
    });

    it("muestra 'Publicar' para recetas despublicadas", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const unpublishedRow = rows[2] as HTMLElement;

      expect(within(unpublishedRow).getByRole("button", { name: "Publicar" })).toBeInTheDocument();
    });

    it("los icon buttons tienen tooltip nativo (atributo title)", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      expect(within(firstRow).getByTitle("Editar")).toBeInTheDocument();
      expect(within(firstRow).getByTitle("Despublicar")).toBeInTheDocument();
      expect(within(firstRow).getByTitle("Eliminar")).toBeInTheDocument();
    });
  });

  // --- Escenario 2: toggle despublicar (BDD) ---

  describe("Escenario 2: Toggle publicar/despublicar (optimista)", () => {
    it("llama a toggleRecipePublished(id, false) al hacer clic en Despublicar", async () => {
      mockToggleRecipePublished.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const toggleBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Despublicar" });
      await user.click(toggleBtn);

      expect(mockToggleRecipePublished).toHaveBeenCalledWith("recipe-1", false);
    });

    it("actualiza optimistamente el badge a 'Oculta' al despublicar", async () => {
      let resolveToggle!: (value: { success: boolean }) => void;
      mockToggleRecipePublished.mockReturnValueOnce(
        new Promise((resolve) => { resolveToggle = resolve; }),
      );
      const user = userEvent.setup();
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRow = rows[0] as HTMLElement;

      const toggleBtn = within(firstRow).getByRole("button", { name: "Despublicar" });
      await user.click(toggleBtn);

      await waitFor(() => {
        const badges = within(firstRow).getAllByText(/^(Visible|Oculta)$/);
        expect(badges.some((b) => b.textContent === "Oculta")).toBe(true);
      });

      resolveToggle({ success: true });
    });

    it("llama a toggleRecipePublished(id, true) al hacer clic en Publicar", async () => {
      mockToggleRecipePublished.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const toggleBtn = within(rows[2] as HTMLElement).getByRole("button", { name: "Publicar" });
      await user.click(toggleBtn);

      expect(mockToggleRecipePublished).toHaveBeenCalledWith("recipe-3", true);
    });
  });

  // --- Reordenamiento ---

  describe("RecipeTable — Reordenamiento", () => {
    it("muestra controles de subir/bajar por receta", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const upButtons = screen.getAllByLabelText("Subir");
      const downButtons = screen.getAllByLabelText("Bajar");

      expect(upButtons.length).toBeGreaterThanOrEqual(sampleRecipes.length);
      expect(downButtons.length).toBeGreaterThanOrEqual(sampleRecipes.length);
    });

    it("llama a reorderRecipes al mover una receta hacia abajo", async () => {
      mockReorderRecipes.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstRowDownBtn = within(rows[0] as HTMLElement).getByLabelText("Bajar");
      await user.click(firstRowDownBtn);

      expect(mockReorderRecipes).toHaveBeenCalledWith([
        "recipe-2",
        "recipe-1",
        "recipe-3",
      ]);
    });

    it("deshabilita botón 'Subir' en la primera receta", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const firstUpBtn = within(rows[0] as HTMLElement).getByLabelText("Subir");

      expect(firstUpBtn).toBeDisabled();
    });

    it("deshabilita botón 'Bajar' en la última receta", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const lastDownBtn = within(rows[rows.length - 1] as HTMLElement).getByLabelText("Bajar");

      expect(lastDownBtn).toBeDisabled();
    });
  });

  // --- Eliminar ---

  describe("RecipeTable — Eliminar receta", () => {
    it("abre dialog de confirmación al hacer clic en Eliminar", async () => {
      const user = userEvent.setup();
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Eliminar" });
      await user.click(deleteBtn);

      expect(screen.getByText(/eliminar receta/i, { selector: "h2" })).toBeInTheDocument();
      expect(screen.getByText(/Brownies de Chocolate Callebaut/, { selector: "strong" })).toBeInTheDocument();
    });

    it("llama a deleteRecipe al confirmar eliminación", async () => {
      mockDeleteRecipe.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      render(<RecipeTable recipes={sampleRecipes} />);

      const desktopTable = document.querySelector("table");
      const rows = desktopTable!.querySelectorAll("tbody tr");
      const deleteBtn = within(rows[0] as HTMLElement).getByRole("button", { name: "Eliminar" });
      await user.click(deleteBtn);

      const dialogDeleteBtn = screen.getAllByRole("button", { name: /eliminar$/i })
        .find((btn) => btn.closest("[class*='fixed']"));
      await user.click(dialogDeleteBtn!);

      expect(mockDeleteRecipe).toHaveBeenCalledWith("recipe-1");
    });
  });

  // --- Vista mobile ---

  describe("RecipeTable — Vista mobile", () => {
    it("muestra botones con icono y label visible en cards mobile", () => {
      render(<RecipeTable recipes={sampleRecipes} />);

      const mobileCards = document.querySelectorAll(".md\\:hidden > div");
      const firstCard = mobileCards[0] as HTMLElement;

      expect(within(firstCard).getByText("Editar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Despublicar")).toBeInTheDocument();
      expect(within(firstCard).getByText("Eliminar")).toBeInTheDocument();
    });
  });

  // --- Escenario 1: RecipeForm — Crear receta (BDD) ---

  describe("Escenario 1: RecipeForm — Crear receta exitosamente", () => {
    it("muestra el formulario con campos título, ingredientes, preparación e imagen", () => {
      render(<RecipeForm />);

      expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ingredientes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preparación/i)).toBeInTheDocument();
      expect(screen.getByText("Publicada")).toBeInTheDocument();
      expect(document.getElementById("is_published")).toBeInTheDocument();
    });

    it("muestra 'Crear receta' en modo creación", () => {
      render(<RecipeForm />);

      expect(screen.getByRole("button", { name: /crear receta/i })).toBeInTheDocument();
    });

    it("muestra 'Guardar cambios' en modo edición", () => {
      render(<RecipeForm recipe={sampleRecipes[0]} />);

      expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
    });

    it("pre-carga datos de la receta en modo edición", () => {
      render(<RecipeForm recipe={sampleRecipes[0]} />);

      expect(screen.getByDisplayValue("Brownies de Chocolate Callebaut")).toBeInTheDocument();
      expect(screen.getByDisplayValue(/200g Chocolate Callebaut/)).toBeInTheDocument();
    });



    it("muestra link 'Volver a recetas'", () => {
      render(<RecipeForm />);

      expect(screen.getByRole("link", { name: /volver a recetas/i })).toBeInTheDocument();
    });
  });

  // --- Escenario 3: RecipeForm — Validaciones (BDD) ---

  describe("Escenario 3: RecipeForm — Validaciones obligatorias (BDD escenario de error)", () => {
    it("muestra error 'El título es obligatorio.' al enviar sin título", async () => {
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      expect(screen.getByText("El título es obligatorio.")).toBeInTheDocument();
      expect(mockCreateRecipe).not.toHaveBeenCalled();
    });

    it("muestra error 'Los ingredientes son obligatorios.' al enviar sin ingredientes", async () => {
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Mi receta");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      expect(screen.getByText("Los ingredientes son obligatorios.")).toBeInTheDocument();
      expect(mockCreateRecipe).not.toHaveBeenCalled();
    });

    it("limpia el error de título al escribir en el campo", async () => {
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.click(screen.getByRole("button", { name: /crear receta/i }));
      expect(screen.getByText("El título es obligatorio.")).toBeInTheDocument();

      await user.type(screen.getByLabelText(/título/i), "B");
      expect(screen.queryByText("El título es obligatorio.")).not.toBeInTheDocument();
    });


    it("muestra error de servidor cuando createRecipe retorna error", async () => {
      mockCreateRecipe.mockResolvedValueOnce({ success: false, error: "Ya existe una receta con ese título." });
      const user = userEvent.setup();
      render(<RecipeForm />);

      await user.type(screen.getByLabelText(/título/i), "Brownies");
      await user.type(screen.getByLabelText(/ingredientes/i), "200g Chocolate");
      await user.type(screen.getByLabelText(/preparación/i), "Paso único");
      await user.click(screen.getByRole("button", { name: /crear receta/i }));

      await waitFor(() => {
        expect(screen.getByText("Ya existe una receta con ese título.")).toBeInTheDocument();
      });
    });
  });
});
