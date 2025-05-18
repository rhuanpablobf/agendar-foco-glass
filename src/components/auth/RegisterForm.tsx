
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RegisterFormSchema } from './RegisterFormSchema';
import { RegisterFormFields } from './RegisterFormFields';
import { registerUser } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

type FormData = z.infer<typeof RegisterFormSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const RegisterForm = ({ onSuccess, redirectTo = '/auth/login' }: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
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
      
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        password: data.password,
      });
      
      toast.success('Conta criada com sucesso!');
      
      // Fazer logout para garantir um processo de login limpo
      await supabase.auth.signOut();
      
      // Navegar para a página de login para completar o processo de login
      if (redirectTo) navigate(redirectTo);
      
      // Chamar callback de sucesso, se fornecido
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      // Tratar casos de erro específicos
      if (error.message && error.message.includes('User already registered')) {
        toast.error('Email já registrado. Tente fazer login.');
      } else {
        toast.error(`Erro ao criar conta: ${error.message || 'Tente novamente.'}`);
      }
      
      // Tentar limpar usuário parcialmente criado em caso de erro
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Erro ao fazer logout após falha no registro:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RegisterFormFields loading={loading} />
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
    </FormProvider>
  );
};
