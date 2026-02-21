import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle, Send } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-chocolate text-chocolate-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="HGourmet" className="h-14 mb-3" />
            <p className="text-sm opacity-80">Tu tienda gourmet en Mérida</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Enlaces</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:text-gold transition-colors">Inicio</Link></li>
              <li><Link to="/catalogo" className="hover:text-gold transition-colors">Catálogo</Link></li>
              <li><Link to="/recetas" className="hover:text-gold transition-colors">Recetas</Link></li>
              <li><Link to="/contacto" className="hover:text-gold transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-gold/20 hover:bg-gold/30 transition-colors" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-gold/20 hover:bg-gold/30 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-gold/20 hover:bg-gold/30 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Boletín</h4>
            <p className="text-sm opacity-80 mb-3">Recibe ofertas y novedades</p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 px-3 py-2 text-sm rounded-l-lg bg-chocolate-foreground/10 border border-chocolate-foreground/20 text-chocolate-foreground placeholder:text-chocolate-foreground/50 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button className="px-3 py-2 rounded-r-lg bg-gold text-gold-foreground hover:opacity-90 transition-opacity" aria-label="Suscribirse">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-chocolate-foreground/20 text-center text-sm opacity-60">
          © 2026 HGourmet. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
