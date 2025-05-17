
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { PermissionProvider } from "./hooks/usePermission";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// Componente para redirecionar com base no perfil de usuário
const ProfileRedirect = () => {
  // Simulação de verificação de perfil - em produção, use um hook/contexto de autenticação
  const [userRole, setUserRole] = useState<'admin' | 'company' | null>(null);
  
  useEffect(() => {
    // Simulação de verificação de usuário logado
    const checkUserRole = () => {
      // Em produção, isso seria baseado no login real
      // Aqui estamos apenas simulando baseado na última rota visitada
      const lastPath = localStorage.getItem('lastPath') || '';
      
      if (lastPath.includes('admin')) {
        setUserRole('admin');
      } else if (lastPath.includes('dashboard')) {
        setUserRole('company');
      } else {
        // Valor padrão para demonstração
        setUserRole('company');
      }
    };
    
    checkUserRole();
  }, []);
  
  if (!userRole) return null; // Renderizar um loading state enquanto verifica
  
  if (userRole === 'admin') return <Navigate to="/admin" replace />;
  if (userRole === 'company') return <Navigate to="/dashboard" replace />;
  
  return <Navigate to="/auth/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PermissionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota inicial pública */}
            <Route path="/" element={<Index />} />
            
            {/* Rotas de autenticação */}
            <Route path="/auth">
              <Route path="login" element={<Login />} />
              <Route path="registrar" element={<Register />} />
            </Route>
            
            {/* Redirecionamento após login baseado no perfil */}
            <Route path="/profile" element={<ProfileRedirect />} />
            
            {/* Rotas de empresa (dashboard) */}
            <Route path="/dashboard">
              <Route index element={<CompanyDashboard />} />
              <Route path="schedule" element={
                <ProtectedRoute requiredPermission="agenda">
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="professionals" element={
                <ProtectedRoute requiredPermission="professionals">
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="services" element={
                <ProtectedRoute requiredPermission="services">
                  <Services />
                </ProtectedRoute>
              } />
              <Route path="clients" element={
                <ProtectedRoute requiredPermission="clients">
                  <Clients />
                </ProtectedRoute>
              } />
              <Route path="financial" element={
                <ProtectedRoute requiredPermission="financial">
                  <Financial />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute requiredPermission="reports">
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requiredPermission="settings">
                  <Settings />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Rotas de administrador - updated to use the same component but with different paths */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<AdminDashboard />} />
            <Route path="/admin/plans" element={<AdminDashboard />} />
            <Route path="/admin/subadmins" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
            
            {/* Redirecionamentos para manter compatibilidade temporária */}
            <Route path="/agenda" element={<Navigate to="/dashboard/schedule" replace />} />
            <Route path="/equipe" element={<Navigate to="/dashboard/professionals" replace />} />
            <Route path="/servicos" element={<Navigate to="/dashboard/services" replace />} />
            <Route path="/clientes" element={<Navigate to="/dashboard/clients" replace />} />
            <Route path="/financeiro" element={<Navigate to="/dashboard/financial" replace />} />
            <Route path="/relatorios" element={<Navigate to="/dashboard/reports" replace />} />
            <Route path="/configuracoes" element={<Navigate to="/dashboard/settings" replace />} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PermissionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
