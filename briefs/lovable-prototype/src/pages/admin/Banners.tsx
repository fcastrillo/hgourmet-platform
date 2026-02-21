import { useState } from "react";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const initialBanners = [
  { id: 1, title: "Promoción Navidad 2024", order: 1, active: true },
  { id: 2, title: "Nuevos Chocolates Callebaut", order: 2, active: true },
  { id: 3, title: "Taller de Decoración", order: 3, active: false },
];

const Banners = () => {
  const [banners, setBanners] = useState(initialBanners);

  const toggleActive = (id: number) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-muted-foreground text-sm">{banners.length} banners configurados</p>
        <Button className="gap-2">
          <Plus size={16} /> Agregar banner
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Preview</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="text-center">Orden</TableHead>
              <TableHead className="text-center">Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="w-16 h-10 rounded bg-muted flex items-center justify-center">
                    <Image size={18} className="text-muted-foreground/40" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="text-center">{b.order}</TableCell>
                <TableCell className="text-center">
                  <Switch checked={b.active} onCheckedChange={() => toggleActive(b.id)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Pencil size={16} /></Button>
                    <Button variant="ghost" size="icon"><Trash2 size={16} className="text-destructive" /></Button>
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

export default Banners;
