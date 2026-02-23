import { fetchAllBannersAdmin } from "@/lib/supabase/queries/admin-banners";
import { BannerTable } from "@/components/admin/BannerTable";

export default async function BannersAdminPage() {
  const banners = await fetchAllBannersAdmin();

  return <BannerTable banners={banners} />;
}
