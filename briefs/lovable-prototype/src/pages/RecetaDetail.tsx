import { useParams, Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, Lightbulb } from "lucide-react";
import { getRecipe } from "@/data/recipes";
import imgBrownies from "@/assets/recipes/brownies-callebaut.jpg";
import imgCupcakes from "@/assets/recipes/cupcakes-fondant.jpg";
import imgGalletas from "@/assets/recipes/galletas-royal-icing.jpg";
import imgMousse from "@/assets/recipes/mousse-chocolate-blanco.jpg";
import imgZanahoria from "@/assets/recipes/pastel-zanahoria.jpg";
import imgMatcha from "@/assets/recipes/trufas-matcha.jpg";

const recipeImages: Record<number, string> = {
  1: imgBrownies,
  2: imgCupcakes,
  3: imgGalletas,
  4: imgMousse,
  5: imgZanahoria,
  6: imgMatcha,
};

const RecetaDetail = () => {
  const { id } = useParams();
  const recipe = getRecipe(Number(id));

  if (!recipe) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Receta no encontrada</h1>
        <Link to="/recetas" className="text-gold hover:underline">Volver a Recetas</Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <Link to="/recetas" className="hover:text-gold transition-colors">Recetas</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium truncate">{recipe.title}</span>
      </nav>

      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8">
        <img src={recipeImages[recipe.id]} alt={recipe.title} className="w-full h-full object-cover" />
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold mb-8 leading-tight">{recipe.title}</h1>

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gold">Ingredientes</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm md:text-base">
              <CheckCircle2 size={17} className="text-gold mt-0.5 shrink-0" />
              <span>{ing}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gold">Preparación</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold text-primary-foreground text-sm font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm md:text-base leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tip card */}
      <div className="rounded-xl bg-gold/15 border border-gold/30 p-5 flex gap-3">
        <Lightbulb size={22} className="text-gold shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gold mb-1">Tip HGourmet</p>
          <p className="text-sm leading-relaxed">{recipe.tip}</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/recetas"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold text-gold font-semibold hover:bg-gold hover:text-primary-foreground transition-colors"
        >
          ← Ver todas las recetas
        </Link>
      </div>
    </div>
  );
};

export default RecetaDetail;
