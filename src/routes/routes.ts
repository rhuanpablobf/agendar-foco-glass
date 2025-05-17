
import CompanyDashboard from "@/pages/dashboard/Company";
import AdminDashboard from "@/pages/dashboard/Admin";
import Schedule from "@/pages/dashboard/Schedule";
import Team from "@/pages/dashboard/Team";
import Services from "@/pages/dashboard/Services";
import Clients from "@/pages/dashboard/Clients";
import Financial from "@/pages/dashboard/Financial";
import Reports from "@/pages/dashboard/Reports";
import Settings from "@/pages/dashboard/Settings";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Interface para definição de rota
interface RouteDefinition {
  path: string;
  component: React.ComponentType<any>;
  label?: string;
  icon?: string;
  showInMenu?: boolean;
}

// Rotas públicas
export const publicRoutes: RouteDefinition[] = [
  {
    path: "/",
    component: Index,
    label: "Home"
  }
];

// Rotas de autenticação
export const authRoutes: RouteDefinition[] = [
  {
    path: "/auth/login",
    component: Login,
    label: "Login"
  },
  {
    path: "/auth/registrar",
    component: Register,
    label: "Criar Conta"
  }
];

// Rotas para dashboard de empresa
export const companyRoutes: RouteDefinition[] = [
  {
    path: "/dashboard",
    component: CompanyDashboard,
    label: "Dashboard",
    icon: "home",
    showInMenu: true
  },
  {
    path: "/dashboard/schedule",
    component: Schedule,
    label: "Agenda",
    icon: "calendar",
    showInMenu: true
  },
  {
    path: "/dashboard/professionals",
    component: Team,
    label: "Profissionais",
    icon: "users",
    showInMenu: true
  },
  {
    path: "/dashboard/services",
    component: Services,
    label: "Serviços",
    icon: "package",
    showInMenu: true
  },
  {
    path: "/dashboard/clients",
    component: Clients,
    label: "Clientes",
    icon: "users",
    showInMenu: true
  },
  {
    path: "/dashboard/financial",
    component: Financial,
    label: "Financeiro",
    icon: "credit-card",
    showInMenu: true
  },
  {
    path: "/dashboard/reports",
    component: Reports,
    label: "Relatórios",
    icon: "bar-chart-3",
    showInMenu: true
  },
  {
    path: "/dashboard/settings",
    component: Settings,
    label: "Configurações",
    icon: "settings",
    showInMenu: true
  },
  {
    path: "/dashboard/subscription",
    component: CompanyDashboard,
    label: "Assinatura",
    icon: "clock",
    showInMenu: true
  }
];

// Rotas para admin
export const adminRoutes: RouteDefinition[] = [
  {
    path: "/admin",
    component: AdminDashboard,
    label: "Dashboard",
    icon: "home",
    showInMenu: true
  },
  {
    path: "/admin/companies",
    component: AdminDashboard,
    label: "Empresas",
    icon: "buildings",
    showInMenu: true
  },
  {
    path: "/admin/plans",
    component: AdminDashboard,
    label: "Planos",
    icon: "package",
    showInMenu: true
  },
  {
    path: "/admin/subadmins",
    component: AdminDashboard,
    label: "Subadmins",
    icon: "users",
    showInMenu: true
  },
  {
    path: "/admin/settings",
    component: AdminDashboard,
    label: "Configurações",
    icon: "settings",
    showInMenu: true
  }
];

// Redirecionamentos para compatibilidade
export const redirectRoutes: { from: string; to: string }[] = [
  { from: "/agenda", to: "/dashboard/schedule" },
  { from: "/equipe", to: "/dashboard/professionals" },
  { from: "/servicos", to: "/dashboard/services" },
  { from: "/clientes", to: "/dashboard/clients" },
  { from: "/financeiro", to: "/dashboard/financial" },
  { from: "/relatorios", to: "/dashboard/reports" },
  { from: "/configuracoes", to: "/dashboard/settings" }
];

// Rota 404
export const notFoundRoute: RouteDefinition = {
  path: "*",
  component: NotFound,
  label: "Página não encontrada"
};

// Helper para obter todas as rotas por tipo de usuário
export const getRoutesByUserType = (userType: 'admin' | 'company') => {
  if (userType === 'admin') {
    return adminRoutes;
  }
  return companyRoutes;
};
