
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Users, PieChart, DollarSign } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface UpgradeModalProps {
  trigger: React.ReactNode;
  onUpgrade?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  trigger,
  onUpgrade
}) => {
  const { upgradeToProfessional, planDetails } = useSubscription();

  const handleUpgrade = () => {
    upgradeToProfessional();
    if (onUpgrade) {
      onUpgrade();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
        <DialogHeader>
          <DialogTitle>Atualize para o Plano Profissional</DialogTitle>
          <DialogDescription>
            Desbloqueie recursos ilimitados e aproveite ao máximo o sistema
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/5 border border-white/10 p-4">
              <DialogTitle className="text-lg mb-2">Plano Gratuito</DialogTitle>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 bg-white/20 rounded-full p-0.5">
                    <Clock className="h-3 w-3" />
                  </span>
                  {planDetails.Gratuito.maxAppointments} agendamentos/mês
                </li>
                <li className="flex items-center">
                  <span className="mr-2 bg-white/20 rounded-full p-0.5">
                    <Users className="h-3 w-3" />
                  </span>
                  {planDetails.Gratuito.maxProfessionals} profissional
                </li>
              </ul>
              <div className="mt-4 text-lg font-bold">Grátis</div>
              <div className="text-xs text-muted-foreground">Seu plano atual</div>
            </Card>
            
            <Card className="bg-primary/10 border border-primary/30 p-4">
              <DialogTitle className="text-lg mb-2">Plano Profissional</DialogTitle>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                    <Clock className="h-3 w-3" />
                  </span>
                  Agendamentos ilimitados
                </li>
                <li className="flex items-center">
                  <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                    <Users className="h-3 w-3" />
                  </span>
                  Múltiplos profissionais
                </li>
                <li className="flex items-center">
                  <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                    <PieChart className="h-3 w-3" />
                  </span>
                  Relatórios avançados
                </li>
                <li className="flex items-center">
                  <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  Gestão financeira
                </li>
              </ul>
              <div className="mt-4 text-lg font-bold">R${planDetails.Profissional.price.toFixed(2)}<span className="text-xs font-normal">/mês</span></div>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="w-auto">
            Ver detalhes
          </Button>
          <Button className="w-auto" onClick={handleUpgrade}>
            Assinar plano profissional
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
