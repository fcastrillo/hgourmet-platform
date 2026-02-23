import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, ChevronRight, ShoppingCart, Plus, Minus } from "lucide-react";
import { getProduct, getRelatedProducts } from "@/data/products";
import { productImages } from "@/data/productImages";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const product = getProduct(Number(id));

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link to="/catalogo" className="text-gold hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const whatsappMsg = encodeURIComponent(`Hola, me interesa ${product.name} - $${product.price.toFixed(2)} MXN`);
  const whatsappUrl = `https://wa.me/525533997230?text=${whatsappMsg}`;

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <Link to="/catalogo" className="hover:text-gold transition-colors">Catálogo</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      {/* Product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-xl border overflow-hidden">
          <img src={productImages[product.id]} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <Link
            to={`/catalogo?cat=${encodeURIComponent(product.category)}`}
            className="inline-block self-start px-3 py-1 text-xs font-semibold rounded-full bg-gold/15 text-gold mb-4 hover:bg-gold/25 transition-colors"
          >
            {product.category}
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
              }`}
            >
              {product.inStock ? "En stock" : "Agotado"}
            </span>
          </div>

          <p className="text-3xl font-bold text-gold mb-8">${product.price.toFixed(2)} MXN</p>

          {/* Quantity selector */}
          {product.inStock && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-muted-foreground">Cantidad:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => {
                addItem({ id: product.id, name: product.name, price: product.price, image: productImages[product.id] }, qty);
                toast("Producto agregado al carrito", {
                  duration: 2000,
                  style: { background: "hsl(var(--gold))", color: "#fff", border: "none" },
                });
                setQty(1);
              }}
              disabled={!product.inStock}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gold text-gold-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={22} />
              Agregar al carrito
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-whatsapp text-card font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <MessageCircle size={22} fill="currentColor" />
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="text-2xl font-bold mb-8">
            Productos <span className="text-gold">relacionados</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/catalogo/${p.id}`}
                className="group rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={productImages[p.id]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${
                      p.inStock ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.inStock ? "En stock" : "Agotado"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-gold transition-colors">{p.name}</h3>
                  <p className="text-gold font-bold">${p.price.toFixed(2)} MXN</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
