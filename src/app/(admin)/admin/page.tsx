import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const cards = [
    { title: "Productos", description: "Gestiona el catálogo de productos", href: "/admin/productos", count: null },
    { title: "Categorías", description: "Organiza las categorías del catálogo", href: "/admin/categorias", count: null },
    { title: "Banners", description: "Administra los banners promocionales", href: "/admin/banners", count: null },
    { title: "Marcas", description: "Gestiona las marcas y proveedores", href: "/admin/marcas", count: null },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text">
          Hola{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Panel de administración de HGourmet
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-secondary bg-white p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <h2 className="font-heading text-lg font-semibold text-text group-hover:text-primary">
              {card.title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {card.description}
            </p>
            <p className="mt-4 text-xs font-medium text-primary">
              Próximamente →
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
