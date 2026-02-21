import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const subs = [
  { email: "maria.lopez@gmail.com", date: "2024-12-18" },
  { email: "chef.carlos@outlook.com", date: "2024-12-15" },
  { email: "ana.repostera@yahoo.com", date: "2024-12-10" },
  { email: "dulces.merida@gmail.com", date: "2024-11-28" },
  { email: "pasteles.yuca@hotmail.com", date: "2024-11-20" },
  { email: "laura.bakes@gmail.com", date: "2024-11-15" },
  { email: "cocina.sur@outlook.com", date: "2024-10-30" },
  { email: "reposteria.mx@gmail.com", date: "2024-10-22" },
];

const Suscriptores = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-muted-foreground text-sm">{subs.length} suscriptores</p>
      <Button variant="outline" className="gap-2">
        <Download size={16} /> Exportar CSV
      </Button>
    </div>

    <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Fecha de registro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subs.map((s) => (
            <TableRow key={s.email}>
              <TableCell className="font-medium">{s.email}</TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">{s.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default Suscriptores;
