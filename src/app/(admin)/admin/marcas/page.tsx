import { fetchAllBrandsAdmin } from "@/lib/supabase/queries/admin-brands";
import { BrandTable } from "@/components/admin/BrandTable";

export default async function MarcasAdminPage() {
  const brands = await fetchAllBrandsAdmin();

  return <BrandTable brands={brands} />;
}
