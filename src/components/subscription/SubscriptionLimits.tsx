
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionLimitsProps {
  variant?: 'full' | 'compact';
  showUpgradeButton?: boolean;
}

export const SubscriptionLimits: React.FC<SubscriptionLimitsProps> = ({ 
  variant = 'full',
  showUpgradeButton = true
}) => {
  const { subscriptionStatus, isLoading, upgradeToProfessional } = useSubscription();

  if (isLoading) {
    return (
      <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Carregando plano...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionStatus) {
    return null;
  }

  const { plan, usedAppointments, maxAppointments, percentUsed, nextResetDate, isLimitReached } = subscriptionStatus;

  const formattedNextReset = nextResetDate ? 
    format(new Date(nextResetDate), "'dia' dd 'de' MMMM", { locale: ptBR }) : '';

  const limitReached = isLimitReached && plan === 'Gratuito';

  return (
    <Card className={`border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass ${limitReached ? 'border-amber-300/30' : ''}`}>
      <CardHeader className={variant === 'compact' ? 'pb-2' : ''}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plano {plan}</CardTitle>
            {variant === 'full' && (
              <CardDescription>
                {plan === 'Gratuito' ? 
                  `Você utilizou ${usedAppointments} de ${maxAppointments} agendamentos neste mês` : 
                  'Agendamentos ilimitados'}
              </CardDescription>
            )}
          </div>
          {limitReached && (
            <div className="bg-amber-500/20 text-amber-200 text-xs px-2 py-1 rounded-full border border-amber-300/30">
              Limite atingido
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan === 'Gratuito' && (
          <>
            <Progress value={percentUsed} className={`h-2 ${limitReached ? 'bg-amber-500/20' : ''}`} />
            <div className="flex justify-between">
              <p className="text-sm">{usedAppointments}/{maxAppointments} agendamentos</p>
              <p className="text-sm text-primary font-medium">{percentUsed}% usado</p>
            </div>
            {variant === 'full' && (
              <p className="text-xs text-muted-foreground">
                Seu plano será renovado {formattedNextReset}
              </p>
            )}
          </>
        )}

        {limitReached && variant === 'full' && (
          <div className="mt-2 text-sm bg-amber-500/20 border border-amber-300/20 rounded-md p-3 text-amber-200">
            <p>Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar usando o sistema.</p>
          </div>
        )}

        {showUpgradeButton && plan === 'Gratuito' && (
          <Button 
            className="w-full" 
            onClick={upgradeToProfessional}
          >
            {variant === 'compact' ? 'Atualizar Plano' : 'Atualizar para o Plano Profissional'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
