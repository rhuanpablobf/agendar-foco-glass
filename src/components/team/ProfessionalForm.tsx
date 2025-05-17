import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleConfig } from './ScheduleConfig';
import { ServicesSelection } from './ServicesSelection';
import { CommissionConfig } from './CommissionConfig';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
}

interface ScheduleDay {
  active: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
  breakEnabled?: boolean;
}

interface Schedule {
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
}

interface Professional {
  id?: string;
  name: string;
  specialty: string;
  photo: string;
  bio: string;
  defaultCommission: number;
  schedule: Schedule;
  services: string[];
  serviceCommissions?: Record<string, number>;
}

interface ProfessionalFormProps {
  professional: Professional | null;
  services: Service[];
  onSave: (professional: Professional) => void;
  onCancel: () => void;
}

const DEFAULT_SCHEDULE_DAY: ScheduleDay = {
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

export const ProfessionalForm: React.FC<ProfessionalFormProps> = ({
  professional,
  services,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Professional>({
    name: '',
    specialty: '',
    photo: '',
    bio: '',
    defaultCommission: 30,
    schedule: DEFAULT_SCHEDULE,
    services: [],
    serviceCommissions: {}
  });

  useEffect(() => {
    if (professional) {
      setFormData({
        ...professional,
        serviceCommissions: professional.serviceCommissions || {}
      });
    }
  }, [professional]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultCommission' ? parseFloat(value) || 0 : value
    }));
  };

  const handleScheduleChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value
        }
      }
    }));
  };

  const handleCopySchedule = () => {
    const { monday } = formData.schedule;
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        tuesday: { ...monday },
        wednesday: { ...monday },
        thursday: { ...monday },
        friday: { ...monday }
      }
    }));
  };

  const handleServicesChange = (selectedServices: string[]) => {
    setFormData(prev => ({
      ...prev,
      services: selectedServices
    }));
  };

  const handleCommissionChange = (serviceId: string, commission: number) => {
    setFormData(prev => ({
      ...prev,
      serviceCommissions: {
        ...prev.serviceCommissions,
        [serviceId]: commission
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <CardTitle>
          {professional ? 'Editar Profissional' : 'Novo Profissional'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="schedule">Horários</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
              <TabsTrigger value="commission">Comissões</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo">URL da Foto</Label>
                <Input
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultCommission">Comissão Padrão (%)</Label>
                <Input
                  id="defaultCommission"
                  name="defaultCommission"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.defaultCommission}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="schedule">
              <ScheduleConfig 
                schedule={formData.schedule} 
                onChange={handleScheduleChange}
                onCopyWeekdays={handleCopySchedule}
              />
            </TabsContent>
            
            <TabsContent value="services">
              <ServicesSelection 
                allServices={services}
                selectedServices={formData.services}
                onChange={handleServicesChange}
              />
            </TabsContent>
            
            <TabsContent value="commission">
              <CommissionConfig 
                services={services.filter(service => formData.services.includes(service.id))}
                defaultCommission={formData.defaultCommission}
                serviceCommissions={formData.serviceCommissions || {}}
                onChange={handleCommissionChange}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
