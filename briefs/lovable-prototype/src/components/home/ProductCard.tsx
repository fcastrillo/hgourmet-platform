import { ShoppingCart } from "lucide-react";
import { productImages } from "@/data/productImages";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id?: number;
  name: string;
  price: number;
  badge?: string;
  inStock?: boolean;
}

const ProductCard = ({ id, name, price, badge, inStock = true }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id || !inStock) return;
    addItem({ id, name, price, image: productImages[id] });
    toast("Producto agregado al carrito", {
      duration: 2000,
      style: { background: "hsl(var(--gold))", color: "#fff", border: "none" },
    });
  };

  return (
    <div className="group relative rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        {id && productImages[id] ? (
          <img src={productImages[id]} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose/40 to-muted" />
        )}
        {badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-gold text-gold-foreground">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4 flex items-end justify-between gap-2">
        <div>
          <h3 className="font-medium text-sm mb-1 line-clamp-2">{name}</h3>
          <p className="text-gold font-bold">${price.toFixed(2)} MXN</p>
        </div>
        {id && inStock && (
          <button
            onClick={handleAddToCart}
            className="shrink-0 p-2 rounded-full bg-gold text-gold-foreground hover:opacity-90 transition-opacity shadow-md"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
