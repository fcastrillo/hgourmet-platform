const brands = ["Callebaut", "Wilton", "Satin Ice", "Americolor", "Fleischmann", "Nestlé Pro"];

const BrandsSection = () => (
  <section className="bg-muted/50">
    <div className="container py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        Nuestras <span className="text-gold">marcas</span>
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div
            key={brand}
            className="flex items-center justify-center h-20 rounded-xl bg-card border shadow-sm"
          >
            <span className="text-sm font-semibold text-muted-foreground">{brand}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BrandsSection;
