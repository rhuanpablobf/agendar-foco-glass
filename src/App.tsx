
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
          
          {/* Rotas de admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
