import { useState } from "react";
import { Plus, Pencil, EyeOff, Eye, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const initialRecetas = [
  { id: 1, title: "Brownies de Chocolate Callebaut", date: "2024-11-15", visible: true },
  { id: 2, title: "Cupcakes de Vainilla con Fondant", date: "2024-11-20", visible: true },
  { id: 3, title: "Galletas Decoradas con Royal Icing", date: "2024-12-01", visible: true },
  { id: 4, title: "Mousse de Chocolate Blanco", date: "2024-12-10", visible: false },
];

const RecetasAdmin = () => {
  const [recetas, setRecetas] = useState(initialRecetas);

  const toggle = (id: number) =>
    setRecetas((prev) => prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-muted-foreground text-sm">{recetas.length} recetas publicadas</p>
        <Button className="gap-2">
          <Plus size={16} /> Agregar receta
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Img</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recetas.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                    <Image size={16} className="text-muted-foreground/40" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{r.date}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={r.visible ? "default" : "secondary"}>
                    {r.visible ? "Visible" : "Oculta"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Pencil size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggle(r.id)}>
                      {r.visible ? <EyeOff size={16} /> : <Eye size={16} />}
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

export default RecetasAdmin;
