import { notFound } from "next/navigation";
import { fetchBannerByIdAdmin } from "@/lib/supabase/queries/admin-banners";
import { BannerForm } from "@/components/admin/BannerForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarBannerPage({ params }: PageProps) {
  const { id } = await params;
  const banner = await fetchBannerByIdAdmin(id);

  if (!banner) {
    notFound();
  }

  return <BannerForm banner={banner} />;
}
