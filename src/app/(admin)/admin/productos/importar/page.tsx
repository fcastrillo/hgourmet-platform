import Link from "next/link";
import { ProductCsvImportPanel } from "@/components/admin/ProductCsvImportPanel";

export const metadata = { title: "Importar CSV — HGourmet Admin" };

export default function ImportarProductosPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/admin/productos" className="hover:text-primary">
          Productos
        </Link>
        <span>/</span>
        <span className="text-text">Importar CSV</span>
      </nav>

      <ProductCsvImportPanel />
    </div>
  );
}
