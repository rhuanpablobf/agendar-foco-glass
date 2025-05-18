
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setUser(user);
      setLoading(false);
    };

    checkAuth();

    // Set up an auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session?.user);
        setUser(session?.user || null);
        setLoading(false);
        
        // Redirect to login if not authenticated
        if (event === 'SIGNED_OUT') {
          navigate('/auth/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkAuth = async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    const isAuth = !!user;
    setIsAuthenticated(isAuth);
    
    if (!isAuth) {
      navigate('/auth/login');
    }
    
    return isAuth;
  };

  return { isAuthenticated, user, loading, checkAuth };
}
