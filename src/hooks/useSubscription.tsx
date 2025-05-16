
import { useState, useEffect } from 'react';
import { SubscriptionStatus, PlanType, PlanDetails } from '@/types/subscription';
import { toast } from 'sonner';

// Placeholder for API calls - in a real app, this would call Supabase
const fetchSubscriptionStatus = (): Promise<SubscriptionStatus> => {
  return new Promise((resolve) => {
    // Mock data for demonstration
    setTimeout(() => {
      resolve({
        plan: 'Gratuito',
        usedAppointments: 3,
        maxAppointments: 5,
        percentUsed: 60,
        nextResetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        isLimitReached: false
      });
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

  const refreshSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSubscriptionStatus();
      setSubscriptionStatus(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar informações da assinatura');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCanSchedule = () => {
    if (!subscriptionStatus) return true;
    
    if (subscriptionStatus.plan === 'Profissional') return true;
    
    return subscriptionStatus.usedAppointments < 
      (typeof subscriptionStatus.maxAppointments === 'number' ? subscriptionStatus.maxAppointments : Infinity);
  };

  const incrementAppointmentCount = async () => {
    // In a real app, this would call an API to increment the count
    if (!subscriptionStatus) return;
    
    const newCount = subscriptionStatus.usedAppointments + 1;
    const max = subscriptionStatus.maxAppointments === 'unlimited' ? Infinity : subscriptionStatus.maxAppointments;
    const newPercentage = subscriptionStatus.maxAppointments === 'unlimited' ? 0 : (newCount / max) * 100;
    
    setSubscriptionStatus({
      ...subscriptionStatus,
      usedAppointments: newCount,
      percentUsed: newPercentage,
      isLimitReached: newCount >= max
    });
    
    // If we reached the limit, show a toast notification
    if (newCount >= max && subscriptionStatus.plan === 'Gratuito') {
      toast.warning('Você atingiu o limite de agendamentos do plano gratuito!');
    }
  };

  const upgradeToProfessional = async () => {
    // In a real app, this would redirect to Stripe checkout
    toast.info('Redirecionando para a página de pagamento...');
    // Placeholder for payment processing
    // window.location.href = '/pagamento';
  };

  useEffect(() => {
    refreshSubscriptionStatus();
  }, []);

  return {
    subscriptionStatus,
    isLoading,
    error,
    checkCanSchedule,
    incrementAppointmentCount,
    refreshSubscriptionStatus,
    upgradeToProfessional,
    planDetails: PLAN_DETAILS
  };
};
