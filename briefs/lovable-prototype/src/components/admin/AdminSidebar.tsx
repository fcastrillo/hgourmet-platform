import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Image,
  BookOpen,
  Users,
  ExternalLink,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Productos", href: "/admin/productos", icon: ShoppingBag },
  { label: "Categorías", href: "/admin/categorias", icon: Tag },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Recetas", href: "/admin/recetas", icon: BookOpen },
  { label: "Suscriptores", href: "/admin/suscriptores", icon: Users },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ open, onClose }: Props) => {
  const location = useLocation();

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "#5C3D2E" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <span className="text-white font-bold text-lg tracking-wide">HGourmet</span>
            <span className="block text-white/50 text-xs mt-0.5">Panel de administración</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-0.5 px-3">
            {navItems.map(({ label, href, icon: Icon, exact }) => (
              <li key={href}>
                <Link
                  to={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(href, exact)
                      ? "bg-white/20 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer link */}
        <div className="px-4 py-4 border-t border-white/10">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/55 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <ExternalLink size={15} />
            Ver sitio →
          </Link>
        </div>
      </aside>
    </>
  );
};

export const AdminSidebarTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="lg:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
    aria-label="Abrir menú"
  >
    <Menu size={20} />
  </button>
);
