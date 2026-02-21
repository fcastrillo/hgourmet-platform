import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Upload, Pencil, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/products";

const dummyProducts = [
  { id: 1, name: "Chocolate Callebaut 70%", category: "Chocolates", price: 189, stock: true, visible: true },
  { id: 2, name: "Harina de Almendra 500g", category: "Harinas", price: 145, stock: true, visible: true },
  { id: 3, name: "Sprinkles Arcoíris", category: "Sprinkles", price: 65, stock: true, visible: true },
  { id: 4, name: "Molde Silicón Rosas", category: "Moldes", price: 235, stock: false, visible: true },
  { id: 5, name: "Manteca de Cacao 1kg", category: "Materia Prima", price: 320, stock: true, visible: true },
  { id: 6, name: "Set Boquillas Wilton x12", category: "Accesorios", price: 189, stock: true, visible: false },
  { id: 7, name: "Fondant Satin Ice 1kg", category: "Accesorios", price: 280, stock: true, visible: true },
  { id: 8, name: "Colorante en Gel Americolor", category: "Materia Prima", price: 95, stock: false, visible: true },
  { id: 9, name: "Harina de Avena Fina 1kg", category: "Harinas", price: 110, stock: true, visible: true },
  { id: 10, name: "Papel Vegetal Antiadherente", category: "Accesorios", price: 55, stock: true, visible: false },
];

const Productos = () => {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const filtered = dummyProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter ? p.category === catFilter : true;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white h-9 text-sm"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-white text-sm font-medium hover:bg-muted/30 transition-colors">
            <Upload size={14} /> Importar CSV
          </button>
          <Link
            to="/admin/productos/nuevo"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-chocolate text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={15} /> Agregar producto
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground text-xs uppercase">
                <th className="text-left px-4 py-3 font-medium">Miniatura</th>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Categoría</th>
                <th className="text-left px-4 py-3 font-medium">Precio</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-rose/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-chocolate/40">IMG</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3">${p.price.toFixed(2)} MXN</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.stock ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {p.stock ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.visible ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"
                    }`}>
                      {p.visible ? "Visible" : "Oculto"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/productos/${p.id}/editar`}
                        className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                        title="Ocultar"
                      >
                        <EyeOff size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Productos;
