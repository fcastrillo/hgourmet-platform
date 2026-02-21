import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { recipes } from "@/data/recipes";
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

const Recetas = () => (
  <div className="container py-10 md:py-16">
    <div className="mb-10 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        Recetas & <span className="text-gold">Tips</span>
      </h1>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Inspírate con nuestras recetas elaboradas con ingredientes gourmet seleccionados.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="group rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
        >
          {/* Image placeholder */}
          <div className="aspect-video overflow-hidden">
            <img src={recipeImages[recipe.id]} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h2 className="font-bold text-base md:text-lg mb-1 group-hover:text-gold transition-colors leading-snug">
              {recipe.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2">
              {recipe.excerpt}
            </p>
            <Link
              to={`/recetas/${recipe.id}`}
              className="inline-flex items-center gap-1.5 self-start px-4 py-2 rounded-lg bg-gold/15 text-gold font-semibold text-sm hover:bg-gold hover:text-primary-foreground transition-colors"
            >
              Ver receta <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Recetas;
