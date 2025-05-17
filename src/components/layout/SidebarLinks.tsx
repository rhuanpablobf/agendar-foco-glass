
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  Settings,
  Users,
  User,
  Package,
  FileText
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { usePermission } from '@/hooks/usePermission';

interface NavLink {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  requiresPro?: boolean;
  permission?: 'agenda' | 'clients' | 'professionals' | 'services' | 'financial' | 'reports' | 'settings';
}

interface SidebarLinksProps {
  userType: 'company' | 'professional' | 'client' | 'admin';
}

export const SidebarLinks = ({ userType }: SidebarLinksProps) => {
  const location = useLocation();
  const { subscriptionStatus } = useSubscription();
  const { hasPermission } = usePermission();
  const isProfessionalPlan = subscriptionStatus?.plan === 'Profissional';

  const companyLinks: NavLink[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home 
    },
    { 
      name: 'Agenda', 
      href: '/dashboard/schedule', 
      icon: Calendar, 
      permission: 'agenda'
    },
    { 
      name: 'Clientes', 
      href: '/dashboard/clients', 
      icon: Users,
      permission: 'clients'
    },
    { 
      name: 'Profissionais', 
      href: '/dashboard/professionals', 
      icon: User,
      permission: 'professionals'
    },
    { 
      name: 'Serviços', 
      href: '/dashboard/services', 
      icon: Package,
      permission: 'services'
    },
    { 
      name: 'Financeiro', 
      href: '/dashboard/financial', 
      icon: CreditCard, 
      requiresPro: true,
      permission: 'financial'
    },
    { 
      name: 'Relatórios', 
      href: '/dashboard/reports', 
      icon: BarChart3, 
      requiresPro: true,
      permission: 'reports'
    },
    { 
      name: 'Configurações', 
      href: '/dashboard/settings', 
      icon: Settings,
      permission: 'settings'
    },
  ];

  const professionalLinks: NavLink[] = [
    { name: 'Dashboard', href: '/professional', icon: Home },
    { name: 'Minha Agenda', href: '/professional/schedule', icon: Calendar },
    { name: 'Meus Clientes', href: '/professional/clients', icon: Users },
    { name: 'Configurações', href: '/professional/settings', icon: Settings },
  ];

  const clientLinks: NavLink[] = [
    { name: 'Dashboard', href: '/client', icon: Home },
    { name: 'Meus Agendamentos', href: '/client/appointments', icon: Calendar },
    { name: 'Histórico', href: '/client/history', icon: FileText },
    { name: 'Configurações', href: '/client/settings', icon: Settings },
  ];
  
  const adminLinks: NavLink[] = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Empresas', href: '/admin/companies', icon: Users },
    { name: 'Planos', href: '/admin/plans', icon: Package },
    { name: 'Subadmins', href: '/admin/subadmins', icon: User },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  const links = userType === 'company' 
    ? companyLinks 
    : userType === 'professional' 
      ? professionalLinks 
      : userType === 'admin'
        ? adminLinks
        : clientLinks;

  return (
    <div className="flex-1 overflow-auto py-6 px-4">
      <nav className="space-y-1">
        {links.map((link) => {
          // Skip pro features if not on professional plan and not admin
          if (link.requiresPro && userType === 'company' && !isProfessionalPlan) {
            return null;
          }
          
          // Skip menu items that the user doesn't have permission for
          if (link.permission && userType === 'company' && !hasPermission(link.permission)) {
            return null;
          }
          
          const isActive = location.pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.name}</span>
              
              {link.requiresPro && userType === 'company' && (
                <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
