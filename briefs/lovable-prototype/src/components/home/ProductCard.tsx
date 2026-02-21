import { productImages } from "@/data/productImages";

interface ProductCardProps {
  id?: number;
  name: string;
  price: number;
  badge?: string;
}

const ProductCard = ({ id, name, price, badge }: ProductCardProps) => (
  <div className="group rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all overflow-hidden">
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
    <div className="p-4">
      <h3 className="font-medium text-sm mb-1 line-clamp-2">{name}</h3>
      <p className="text-gold font-bold">${price.toFixed(2)} MXN</p>
    </div>
  </div>
);

export default ProductCard;
