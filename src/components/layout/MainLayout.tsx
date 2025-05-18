
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  userType: 'admin' | 'company';
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile information
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setUserName(`${profile.first_name} ${profile.last_name}`);
        }
      }
    };
    
    getUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
        userName={userName || 'Usuário'}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} userType={userType} />
        <main className={`flex-1 p-6 transition-all duration-300 overflow-auto ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
