import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories ?? []} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
