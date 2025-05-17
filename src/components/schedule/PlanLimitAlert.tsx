
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';

interface PlanLimitAlertProps {
  onUpgradeClick: () => void;
}

export const PlanLimitAlert: React.FC<PlanLimitAlertProps> = ({ onUpgradeClick }) => {
  const { subscriptionStatus } = useSubscription();
  
  if (!subscriptionStatus) return null;
  
  const { plan, usedAppointments, maxAppointments } = subscriptionStatus;
  
  if (plan !== 'Gratuito' || usedAppointments < (maxAppointments === 'unlimited' ? Infinity : maxAppointments)) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Limite de agendamentos atingido</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          Você atingiu o limite de {typeof maxAppointments === 'number' ? maxAppointments : 'ilimitado'} agendamentos do plano gratuito.
          Faça upgrade para continuar agendando.
        </div>
        <Button onClick={onUpgradeClick} className="sm:w-auto w-full">
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  );
};
