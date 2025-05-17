
import { useState, useEffect, useCallback } from 'react';
import { SubscriptionStatus, PlanType, PlanDetails } from '@/types/subscription';
import { toast } from 'sonner';

// Placeholder for API calls - in a real app, this would call Supabase
const fetchSubscriptionStatus = (): Promise<SubscriptionStatus> => {
  return new Promise((resolve) => {
    // Mock data for demonstration
    setTimeout(() => {
      // Get the subscription status from localStorage, or default to free plan
      const storedStatus = localStorage.getItem('subscriptionStatus');
      const defaultStatus: SubscriptionStatus = {
        plan: 'Gratuito',
        usedAppointments: 3,
        maxAppointments: 5,
        percentUsed: 60,
        nextResetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        isLimitReached: false
      };

      const status = storedStatus ? JSON.parse(storedStatus) : defaultStatus;
      resolve(status);
    }, 500);
  });
};

export const PLAN_DETAILS: Record<PlanType, PlanDetails> = {
  'Gratuito': {
    name: 'Gratuito',
    maxAppointments: 5,
    maxProfessionals: 1,
    hasFinancialAccess: false,
    hasReports: false,
    price: 0
  },
  'Profissional': {
    name: 'Profissional',
    maxAppointments: 'unlimited',
    maxProfessionals: 'unlimited',
    hasFinancialAccess: true,
    hasReports: true,
    price: 49.90
  }
};

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const refreshSubscriptionStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSubscriptionStatus();
      setSubscriptionStatus(data);
      // Also store in localStorage to persist between refreshes
      localStorage.setItem('subscriptionStatus', JSON.stringify(data));
      setError(null);
    } catch (err) {
      setError('Falha ao carregar informações da assinatura');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkCanSchedule = useCallback(() => {
    if (!subscriptionStatus) return true;
    
    if (subscriptionStatus.plan === 'Profissional') return true;
    
    return subscriptionStatus.usedAppointments < 
      (typeof subscriptionStatus.maxAppointments === 'number' ? subscriptionStatus.maxAppointments : Infinity);
  }, [subscriptionStatus]);

  const incrementAppointmentCount = useCallback(async () => {
    // In a real app, this would call an API to increment the count
    if (!subscriptionStatus) return;
    
    const newCount = subscriptionStatus.usedAppointments + 1;
    const max = subscriptionStatus.maxAppointments === 'unlimited' ? Infinity : subscriptionStatus.maxAppointments;
    const newPercentage = subscriptionStatus.maxAppointments === 'unlimited' ? 0 : (newCount / max) * 100;
    
    const updatedStatus = {
      ...subscriptionStatus,
      usedAppointments: newCount,
      percentUsed: newPercentage,
      isLimitReached: newCount >= max
    };
    
    setSubscriptionStatus(updatedStatus);
    localStorage.setItem('subscriptionStatus', JSON.stringify(updatedStatus));
    
    // If we reached the limit, show a toast notification
    if (newCount >= max && subscriptionStatus.plan === 'Gratuito') {
      toast.warning('Você atingiu o limite de agendamentos do plano gratuito!');
    }
  }, [subscriptionStatus]);

  const upgradeToProfessional = useCallback(async () => {
    // In a real app, this would create a Stripe Checkout session via an edge function
    setIsProcessingPayment(true);
    
    try {
      // Mock successful payment
      toast.info('Redirecionando para a página de pagamento...');
      
      // Simulate a delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would redirect to Stripe here
      // window.location.href = stripeCheckoutUrl;
      
      // For demo purposes, we'll just simulate success directly
      const updatedStatus: SubscriptionStatus = {
        plan: 'Profissional',
        usedAppointments: subscriptionStatus?.usedAppointments || 0,
        maxAppointments: 'unlimited',
        percentUsed: 0,
        nextResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isLimitReached: false
      };
      
      setSubscriptionStatus(updatedStatus);
      localStorage.setItem('subscriptionStatus', JSON.stringify(updatedStatus));
      
      toast.success('Plano atualizado com sucesso! Você agora é um usuário profissional.');
    } catch (err) {
      console.error('Payment processing error:', err);
      toast.error('Falha no processamento do pagamento. Por favor, tente novamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  }, [subscriptionStatus]);

  const manageSubscription = useCallback(() => {
    // In a real app, this would redirect to a Stripe Customer Portal
    toast.info('Redirecionando para o portal de gerenciamento de assinatura...');
    // window.location.href = stripeCustomerPortalUrl;
    
    // For demo, we'll just show a message
    setTimeout(() => {
      toast.info('Em um ambiente de produção, você seria redirecionado para o portal de gerenciamento de assinatura do Stripe.');
    }, 1500);
  }, []);

  // Simulate subscription downgrade
  const downgradeToFree = useCallback(() => {
    if (!subscriptionStatus || subscriptionStatus.plan === 'Gratuito') return;
    
    const updatedStatus: SubscriptionStatus = {
      plan: 'Gratuito',
      usedAppointments: 0,
      maxAppointments: 5,
      percentUsed: 0,
      nextResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isLimitReached: false
    };
    
    setSubscriptionStatus(updatedStatus);
    localStorage.setItem('subscriptionStatus', JSON.stringify(updatedStatus));
    toast.success('Plano alterado para Gratuito com sucesso.');
  }, [subscriptionStatus]);

  useEffect(() => {
    refreshSubscriptionStatus();
  }, [refreshSubscriptionStatus]);

  return {
    subscriptionStatus,
    isLoading,
    error,
    isProcessingPayment,
    checkCanSchedule,
    incrementAppointmentCount,
    refreshSubscriptionStatus,
    upgradeToProfessional,
    manageSubscription,
    downgradeToFree,
    planDetails: PLAN_DETAILS
  };
};
