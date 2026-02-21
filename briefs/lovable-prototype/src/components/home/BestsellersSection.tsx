import ProductCard from "./ProductCard";

const bestsellers = [
  { id: 1, name: "Chocolate Callebaut 70%", price: 189 },
  { id: 2, name: "Harina de Almendra 500g", price: 145 },
  { id: 3, name: "Sprinkles Arcoíris", price: 65 },
  { id: 4, name: "Molde Silicón Rosas", price: 235 },
];

const BestsellersSection = () => (
  <section className="bg-muted/50">
    <div className="container py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        Lo más <span className="text-gold">vendido</span>
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {bestsellers.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>
    </div>
  </section>
);

export default BestsellersSection;
