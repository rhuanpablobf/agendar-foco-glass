
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';
import { useSubscription } from '@/hooks/useSubscription';

interface UpgradeButtonProps extends ButtonProps {
  showModal?: boolean;
  label?: string;
}

export const UpgradeButton: React.FC<UpgradeButtonProps> = ({ 
  showModal = true,
  label = 'Atualizar Plano',
  className,
  ...props 
}) => {
  const { upgradeToProfessional } = useSubscription();

  const buttonComponent = (
    <Button 
      className={className} 
      onClick={showModal ? undefined : upgradeToProfessional}
      {...props}
    >
      {label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );

  if (showModal) {
    return <UpgradeModal trigger={buttonComponent} />;
  }

  return buttonComponent;
};
