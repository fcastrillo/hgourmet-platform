import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";

const ProductoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: isEdit ? "Chocolate Callebaut 70%" : "",
    description: isEdit ? "Chocolate belga de origen único con notas afrutadas y gran intensidad. Ideal para ganaches, trufas y coberturas premium." : "",
    price: isEdit ? "189" : "",
    category: isEdit ? "Chocolates" : "",
    available: true,
    visible: true,
  });

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder — no backend yet
    navigate("/admin/productos");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Name */}
      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Información general</h2>

        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre del producto</Label>
          <Input
            id="name"
            placeholder="Ej. Chocolate Callebaut 70%"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Describe el producto en 2-3 líneas..."
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Precio (MXN)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              required
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccionar...</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Image upload */}
      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Imagen</h2>
        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground hover:bg-muted/20 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload size={20} />
          </div>
          <p className="text-sm font-medium">Arrastra una imagen aquí</p>
          <p className="text-xs">o haz clic para seleccionar — PNG, JPG hasta 5 MB</p>
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Visibilidad</h2>

        {[
          { key: "available", label: "En stock", desc: "El producto está disponible para pedidos" },
          { key: "visible", label: "Visible en catálogo", desc: "Se muestra en el catálogo público" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form[key as "available" | "visible"]}
              onClick={() => set(key, !form[key as "available" | "visible"])}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                form[key as "available" | "visible"] ? "bg-chocolate" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  form[key as "available" | "visible"] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-chocolate hover:bg-chocolate/90 text-white font-semibold px-8"
        >
          {isEdit ? "Guardar cambios" : "Guardar producto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/productos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ProductoForm;
