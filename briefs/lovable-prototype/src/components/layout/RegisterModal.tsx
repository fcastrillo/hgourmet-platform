import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RegisterModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    setForm({ name: "", email: "", password: "", confirm: "" });
    toast.success("¡Registro exitoso! Bienvenido/a a HGourmet", { duration: 3000 });
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors" aria-label="Cerrar">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Crear cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nombre completo</label>
            <input
              type="text" required value={form.name} onChange={set("name")}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Correo electrónico</label>
            <input
              type="email" required value={form.email} onChange={set("email")}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
            <input
              type="password" required value={form.password} onChange={set("password")}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar contraseña</label>
            <input
              type="password" required value={form.confirm} onChange={set("confirm")}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#C9A96E" }}
          >
            Registrarme
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          ¿Ya tienes cuenta? <span className="text-primary font-medium">Inicia sesión</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
