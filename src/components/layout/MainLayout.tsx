
import React from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
  userType?: 'company' | 'admin';
}

export const MainLayout = ({ children, userType = 'company' }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      {!isMobile && <Sidebar userType={userType} />}
      <div 
        className={cn(
          "flex-1 transition-all duration-300 p-5",
          !isMobile && "ml-64",
          "bg-background"
        )}
      >
        <main className="container mx-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};
