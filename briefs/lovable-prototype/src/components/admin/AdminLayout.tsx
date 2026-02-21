import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar, AdminSidebarTrigger } from "./AdminSidebar";

const sectionTitle: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/productos": "Productos",
  "/admin/productos/nuevo": "Nuevo producto",
  "/admin/categorias": "Categorías",
  "/admin/banners": "Banners",
  "/admin/recetas": "Recetas",
  "/admin/suscriptores": "Suscriptores",
};

const getTitle = (pathname: string) => {
  if (sectionTitle[pathname]) return sectionTitle[pathname];
  if (pathname.includes("/editar")) return "Editar producto";
  if (pathname.startsWith("/admin/productos")) return "Productos";
  return "Administración";
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F7F7F7" }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b px-4 md:px-6 h-14 flex items-center gap-4 shrink-0 shadow-sm">
          <AdminSidebarTrigger onClick={() => setSidebarOpen(true)} />
          <h1 className="font-semibold text-base md:text-lg text-foreground">{title}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
