
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'Nome deve ter pelo menos 2 caracteres',
  }),
  lastName: z.string().min(2, {
    message: 'Sobrenome deve ter pelo menos 2 caracteres',
  }),
  email: z.string().email({
    message: 'Digite um email válido',
  }),
  phone: z.string().min(10, {
    message: 'Telefone deve ter pelo menos 10 dígitos',
  }),
  companyName: z.string().min(2, {
    message: 'Nome da empresa deve ter pelo menos 2 caracteres',
  }),
  password: z.string().min(6, {
    message: 'Senha deve ter pelo menos 6 caracteres',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      // Cleanup auth state to prevent issues
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Try global sign out first to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Sign out before registration failed, continuing anyway');
      }
      
      // 1. Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            role: 'company_admin', // Set role for new registrations
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error('No user returned from signUp');
        throw new Error('Falha ao criar usuário');
      }

      console.log('User created:', authData.user.id);
      
      // 2. Create a company for the user
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: data.companyName }])
        .select('id')
        .single();

      if (companyError) {
        console.error('Company creation error:', companyError);
        throw companyError;
      }
      
      console.log('Company created:', companyData.id);
      
      // 3. Update user's profile with company_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: companyData.id })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }
      
      // 4. Create a free subscription for the company
      const { data: freePlan } = await supabase
        .from('plans')
        .select('id')
        .eq('name', 'Gratuito')
        .single();
        
      if (freePlan) {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert([{ 
            company_id: companyData.id,
            plan_id: freePlan.id,
            is_active: true
          }]);
          
        if (subscriptionError) {
          console.error('Subscription creation error:', subscriptionError);
          throw subscriptionError;
        }
      }

      toast.success('Conta criada com sucesso!');
      
      // Navigate to login page to complete the sign in process
      navigate('/auth/login');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.message && error.message.includes('User already registered')) {
        toast.error('Email já registrado. Tente fazer login.');
      } else {
        toast.error(`Erro ao criar conta: ${error.message || 'Tente novamente.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 py-10">
      <div className="w-full max-w-lg p-4">
        <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-glass">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Preencha seus dados para criar uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu nome" 
                            {...field} 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu sobrenome" 
                            {...field} 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu@email.com" 
                          {...field} 
                          type="email" 
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 98765-4321" 
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome da sua empresa" 
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="******" 
                          type="password" 
                          {...field} 
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="******" 
                          type="password" 
                          {...field} 
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar conta'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              <span>Já possui uma conta? </span>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate('/auth/login')}
              >
                Fazer login
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
