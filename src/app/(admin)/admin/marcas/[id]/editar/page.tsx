import { notFound } from "next/navigation";
import { fetchBrandByIdAdmin } from "@/lib/supabase/queries/admin-brands";
import { BrandForm } from "@/components/admin/BrandForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarMarcaPage({ params }: PageProps) {
  const { id } = await params;
  const brand = await fetchBrandByIdAdmin(id);

  if (!brand) {
    notFound();
  }

  return <BrandForm brand={brand} />;
}
