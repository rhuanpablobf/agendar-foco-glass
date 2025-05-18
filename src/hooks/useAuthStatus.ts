
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Função de limpeza do estado de autenticação
export const cleanupAuthState = () => {
  // Remover tokens de autenticação padrão
  localStorage.removeItem('supabase.auth.token');
  
  // Remover todas as chaves de autenticação do Supabase do localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remover do sessionStorage, se em uso
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar o listener de estado de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Apenas atualizações de estado síncronas aqui
        setIsAuthenticated(!!session?.user);
        setUser(session?.user || null);
        setLoading(false);
        
        // Adiar chamadas do Supabase com setTimeout
        if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            navigate('/auth/login');
          }, 0);
        }
      }
    );

    // DEPOIS verificar sessão existente
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setUser(user);
      setLoading(false);
    };

    checkAuth();

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

  const logout = async () => {
    try {
      // Limpar estado de autenticação
      cleanupAuthState();
      
      // Tentar logout global (fallback se falhar)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignorar erros
        console.log('Erro ao fazer logout global:', err);
      }
      
      // Forçar recarga da página para um estado limpo
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return { isAuthenticated, user, loading, checkAuth, logout };
}
