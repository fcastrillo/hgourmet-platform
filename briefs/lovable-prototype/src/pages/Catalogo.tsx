import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { products, categories, type Category } from "@/data/products";
import { productImages } from "@/data/productImages";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ITEMS_PER_PAGE = 8;

const Catalogo = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat && categories.includes(cat as Category)) {
      setSelectedCategories([cat as Category]);
    }
  }, [searchParams]);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const filtered = products.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category as Category)) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (onlyInStock && !p.inStock) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const filterContent = (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Categoría</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-3">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">{cat}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Precio (MXN)</h3>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={(v) => { setPriceRange(v); setPage(1); }}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Disponibilidad</h3>
        <div className="flex items-center gap-3">
          <Switch id="stock" checked={onlyInStock} onCheckedChange={(v) => { setOnlyInStock(v); setPage(1); }} />
          <Label htmlFor="stock" className="text-sm cursor-pointer">Solo en stock</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Nuestro <span className="text-gold">Catálogo</span>
      </h1>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 p-6 rounded-xl bg-card border shadow-sm">
            <h2 className="font-semibold text-lg mb-6">Filtros</h2>
            {filterContent}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button */}
          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border shadow-sm text-sm font-medium hover:bg-muted transition-colors">
                  <Filter size={16} />
                  Filtrar
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-card">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{filterContent}</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Product grid */}
          {paginated.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No se encontraron productos con los filtros seleccionados.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginated.map((p) => (
                <Link
                  key={p.id}
                  to={`/catalogo/${p.id}`}
                  className="group rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={productImages[p.id]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${
                        p.inStock ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.inStock ? "En stock" : "Agotado"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-gold transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-gold font-bold">${p.price.toFixed(2)} MXN</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1 ? "bg-gold text-gold-foreground" : "border bg-card hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
