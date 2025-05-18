
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ServiceList } from '@/components/services/ServiceList';
import { ServiceForm } from '@/components/services/ServiceForm';
import { ComboForm } from '@/components/services/ComboForm';
import { ServiceFormData, Service, ServiceCategory } from '@/types/service';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';

// Mock data
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
    id: '5',
    name: 'Dia da Noiva',
    description: 'Pacote completo para noivas incluindo penteado, maquiagem e manicure',
    duration: 240,
    price: 450,
    category: 'combo',
    isActive: true,
    isCombo: true,
    comboServices: ['4', '6', '2'],
    comboDiscount: 15
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

const Services = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'service' | 'combo'>('service');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeFilter, setActiveFilter] = useState<ServiceCategory | 'all'>('all');

  const handleOpenNewServiceDialog = () => {
    setEditingService(null);
    setDialogMode('service');
    setIsDialogOpen(true);
  };

  const handleOpenNewComboDialog = () => {
    setEditingService(null);
    setDialogMode('combo');
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (service: Service) => {
    setEditingService(service);
    setDialogMode(service.isCombo ? 'combo' : 'service');
    setIsDialogOpen(true);
  };

  const handleSaveService = (serviceData: ServiceFormData) => {
    if (editingService) {
      // Atualizando serviço existente
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === editingService.id
            ? { ...service, ...serviceData }
            : service
        )
      );
      toast.success("Serviço atualizado com sucesso!");
    } else {
      // Criando novo serviço
      const newService: Service = {
        id: uuid(),
        ...serviceData,
        isActive: true
      };
      setServices(prev => [...prev, newService]);
      toast.success("Serviço criado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleToggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId
          ? { ...service, isActive }
          : service
      )
    );
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    toast.success("Serviço excluído com sucesso!");
  };

  const handleFilterChange = (category: ServiceCategory | 'all') => {
    setActiveFilter(category);
  };

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="text-muted-foreground">Gerencie os serviços oferecidos pelo seu estabelecimento</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleOpenNewServiceDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Serviço
            </Button>
            <Button onClick={handleOpenNewComboDialog} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Combo
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos os Serviços</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
            <TabsTrigger value="combos">Combos</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ServiceList
              services={services}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteService}
              onToggleActive={handleToggleServiceStatus}
              onFilter={handleFilterChange}
              activeFilter={activeFilter}
            />
          </TabsContent>

          <TabsContent value="active">
            <ServiceList
              services={services.filter(service => service.isActive)}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteService}
              onToggleActive={handleToggleServiceStatus}
              onFilter={handleFilterChange}
              activeFilter={activeFilter}
            />
          </TabsContent>

          <TabsContent value="inactive">
            <ServiceList
              services={services.filter(service => !service.isActive)}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteService}
              onToggleActive={handleToggleServiceStatus}
              onFilter={handleFilterChange}
              activeFilter={activeFilter}
            />
          </TabsContent>

          <TabsContent value="combos">
            <ServiceList
              services={services.filter(service => service.isCombo)}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteService}
              onToggleActive={handleToggleServiceStatus}
              onFilter={handleFilterChange}
              activeFilter={activeFilter}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingService 
                  ? `Editar ${editingService.isCombo ? 'Combo' : 'Serviço'}`
                  : dialogMode === 'combo' ? 'Novo Combo' : 'Novo Serviço'
                }
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'combo'
                  ? 'Crie um pacote combinando diversos serviços com desconto'
                  : 'Adicione as informações do serviço abaixo'
                }
              </DialogDescription>
            </DialogHeader>

            {dialogMode === 'service' ? (
              <ServiceForm
                onSave={handleSaveService}
                initialData={editingService || undefined}
                availableServices={services}
                isEdit={!!editingService}
              />
            ) : (
              <ComboForm
                services={services.filter(s => !s.isCombo)} // Filtra para não incluir outros combos
                onSave={handleSaveService}
                initialData={editingService || undefined}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Services;
