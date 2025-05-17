
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
  Menu,
  X,
  LogOut,
  User,
  Clock,
  FileText,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionLimits } from '@/components/subscription/SubscriptionLimits';

interface SidebarProps {
  userType: 'company' | 'professional' | 'client';
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavLink {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  requiresPro?: boolean;
}

export function Sidebar({ userType, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const location = useLocation();
  const { subscriptionStatus } = useSubscription();
  const isProfessionalPlan = subscriptionStatus?.plan === 'Profissional';

  const companyLinks: NavLink[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Agenda', href: '/dashboard/schedule', icon: Calendar },
    { name: 'Clientes', href: '/dashboard/clients', icon: Users },
    { name: 'Profissionais', href: '/dashboard/professionals', icon: User },
    { name: 'Serviços', href: '/dashboard/services', icon: Package },
    { name: 'Financeiro', href: '/dashboard/financial', icon: CreditCard, requiresPro: true },
    { name: 'Relatórios', href: '/dashboard/reports', icon: BarChart3, requiresPro: true },
    { name: 'Assinatura', href: '/dashboard/subscription', icon: Clock },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
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

  const links = userType === 'company' 
    ? companyLinks 
    : userType === 'professional' 
      ? professionalLinks 
      : clientLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 border-r bg-background/50 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and company name */}
          <div className="p-6 border-b">
            <Link to={userType === 'company' ? '/dashboard' : userType === 'professional' ? '/professional' : '/client'} className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-md">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">BeautySalon</h1>
                <p className="text-xs text-muted-foreground">
                  {userType === 'company' ? 'Painel da Empresa' : 
                   userType === 'professional' ? 'Painel do Profissional' : 
                   'Painel do Cliente'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex-1 overflow-auto py-6 px-4">
            <nav className="space-y-1">
              {links.map((link) => {
                // Skip pro features if not on professional plan
                if (link.requiresPro && !isProfessionalPlan) {
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
                    
                    {link.requiresPro && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Subscription status for company users */}
          {userType === 'company' && (
            <div className="px-4 py-3">
              <SubscriptionLimits variant="compact" />
            </div>
          )}

          {/* User profile and logout */}
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>
                  {userType === 'company' ? 'CO' : userType === 'professional' ? 'PR' : 'CL'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userType === 'company' ? 'Empresa Demo' : 
                   userType === 'professional' ? 'João Profissional' : 
                   'Maria Cliente'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userType === 'company' ? 'admin@empresa.com' : 
                   userType === 'professional' ? 'joao@email.com' : 
                   'maria@email.com'}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
