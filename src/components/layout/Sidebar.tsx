
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Scissors, 
  UserCircle, 
  DollarSign, 
  BarChartBig, 
  Settings, 
  Menu, 
  X, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, to, active, collapsed, onClick }: NavItemProps) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={cn(
      'flex items-center px-3 py-3 mb-1 rounded-md text-sidebar-foreground transition-all duration-200',
      active 
        ? 'bg-primary text-primary-foreground' 
        : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    )}
  >
    <Icon className="h-5 w-5 shrink-0" />
    {!collapsed && <span className="ml-3 text-sm font-medium">{label}</span>}
  </Link>
);

interface SidebarProps {
  userType?: 'company' | 'admin';
}

export const Sidebar = ({ userType = 'company' }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  
  const handleLogout = () => {
    // Futura lógica de logout aqui
    toast.success("Logout realizado com sucesso");
    // Redirecionar para página de login após implementação de autenticação
  };

  const companyMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: CalendarDays, label: 'Agenda', to: '/agenda' },
    { icon: Users, label: 'Equipe', to: '/equipe' },
    { icon: Scissors, label: 'Serviços', to: '/servicos' },
    { icon: UserCircle, label: 'Clientes', to: '/clientes' },
    { icon: DollarSign, label: 'Financeiro', to: '/financeiro' },
    { icon: BarChartBig, label: 'Relatórios', to: '/relatorios' },
    { icon: Settings, label: 'Configurações', to: '/configuracoes' },
  ];

  const adminMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: Users, label: 'Empresas', to: '/admin/empresas' },
    { icon: DollarSign, label: 'Planos', to: '/admin/planos' },
    { icon: Settings, label: 'Configurações', to: '/admin/configuracoes' },
  ];

  const menuItems = userType === 'company' ? companyMenu : adminMenu;

  return (
    <div 
      className={cn(
        'h-screen fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 bg-sidebar flex flex-col',
        collapsed ? 'w-16' : 'w-64',
        'glass-card rounded-r-lg border-r border-r-white/20'
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 bg-accent rounded-md flex items-center justify-center">
              <span className="text-white font-bold">BS</span>
            </div>
            <h1 className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-accent-gradient">
              BeautySalon
            </h1>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapsed} 
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      <div className="p-3">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full flex items-center justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-3"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Sair</span>}
        </Button>
      </div>
    </div>
  );
};
