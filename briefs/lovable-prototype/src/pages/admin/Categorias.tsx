import { useState } from "react";
import { Plus, Pencil, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const initialCategories = [
  { id: 1, name: "Chocolates", products: 87, visible: true },
  { id: 2, name: "Harinas", products: 42, visible: true },
  { id: 3, name: "Sprinkles", products: 63, visible: true },
  { id: 4, name: "Moldes", products: 51, visible: true },
  { id: 5, name: "Materia Prima", products: 58, visible: true },
  { id: 6, name: "Accesorios", products: 23, visible: false },
];

const Categorias = () => {
  const [categories, setCategories] = useState(initialCategories);

  const toggle = (id: number) =>
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-muted-foreground text-sm">{categories.length} categorías registradas</p>
        <Button className="gap-2">
          <Plus size={16} /> Agregar categoría
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-center">Productos</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-center">{cat.products}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={cat.visible ? "default" : "secondary"}>
                    {cat.visible ? "Visible" : "Oculta"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Pencil size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggle(cat.id)}>
                      {cat.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Categorias;
