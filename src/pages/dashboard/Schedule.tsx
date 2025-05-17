
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isSameDay } from 'date-fns';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

// Import types
import { AppointmentFormValues, NewClientFormValues } from './types/schedule';

// Import mock data
import { mockAppointments } from './data/mockData';

// Import components
import { AppointmentForm } from './components/AppointmentForm';
import { NewClientForm } from './components/NewClientForm';
import { PlanLimitAlert } from './components/PlanLimitAlert';
import { ScheduleCalendarView } from './components/ScheduleCalendarView';
import { ScheduleListView } from './components/ScheduleListView';
import { ScheduleFilters } from './components/ScheduleFilters';

// Import CSS for schedule grid
import './schedule.css';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [planLimitReached, setPlanLimitReached] = useState(false); // Mock: controle de limite do plano
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  // Filtrar agendamentos com base nos filtros selecionados
  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchDate = isSameDay(appointment.date, selectedDate);
    const matchProfessional = selectedProfessional ? Number(selectedProfessional) === appointment.professionalId : true;
    const matchStatus = selectedStatus ? selectedStatus === appointment.status : true;

    return matchDate && matchProfessional && matchStatus;
  });

  const handleCreateAppointment = (data: AppointmentFormValues) => {
    if (planLimitReached) {
      toast.error("Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar.");
      return;
    }

    // Aqui iria a lógica para criar um novo agendamento
    console.log("Criando novo agendamento:", data);
    
    toast.success("Agendamento criado com sucesso!");
  };

  const handleCreateClient = (data: NewClientFormValues) => {
    // Aqui iria a lógica para criar um novo cliente
    console.log("Criando novo cliente:", data);
    
    toast.success("Cliente cadastrado com sucesso!");
    setShowNewClientModal(false);
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={planLimitReached}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo agendamento
                  </DialogDescription>
                </DialogHeader>

                <AppointmentForm 
                  onCreateAppointment={handleCreateAppointment} 
                  onAddNewClient={() => setShowNewClientModal(true)}
                  planLimitReached={planLimitReached}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showNewClientModal} onOpenChange={setShowNewClientModal}>
              <DialogContent className="sm:max-w-[500px] border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo cliente para agendar serviços
                  </DialogDescription>
                </DialogHeader>

                <NewClientForm 
                  onCreateClient={handleCreateClient}
                  onCancel={() => setShowNewClientModal(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {planLimitReached && <PlanLimitAlert />}

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <ScheduleFilters 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedProfessional={selectedProfessional}
              setSelectedProfessional={setSelectedProfessional}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              searchQuery={clientSearchQuery}
              setSearchQuery={setClientSearchQuery}
            />
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
                    filteredAppointments={filteredAppointments}
                    selectedProfessional={selectedProfessional}
                  />
                </TabsContent>
                
                <TabsContent value="list">
                  <ScheduleListView filteredAppointments={filteredAppointments} />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Schedule;
