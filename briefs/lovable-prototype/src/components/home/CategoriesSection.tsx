import { Candy, WheatOff, Sparkles, CakeSlice, Droplets, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Chocolates", icon: Candy },
  { name: "Harinas", icon: WheatOff },
  { name: "Sprinkles", icon: Sparkles },
  { name: "Moldes", icon: CakeSlice },
  { name: "Materia Prima", icon: Droplets },
  { name: "Accesorios", icon: Wrench },
];

const CategoriesSection = () => (
  <section className="container py-16 md:py-20">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
      Nuestras <span className="text-gold">Categorías</span>
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          to={`/catalogo?categoria=${encodeURIComponent(cat.name)}`}
          className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-rose/50 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <cat.icon size={26} className="text-chocolate" />
          </div>
          <span className="text-sm font-medium text-center">{cat.name}</span>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoriesSection;
