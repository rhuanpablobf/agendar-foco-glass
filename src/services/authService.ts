
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/hooks/useAuthStatus';

type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  password: string;
};

export const registerUser = async (data: RegistrationData) => {
  // Limpar estado de autenticação para evitar problemas
  console.log('Limpando estado de autenticação existente');
  cleanupAuthState();
  
  // Tentar logout global primeiro para garantir um estado limpo
  try {
    await supabase.auth.signOut({ scope: 'global' });
    console.log('Logout global realizado com sucesso');
  } catch (err) {
    // Continuar mesmo se falhar
    console.log('Erro ao fazer logout antes do registro, continuando mesmo assim:', err);
  }
  
  console.log('Registrando novo usuário:', data.email);
  
  // 1. Registrar o usuário com o Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        role: 'company_admin', // Definir função para novos registros
      }
    }
  });

  if (authError) {
    console.error('Erro de autenticação:', authError);
    throw new Error(`Erro de autenticação: ${authError.message}`);
  }
  
  if (!authData.user) {
    console.error('Nenhum usuário retornado do signUp');
    throw new Error('Falha ao criar usuário');
  }

  console.log('Usuário criado com ID:', authData.user.id);
  
  // Pequeno atraso para garantir que o trigger handle_new_user() tenha tempo de executar
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 2. Criar uma empresa para o usuário
  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .insert([{ name: data.companyName }])
    .select('id')
    .single();

  if (companyError) {
    console.error('Erro na criação da empresa:', companyError);
    throw new Error(`Erro na criação da empresa: ${companyError.message}`);
  }
  
  console.log('Empresa criada com ID:', companyData.id);
  
  // 3. Atualizar o perfil do usuário com o company_id
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ company_id: companyData.id })
    .eq('id', authData.user.id);

  if (profileError) {
    console.error('Erro na atualização do perfil:', profileError);
    throw new Error(`Erro na atualização do perfil: ${profileError.message}`);
  }
  
  console.log('Perfil atualizado com company_id:', companyData.id);
  
  // 4. Buscar o plano gratuito e criar uma assinatura
  const { data: freePlan, error: planError } = await supabase
    .from('plans')
    .select('id')
    .eq('name', 'Gratuito')
    .single();
    
  if (planError) {
    console.error('Erro ao buscar plano gratuito:', planError);
    throw new Error(`Erro ao buscar plano gratuito: ${planError.message}`);
  }
  
  if (freePlan) {
    console.log('Plano gratuito encontrado com ID:', freePlan.id);
    
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert([{ 
        company_id: companyData.id,
        plan_id: freePlan.id,
        is_active: true,
        next_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }]);
      
    if (subscriptionError) {
      console.error('Erro na criação da assinatura:', subscriptionError);
      throw new Error(`Erro na criação da assinatura: ${subscriptionError.message}`);
    }
    
    console.log('Assinatura criada com sucesso');
  }
  
  return authData.user;
};
