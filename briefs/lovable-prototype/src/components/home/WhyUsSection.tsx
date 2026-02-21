import { Award, HeartHandshake, Truck } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Productos selectos",
    desc: "Trabajamos con las mejores marcas internacionales de repostería.",
  },
  {
    icon: HeartHandshake,
    title: "Atención personalizada",
    desc: "Te asesoramos para que encuentres exactamente lo que necesitas.",
  },
  {
    icon: Truck,
    title: "Envío en Mérida",
    desc: "Recibe tus pedidos cómodamente en toda la zona metropolitana.",
  },
];

const WhyUsSection = () => (
  <section className="container py-16 md:py-20">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
      ¿Por qué <span className="text-gold">elegirnos</span>?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reasons.map((r) => (
        <div key={r.title} className="text-center p-8 rounded-xl bg-card border shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center">
            <r.icon size={30} className="text-gold" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{r.title}</h3>
          <p className="text-sm text-muted-foreground">{r.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyUsSection;
