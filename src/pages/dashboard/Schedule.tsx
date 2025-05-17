
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { isSameDay } from 'date-fns';
import { useSubscription } from '@/hooks/useSubscription';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { ClientFormData } from '@/types/client';
import { ScheduleHeader } from '@/components/schedule/ScheduleHeader';
import { ScheduleContent } from '@/components/schedule/ScheduleContent';

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

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <ScheduleHeader
          planLimitReached={planLimitReached}
          subscriptionPlan={subscriptionStatus?.plan}
          showNewAppointmentDialog={showNewAppointmentDialog}
          setShowNewAppointmentDialog={setShowNewAppointmentDialog}
          handleCreateAppointment={handleCreateAppointment}
          setShowNewClientModal={setShowNewClientModal}
          showNewClientModal={showNewClientModal}
          clients={mockClients}
          professionals={mockProfessionals}
          services={mockServices}
        />

        <ScheduleContent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedProfessional={selectedProfessional}
          setSelectedProfessional={setSelectedProfessional}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          filteredAppointments={filteredAppointments}
          professionals={mockProfessionals}
        />
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
