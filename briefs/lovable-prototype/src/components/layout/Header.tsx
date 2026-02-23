import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, User, ShoppingCart } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/contexts/CartContext";
import RegisterModal from "./RegisterModal";
import CartDrawer from "./CartDrawer";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Catálogo", path: "/catalogo" },
  { label: "Recetas", path: "/recetas" },
  { label: "Contacto", path: "/contacto" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b shadow-sm">
        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HGourmet" className="h-10 md:h-12" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  location.pathname === item.path ? "text-gold" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {searchOpen && (
              <input
                type="text"
                placeholder="Buscar..."
                className="hidden md:block w-48 px-3 py-1.5 text-sm rounded-lg bg-muted border focus:outline-none focus:ring-2 focus:ring-gold"
                autoFocus
              />
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            {/* User icon */}
            <button
              onClick={() => setRegisterOpen(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Registro"
            >
              <User size={20} />
            </button>

            {/* Cart icon with badge */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              {totalItems >= 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-rose text-foreground">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-card">
            <div className="container py-4 space-y-1">
              <div className="pb-3">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 text-sm rounded-lg bg-muted border focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                    location.pathname === item.path ? "text-gold bg-muted" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
