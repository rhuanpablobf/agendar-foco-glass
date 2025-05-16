
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompanyDashboard from "./pages/dashboard/Company";
import AdminDashboard from "./pages/dashboard/Admin";
import Schedule from "./pages/dashboard/Schedule";
import Team from "./pages/dashboard/Team";
import Services from "./pages/dashboard/Services";
import Clients from "./pages/dashboard/Clients";
import Financial from "./pages/dashboard/Financial";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rotas de autenticação */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/registrar" element={<Register />} />
          
          {/* Rotas de empresa */}
          <Route path="/dashboard" element={<CompanyDashboard />} />
          <Route path="/agenda" element={<Schedule />} />
          <Route path="/equipe" element={<Team />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/financeiro" element={<Financial />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/configuracoes" element={<Settings />} />
          
          {/* Rotas de admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/empresas" element={<AdminDashboard />} />
          <Route path="/admin/planos" element={<AdminDashboard />} />
          <Route path="/admin/configuracoes" element={<AdminDashboard />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
