
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalList } from '@/components/team/ProfessionalList';
import { ProfessionalForm } from '@/components/team/ProfessionalForm';
import { WeeklySchedule } from '@/components/team/WeeklySchedule';
import { ProfessionalServices } from '@/components/team/ProfessionalServices';
import { CommissionConfig } from '@/components/team/CommissionConfig';
import { useSubscription } from '@/hooks/useSubscription';
import { Service } from '@/types/service';
import { Professional, Schedule } from '@/types/professional';
import { toast } from 'sonner';

// Default schedule
const DEFAULT_SCHEDULE_DAY = {
  active: true,
  start: '09:00',
  end: '18:00',
  breakStart: '12:00',
  breakEnd: '13:00',
  breakEnabled: true
};

const DEFAULT_SCHEDULE: Schedule = {
  monday: { ...DEFAULT_SCHEDULE_DAY },
  tuesday: { ...DEFAULT_SCHEDULE_DAY },
  wednesday: { ...DEFAULT_SCHEDULE_DAY },
  thursday: { ...DEFAULT_SCHEDULE_DAY },
  friday: { ...DEFAULT_SCHEDULE_DAY },
  saturday: { ...DEFAULT_SCHEDULE_DAY, end: '16:00' },
  sunday: { ...DEFAULT_SCHEDULE_DAY, active: false }
};

// Mock data para serviços
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabelo Feminino',
    description: 'Corte, lavagem e finalização',
    duration: 60,
    price: 80,
    category: 'hair',
    isActive: true,
    isCombo: false
  },
  {
    id: '2',
    name: 'Manicure',
    description: 'Cutilagem e esmaltação',
    duration: 45,
    price: 35,
    category: 'nails',
    isActive: true,
    isCombo: false
  },
  {
    id: '3',
    name: 'Pedicure',
    description: 'Cutilagem e esmaltação',
    duration: 60,
    price: 45,
    category: 'nails',
    isActive: true,
    isCombo: false
  },
  {
    id: '4',
    name: 'Escova',
    description: 'Lavagem e escova',
    duration: 45,
    price: 60,
    category: 'hair',
    isActive: true,
    isCombo: false
  },
  {
    id: '6',
    name: 'Maquiagem',
    description: 'Maquiagem profissional',
    duration: 60,
    price: 120,
    category: 'makeup',
    isActive: true,
    isCombo: false
  }
];

const Team = () => {
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus?.plan === 'Profissional';
  
  const [selectedTab, setSelectedTab] = useState<'list' | 'create' | 'schedule' | 'services'>('list');
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'Ana Silva',
      photo: 'https://i.pravatar.cc/150?img=5',
      specialty: 'Cabeleireira',
      bio: 'Cabeleireira profissional com mais de 5 anos de experiência',
      services: ['1', '4'],
      commissions: {
        '1': 30,
        '4': 25
      },
      defaultCommission: 30,
      schedule: DEFAULT_SCHEDULE
    },
    {
      id: '2',
      name: 'Carlos Oliveira',
      photo: 'https://i.pravatar.cc/150?img=12',
      specialty: 'Barbeiro',
      bio: 'Barbeiro especializado em cortes masculinos modernos',
      services: [],
      commissions: {},
      defaultCommission: 30,
      schedule: DEFAULT_SCHEDULE
    }
  ]);

  const handleSelectProfessional = (id: string) => {
    setSelectedProfessional(id);
    setSelectedTab('schedule');
  };

  const handleSaveSchedule = (schedule: any) => {
    // Aqui implementaríamos a lógica para salvar a agenda do profissional
    console.log('Schedule saved:', schedule);
    toast.success('Horários salvos com sucesso!');
  };

  const handleSaveServices = (selectedServices: string[], commissions: Record<string, number>, defaultCommission: number) => {
    if (!selectedProfessional) return;
    
    setProfessionals(prev => 
      prev.map(professional => 
        professional.id === selectedProfessional
          ? {
              ...professional,
              services: selectedServices,
              commissions,
              defaultCommission
            }
          : professional
      )
    );
    
    toast.success('Serviços e comissões salvos com sucesso!');
  };

  const handleSaveProfessional = (professional: Professional) => {
    // Implement saving professional
    console.log("Saving professional:", professional);
    toast.success("Profissional salvo com sucesso!");
  };

  const handleCancelForm = () => {
    setSelectedTab('list');
  };

  const getCurrentProfessional = () => {
    return professionals.find(p => p.id === selectedProfessional);
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profissionais</h1>
          <p className="text-muted-foreground">
            Gerencie os profissionais, horários e serviços oferecidos
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="create">Novo Profissional</TabsTrigger>
            {selectedProfessional && (
              <>
                <TabsTrigger value="schedule">Horários</TabsTrigger>
                <TabsTrigger value="services">Serviços e Comissões</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <ProfessionalList
              professionals={professionals}
              onSelect={handleSelectProfessional}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </TabsContent>

          <TabsContent value="create">
            <ProfessionalForm 
              professional={null} 
              services={mockServices} 
              onSave={handleSaveProfessional} 
              onCancel={handleCancelForm} 
            />
          </TabsContent>

          {selectedProfessional && (
            <>
              <TabsContent value="schedule">
                <WeeklySchedule
                  professionalId={selectedProfessional}
                  onSave={handleSaveSchedule}
                />
              </TabsContent>

              <TabsContent value="services">
                <ProfessionalServices
                  professionalId={selectedProfessional}
                  services={mockServices}
                  selectedServices={getCurrentProfessional()?.services || []}
                  professionalCommissions={getCurrentProfessional()?.commissions}
                  defaultCommission={getCurrentProfessional()?.defaultCommission}
                  onSave={handleSaveServices}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Team;
