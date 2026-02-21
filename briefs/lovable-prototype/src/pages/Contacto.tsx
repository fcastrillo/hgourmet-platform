import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contacto = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder — no backend yet
    alert("¡Mensaje enviado! Nos pondremos en contacto pronto.");
  };

  return (
    <div className="container py-10 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Contáctanos
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Estamos para ayudarte. Escríbenos o visítanos en nuestra tienda en Mérida.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* ── Left column: info ─────────────────────────────── */}
        <div className="space-y-8">
          {/* Info items */}
          <ul className="space-y-5">
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold mb-0.5">Dirección</p>
                <p className="text-muted-foreground text-sm">Calle 60 #123, Centro<br />Mérida, Yucatán, México</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <Phone size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold mb-0.5">Teléfono</p>
                <a href="tel:+529991234567" className="text-muted-foreground text-sm hover:text-gold transition-colors">
                  +52 (999) 123-4567
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold mb-0.5">Email</p>
                <a href="mailto:hola@hgourmet.com" className="text-muted-foreground text-sm hover:text-gold transition-colors">
                  hola@hgourmet.com
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold mb-0.5">Horario</p>
                <p className="text-muted-foreground text-sm">Lun – Sáb: 9:00 – 18:00<br />Domingos: cerrado</p>
              </div>
            </li>
          </ul>

          {/* Map placeholder */}
          <div className="w-full h-52 rounded-xl bg-muted border flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <MapPin size={24} className="text-gold" />
            </div>
            <p className="text-sm font-medium">Mapa de ubicación</p>
            <p className="text-xs">Calle 60 #123, Centro, Mérida</p>
          </div>

          {/* Social buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/521XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-whatsapp text-card hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18} fill="currentColor" />
              WhatsApp
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
            >
              <Facebook size={18} fill="currentColor" />
              Facebook
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90 transition-opacity"
            >
              <Instagram size={18} />
              Instagram
            </a>
          </div>
        </div>

        {/* ── Right column: form ────────────────────────────── */}
        <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Envíanos un mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu nombre completo" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="¿En qué podemos ayudarte?"
                rows={5}
                required
                className="resize-none"
              />
            </div>
            <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-primary-foreground font-semibold py-5 text-base">
              Enviar mensaje
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
