
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from '@/components/auth/AuthCard';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'company' | 'admin'>('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Todos os campos devem ser preenchidos");
      return;
    }

    setLoading(true);

    // Simulação de login para demonstração
    setTimeout(() => {
      setLoading(false);
      toast.success("Login realizado com sucesso!");
      
      // Armazenar tipo de usuário para redirecionamento baseado em perfil
      localStorage.setItem('lastPath', userType === 'company' ? '/dashboard' : '/admin');
      
      if (userType === 'company') {
        navigate('/dashboard');
      } else {
        navigate('/admin');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 animate-slideUp">
        <AuthCard 
          title="Bem-vindo ao BeautySalon"
          description="Faça login para acessar sua conta"
        >
          <Tabs defaultValue="company" className="w-full" onValueChange={(value) => setUserType(value as 'company' | 'admin')}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="company">Empresa</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="glass-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link to="/auth/recuperar-senha" className="text-xs text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="glass-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aguarde...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </div>
            </form>
          </Tabs>

          {userType === 'company' && (
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link to="/auth/registrar" className="text-primary hover:underline">
                Registre-se
              </Link>
            </div>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
