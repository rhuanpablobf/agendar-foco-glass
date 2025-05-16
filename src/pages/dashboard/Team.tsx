
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalList } from '@/components/team/ProfessionalList';
import { ProfessionalForm } from '@/components/team/ProfessionalForm';
import { toast } from 'sonner';

// Mock data for professionals
export const MOCK_PROFESSIONALS = [
  {
    id: '1',
    name: 'Ana Silva',
    specialty: 'Cabeleireira',
    photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    bio: 'Especialista em cortes femininos e coloração, com mais de 8 anos de experiência.',
    defaultCommission: 30,
    schedule: {
      monday: { active: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      tuesday: { active: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      wednesday: { active: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      thursday: { active: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      friday: { active: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
      saturday: { active: true, start: '09:00', end: '16:00', breakStart: '12:00', breakEnd: '13:00' },
      sunday: { active: false, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
    },
    services: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    specialty: 'Barbeiro',
    photo: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    bio: 'Especialista em cortes masculinos, barba e tratamentos capilares para homens.',
    defaultCommission: 25,
    schedule: {
      monday: { active: true, start: '10:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      tuesday: { active: true, start: '10:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      wednesday: { active: true, start: '10:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      thursday: { active: true, start: '10:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      friday: { active: true, start: '10:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      saturday: { active: true, start: '10:00', end: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      sunday: { active: false, start: '10:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' }
    },
    services: ['2', '4', '6']
  }
];

// Mock data for services
export const MOCK_SERVICES = [
  { id: '1', name: 'Corte Feminino', duration: 60, price: 120, category: 'Cabelo', active: true },
  { id: '2', name: 'Corte Masculino', duration: 30, price: 70, category: 'Cabelo', active: true },
  { id: '3', name: 'Coloração', duration: 120, price: 200, category: 'Cabelo', active: true },
  { id: '4', name: 'Barba', duration: 30, price: 50, category: 'Barba', active: true },
  { id: '5', name: 'Manicure', duration: 45, price: 60, category: 'Unhas', active: true },
  { id: '6', name: 'Pedicure', duration: 60, price: 80, category: 'Unhas', active: true },
  { id: '7', name: 'Hidratação', duration: 45, price: 90, category: 'Tratamento', active: true },
  { id: '8', name: 'Design de Sobrancelhas', duration: 30, price: 50, category: 'Estética', active: true },
];

const Team = () => {
  const [professionals, setProfessionals] = useState(MOCK_PROFESSIONALS);
  const [showForm, setShowForm] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState(null);

  const handleAddProfessional = () => {
    setCurrentProfessional(null);
    setShowForm(true);
  };

  const handleEditProfessional = (professional) => {
    setCurrentProfessional(professional);
    setShowForm(true);
  };

  const handleSaveProfessional = (professional) => {
    if (professional.id) {
      // Update existing professional
      setProfessionals(prevProfessionals => 
        prevProfessionals.map(p => p.id === professional.id ? professional : p)
      );
      toast.success("Profissional atualizado com sucesso!");
    } else {
      // Add new professional
      const newProfessional = {
        ...professional,
        id: String(Date.now()), // Simple ID generation
      };
      setProfessionals(prevProfessionals => [...prevProfessionals, newProfessional]);
      toast.success("Profissional adicionado com sucesso!");
    }
    setShowForm(false);
  };

  const handleDeleteProfessional = (id) => {
    setProfessionals(prevProfessionals => prevProfessionals.filter(p => p.id !== id));
    toast.success("Profissional removido com sucesso!");
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Equipe</h1>
            <p className="text-muted-foreground">
              Gerencie os profissionais da sua empresa
            </p>
          </div>

          <div>
            <Button onClick={handleAddProfessional}>
              <Plus className="mr-2 h-4 w-4" /> Novo Profissional
            </Button>
          </div>
        </div>

        {showForm ? (
          <ProfessionalForm 
            professional={currentProfessional} 
            onSave={handleSaveProfessional} 
            onCancel={handleCancelForm}
            services={MOCK_SERVICES}
          />
        ) : (
          <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader>
              <CardTitle>Profissionais</CardTitle>
              <CardDescription>
                Cadastre e gerencie os profissionais da sua equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {professionals.length > 0 ? (
                <ProfessionalList 
                  professionals={professionals} 
                  onEdit={handleEditProfessional}
                  onDelete={handleDeleteProfessional}
                />
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  Nenhum profissional cadastrado. Clique em "Novo Profissional" para começar.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Team;
