import { Link } from "react-router-dom";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const whatsappMessage = () => {
    const lines = items.map(
      (i) => `- ${i.quantity}x ${i.name} - $${(i.price * i.quantity).toLocaleString("es-MX")}`
    );
    const msg = `Hola HGourmet! Quiero hacer un pedido:%0A%0A${lines.join("%0A")}%0A%0ATotal: $${totalPrice.toLocaleString("es-MX")}%0A%0AGracias!`;
    window.open(`https://wa.me/525533997230?text=${msg}`, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-card shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-foreground">Tu carrito</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingCart size={64} className="text-muted-foreground/40" />
              <p className="text-muted-foreground text-lg">Tu carrito está vacío</p>
              <Link
                to="/catalogo"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C9A96E" }}
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 p-3 rounded-xl bg-muted/50">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toLocaleString("es-MX")} c/u</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors" aria-label="Eliminar">
                      <Trash2 size={16} />
                    </button>
                    <span className="text-sm font-semibold text-foreground">
                      ${(item.price * item.quantity).toLocaleString("es-MX")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">${totalPrice.toLocaleString("es-MX")}</span>
            </div>
            <button
              onClick={whatsappMessage}
              className="w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "hsl(142, 70%, 40%)" }}
            >
              Enviar pedido por WhatsApp
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: "#C9A96E", color: "#C9A96E" }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
