
import React from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarLinks } from './SidebarLinks';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { SubscriptionLimits } from '@/components/subscription/SubscriptionLimits';

interface SidebarProps {
  userType: 'company' | 'professional' | 'client' | 'admin';
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ userType, isMobileOpen, setIsMobileOpen }: SidebarProps) {
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
          <SidebarHeader userType={userType} />

          {/* Navigation links */}
          <SidebarLinks userType={userType} />

          {/* Subscription status for company users */}
          {userType === 'company' && (
            <div className="px-4 py-3">
              <SubscriptionLimits variant="compact" />
            </div>
          )}

          {/* User profile and logout */}
          <SidebarFooter userType={userType} />
        </div>
      </div>
    </>
  );
}
