import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bakery.jpg";
import logoImg from "@/assets/logo.png"; // HGourmet logo

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Repostería gourmet" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-chocolate/60" />
    </div>
    <div className="relative container py-24 md:py-40 text-center">
      <img src={logoImg} alt="HGourmet" className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-6 animate-fade-in-up" />
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-card mb-4 animate-fade-in-up">
        Ingredientes <span className="text-gold">premium</span> para
        <br className="hidden md:block" /> tus creaciones
      </h1>
      <p className="text-card/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 italic" style={{ animationDelay: "0.2s" }}>
        Hagamos magia, hagamos repostería
      </p>
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg"
      >
        Explora nuestro catálogo
        <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

export default HeroSection;
