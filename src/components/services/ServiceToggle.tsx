
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';

interface ServiceToggleProps {
  serviceId: string;
  isActive: boolean;
  onToggle: (serviceId: string, isActive: boolean) => Promise<void>;
}

export const ServiceToggle: React.FC<ServiceToggleProps> = ({ serviceId, isActive, onToggle }) => {
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus?.plan === 'Profissional';
  
  const handleToggle = async () => {
    try {
      // Se estiver tentando ativar e não for PRO, não permitir mais de 5 serviços ativos
      if (!isActive && !isPro) {
        toast.error('Limite de serviços atingido no plano gratuito. Faça upgrade para o plano Profissional.');
        return;
      }
      
      await onToggle(serviceId, !isActive);
      toast.success(isActive ? 'Serviço desativado' : 'Serviço ativado');
    } catch (error) {
      toast.error('Erro ao alterar status do serviço');
      console.error(error);
    }
  };

  return (
    <Switch 
      checked={isActive} 
      onCheckedChange={handleToggle}
      aria-label={isActive ? "Desativar serviço" : "Ativar serviço"}
    />
  );
};
