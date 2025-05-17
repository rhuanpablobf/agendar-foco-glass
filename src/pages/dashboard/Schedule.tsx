import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Filter, Plus, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { SubscriptionLimits } from '@/components/subscription/SubscriptionLimits';

// Import components
import { AppointmentForm } from '@/components/schedule/AppointmentForm';
import { ScheduleFilters } from '@/components/schedule/ScheduleFilters';
import { ScheduleCalendarView } from '@/components/schedule/ScheduleCalendarView';
import { ScheduleListView } from '@/components/schedule/ScheduleListView';
import { PlanLimitAlert } from '@/components/schedule/PlanLimitAlert';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { ClientFormData } from '@/types/client';

// Import mock data
import { mockAppointments, mockProfessionals, mockClients, mockServices } from '@/components/schedule/mockData';

// CSS import
import './schedule.css';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  
  // Get subscription status to check limits
  const { subscriptionStatus, checkCanSchedule, incrementAppointmentCount } = useSubscription();
  
  const planLimitReached = !checkCanSchedule();

  // Filtered appointments based on filters
  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchDate = isSameDay(appointment.date, selectedDate);
    const matchProfessional = !selectedProfessional || selectedProfessional === "all" 
      ? true 
      : Number(selectedProfessional) === appointment.professionalId;
    const matchStatus = !selectedStatus || selectedStatus === "all" 
      ? true 
      : selectedStatus === appointment.status;

    return matchDate && matchProfessional && matchStatus;
  });

  // Handle creating a new appointment - check subscription limits first
  const handleCreateAppointment = (data: any) => {
    if (planLimitReached) {
      // Don't allow new appointments if limit is reached
      setShowNewAppointmentDialog(false);
      return;
    }
    
    console.log("Criando novo agendamento:", data);
    // Here you would create the appointment in the database
    
    // Increment the appointment count for subscription tracking
    incrementAppointmentCount();
    
    // Close the dialog
    setShowNewAppointmentDialog(false);
  };

  // Handle client creation
  const handleCreateClient = (clientData: ClientFormData) => {
    console.log("Novo cliente criado:", clientData);
    // Aqui você adicionaria o cliente ao banco de dados/estado
    
    // Fechar o modal de cliente
    setShowNewClientModal(false);
  };

  // Effect to check subscription status on mount
  useEffect(() => {
    // Any initialization related to subscription status could go here
  }, []);

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
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
                  clients={mockClients}
                  professionals={mockProfessionals}
                  services={mockServices}
                  onSubmit={handleCreateAppointment}
                  onNewClient={() => setShowNewClientModal(true)}
                  showNewClientModal={showNewClientModal}
                  setShowNewClientModal={setShowNewClientModal}
                />
              </Dialog>
            )}
          </div>
        </div>

        {planLimitReached && subscriptionStatus?.plan === 'Gratuito' && (
          <SubscriptionLimits variant="full" showUpgradeButton={true} />
        )}

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2 items-center w-[240px]">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(selectedDate, "PPP", { locale: ptBR })}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background/90 backdrop-blur-sm border border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <ScheduleFilters
                  selectedProfessional={selectedProfessional}
                  setSelectedProfessional={setSelectedProfessional}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  professionals={mockProfessionals}
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar agendamentos..."
                  className="pl-10 w-full sm:w-[240px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto pb-6">
            <div className="space-y-6">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="calendar">Calendário</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar" className="space-y-6">
                  <ScheduleCalendarView 
                    professionals={mockProfessionals}
                    filteredAppointments={filteredAppointments}
                    selectedProfessional={selectedProfessional}
                  />
                </TabsContent>
                
                <TabsContent value="list">
                  <ScheduleListView 
                    filteredAppointments={filteredAppointments}
                    professionals={mockProfessionals}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Modal para criação de novo cliente */}
      <ClientFormModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onSubmit={handleCreateClient}
      />
    </MainLayout>
  );
};

export default Schedule;
