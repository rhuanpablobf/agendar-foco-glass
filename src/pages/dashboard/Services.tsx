
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Service, ServiceCategory } from '@/types/service';
import { ServiceList } from '@/components/services/ServiceList';
import { ServiceForm } from '@/components/services/ServiceForm';
import { ServiceDetails } from '@/components/services/ServiceDetails';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock initial data for demonstration
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabelo Feminino',
    description: 'Corte e finalização para cabelos femininos',
    duration: 60,
    price: 120,
    category: 'hair',
    isActive: true,
    isCombo: false
  },
  {
    id: '2',
    name: 'Manicure',
    description: 'Tratamento, corte e esmaltação de unhas das mãos',
    duration: 40,
    price: 50,
    category: 'nails',
    isActive: true,
    isCombo: false
  },
  {
    id: '3',
    name: 'Combo Dia da Noiva',
    description: 'Preparação completa para noivas',
    duration: 240,
    price: 700,
    category: 'other',
    isActive: true,
    isCombo: true,
    comboServices: ['1', '2', '4'],
    comboDiscount: 15
  },
  {
    id: '4',
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
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'services' && !service.isCombo) || 
                      (activeTab === 'combos' && service.isCombo);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleAddService = () => {
    setIsFormOpen(true);
    setIsEditMode(false);
    setSelectedService(null);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsFormOpen(true);
    setIsEditMode(true);
  };

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, isActive } : service
      )
    );
  };

  const handleFormSubmit = (data: any) => {
    if (isEditMode && selectedService) {
      // Update existing service
      setServices(prev => 
        prev.map(service => 
          service.id === selectedService.id 
            ? { ...service, ...data } 
            : service
        )
      );
      toast.success(`Serviço "${data.name}" atualizado com sucesso`);
    } else {
      // Create new service
      const newService: Service = {
        id: uuidv4(),
        ...data,
        isActive: true
      };
      setServices(prev => [...prev, newService]);
      toast.success(`Serviço "${data.name}" criado com sucesso`);
    }
    setIsFormOpen(false);
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="text-muted-foreground">
              Gerencie os serviços oferecidos pela sua empresa
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar serviço..."
                className="w-full sm:w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button onClick={handleAddService}>
              <Plus className="mr-2 h-4 w-4" /> Novo Serviço
            </Button>
          </div>
        </div>

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <CardTitle>Catálogo de Serviços</CardTitle>
            <CardDescription>
              Cadastre e gerencie os serviços oferecidos pela sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="combos">Combos</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <ServiceList 
                  services={filteredServices}
                  onEdit={(service) => {
                    handleEditService(service);
                  }}
                  onToggleActive={handleToggleActive}
                  onFilter={setCategoryFilter}
                  activeFilter={categoryFilter}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Service Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
          </DialogHeader>
          <ServiceForm 
            onSubmit={handleFormSubmit}
            initialData={isEditMode && selectedService ? {
              name: selectedService.name,
              description: selectedService.description,
              duration: selectedService.duration,
              price: selectedService.price,
              category: selectedService.category,
              isCombo: selectedService.isCombo,
              comboServices: selectedService.comboServices,
              comboDiscount: selectedService.comboDiscount
            } : undefined}
            availableServices={services.filter(s => !s.isCombo && (
              !isEditMode || s.id !== selectedService?.id
            ))}
            isEdit={isEditMode}
          />
        </DialogContent>
      </Dialog>

      {/* Service Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Serviço</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <ServiceDetails 
              service={selectedService}
              relatedServices={services}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Services;
