
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

interface SidebarHeaderProps {
  userType: 'company' | 'professional' | 'client' | 'admin';
}

export const SidebarHeader = ({ userType }: SidebarHeaderProps) => {
  const dashboardBasePath = 
    userType === 'company' ? '/dashboard' : 
    userType === 'professional' ? '/professional' : 
    userType === 'admin' ? '/admin' : '/client';
    
  const displayName = 
    userType === 'company' ? 'Painel da Empresa' : 
    userType === 'professional' ? 'Painel do Profissional' : 
    userType === 'admin' ? 'Painel do Admin' : 'Painel do Cliente';

  return (
    <div className="p-6 border-b">
      <Link to={dashboardBasePath} className="flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-md">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">BeautySalon</h1>
          <p className="text-xs text-muted-foreground">{displayName}</p>
        </div>
      </Link>
    </div>
  );
};
