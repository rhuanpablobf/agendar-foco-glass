
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { SubscriptionLimits } from '@/components/subscription/SubscriptionLimits';
import { AppointmentForm } from '@/components/schedule/AppointmentForm';

interface ScheduleHeaderProps {
  planLimitReached: boolean;
  subscriptionPlan?: string;
  showNewAppointmentDialog: boolean;
  setShowNewAppointmentDialog: (show: boolean) => void;
  handleCreateAppointment: (data: any) => void;
  setShowNewClientModal: (show: boolean) => void;
  showNewClientModal: boolean;
  clients: any[];
  professionals: any[];
  services: any[];
}

export const ScheduleHeader = ({
  planLimitReached,
  subscriptionPlan,
  showNewAppointmentDialog,
  setShowNewAppointmentDialog,
  handleCreateAppointment,
  setShowNewClientModal,
  showNewClientModal,
  clients,
  professionals,
  services
}: ScheduleHeaderProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos da sua empresa
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {planLimitReached ? (
            <UpgradeModal
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
                </Button>
              }
              onClose={() => {
                // Refresh the UI after modal is closed in case plan was upgraded
              }}
            />
          ) : (
            <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
                </Button>
              </DialogTrigger>
              <AppointmentForm
                clients={clients}
                professionals={professionals}
                services={services}
                onSubmit={handleCreateAppointment}
                onNewClient={() => setShowNewClientModal(true)}
                showNewClientModal={showNewClientModal}
                setShowNewClientModal={setShowNewClientModal}
              />
            </Dialog>
          )}
        </div>
      </div>

      {planLimitReached && subscriptionPlan === 'Gratuito' && (
        <SubscriptionLimits variant="full" showUpgradeButton={true} />
      )}
    </>
  );
};
