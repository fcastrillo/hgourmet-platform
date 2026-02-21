import ProductCard from "./ProductCard";

const seasonal = [
  { id: 5, name: "Manteca de Cacao 1kg", price: 320 },
  { id: 6, name: "Set Boquillas Wilton x12", price: 189 },
  { id: 7, name: "Fondant Satin Ice 1kg", price: 280 },
  { id: 8, name: "Colorante en Gel Americolor", price: 95 },
];

const SeasonalSection = () => (
  <section className="container py-16 md:py-20">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
      Productos de <span className="text-gold">temporada</span>
    </h2>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {seasonal.map((p) => (
        <ProductCard key={p.name} {...p} badge="Temporada" />
      ))}
    </div>
  </section>
);

export default SeasonalSection;
