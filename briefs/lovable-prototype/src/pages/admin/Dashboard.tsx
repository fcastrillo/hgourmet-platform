import { Link } from "react-router-dom";
import { ShoppingBag, Eye, Users, Tag, Plus, Image, ArrowRight } from "lucide-react";

const metrics = [
  { label: "Total productos", value: "324", icon: ShoppingBag, color: "bg-chocolate/10 text-chocolate" },
  { label: "Activos", value: "298", icon: Eye, color: "bg-emerald-100 text-emerald-700" },
  { label: "Suscriptores", value: "45", icon: Users, color: "bg-gold/15 text-gold" },
  { label: "Categorías", value: "6", icon: Tag, color: "bg-rose/40 text-chocolate" },
];

const recentProducts = [
  { name: "Chocolate Callebaut 70%", category: "Chocolates", price: "$189.00", date: "19 feb 2026", status: "Visible" },
  { name: "Harina de Almendra 500g", category: "Harinas", price: "$145.00", date: "18 feb 2026", status: "Visible" },
  { name: "Sprinkles Arcoíris", category: "Sprinkles", price: "$65.00", date: "17 feb 2026", status: "Visible" },
  { name: "Fondant Satin Ice 1kg", category: "Accesorios", price: "$280.00", date: "15 feb 2026", status: "Oculto" },
  { name: "Colorante Americolor Gel", category: "Materia Prima", price: "$95.00", date: "14 feb 2026", status: "Visible" },
];

const Dashboard = () => (
  <div className="space-y-6">
    {/* Metrics */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-xl border p-5 shadow-sm flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.color}`}>
            <m.icon size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{m.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{m.label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Recent products table */}
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-sm">Últimos productos agregados</h2>
        <Link to="/admin/productos" className="text-xs text-gold hover:underline flex items-center gap-1">
          Ver todos <ArrowRight size={12} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground text-xs uppercase">
              <th className="text-left px-5 py-3 font-medium">Nombre</th>
              <th className="text-left px-5 py-3 font-medium">Categoría</th>
              <th className="text-left px-5 py-3 font-medium">Precio</th>
              <th className="text-left px-5 py-3 font-medium">Fecha</th>
              <th className="text-left px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentProducts.map((p, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-5 py-3">{p.price}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.date}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p.status === "Visible"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Quick actions */}
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h2 className="font-semibold text-sm mb-4">Acciones rápidas</h2>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-chocolate text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Agregar producto
        </Link>
        <Link
          to="/admin/banners"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold/15 text-gold text-sm font-semibold hover:bg-gold/25 transition-colors"
        >
          <Image size={16} /> Actualizar banner
        </Link>
        <Link
          to="/catalogo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold hover:bg-muted/30 transition-colors"
        >
          <ShoppingBag size={16} /> Ver catálogo
        </Link>
      </div>
    </div>
  </div>
);

export default Dashboard;
