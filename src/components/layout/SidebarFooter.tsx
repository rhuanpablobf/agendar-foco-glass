
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarFooterProps {
  userType: 'company' | 'professional' | 'client' | 'admin';
}

export const SidebarFooter = ({ userType }: SidebarFooterProps) => {
  const getUserInfo = () => {
    switch(userType) {
      case 'company':
        return {
          name: 'Empresa Demo',
          email: 'admin@empresa.com',
          avatar: 'CO'
        };
      case 'professional':
        return {
          name: 'João Profissional',
          email: 'joao@email.com',
          avatar: 'PR'
        };
      case 'admin':
        return {
          name: 'Admin Principal',
          email: 'admin@beautysalon.com',
          avatar: 'AD'
        };
      case 'client':
      default:
        return {
          name: 'Maria Cliente',
          email: 'maria@email.com',
          avatar: 'CL'
        };
    }
  };

  const userInfo = getUserInfo();

  return (
    <div className="p-4 border-t mt-auto">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>{userInfo.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{userInfo.name}</p>
          <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
        </div>
        <Button variant="ghost" size="icon">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
