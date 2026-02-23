import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Catalogo from "./pages/Catalogo";
import ProductDetail from "./pages/ProductDetail";
import Recetas from "./pages/Recetas";
import RecetaDetail from "./pages/RecetaDetail";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Productos from "./pages/admin/Productos";
import ProductoForm from "./pages/admin/ProductoForm";
import Categorias from "./pages/admin/Categorias";
import Banners from "./pages/admin/Banners";
import RecetasAdmin from "./pages/admin/RecetasAdmin";
import Suscriptores from "./pages/admin/Suscriptores";

const queryClient = new QueryClient();

const PublicLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/catalogo/:id" element={<ProductDetail />} />
              <Route path="/recetas" element={<Recetas />} />
              <Route path="/recetas/:id" element={<RecetaDetail />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin backoffice */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<Productos />} />
              <Route path="productos/nuevo" element={<ProductoForm />} />
              <Route path="productos/:id/editar" element={<ProductoForm />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="banners" element={<Banners />} />
              <Route path="recetas" element={<RecetasAdmin />} />
              <Route path="suscriptores" element={<Suscriptores />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
