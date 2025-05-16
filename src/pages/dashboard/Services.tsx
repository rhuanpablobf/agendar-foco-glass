
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ServiceList } from '@/components/services/ServiceList';
import { ServiceForm } from '@/components/services/ServiceForm';
import { ServiceDetails } from '@/components/services/ServiceDetails';
import { SubscriptionLimits } from '@/components/subscription/SubscriptionLimits';
import { useSubscription } from '@/hooks/useSubscription';
import { Service, ServiceCategory } from '@/types/service';
import { toast } from 'sonner';

const Services = () => {
  const { subscriptionStatus } = useSubscription();
  const showSubscriptionWarning = subscriptionStatus?.isLimitReached && subscriptionStatus?.plan === 'Gratuito';
  
  // State for services
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Corte de Cabelo',
      description: 'Corte tradicional masculino ou feminino',
      duration: 30,
      price: 50,
      category: 'hair',
      isActive: true,
      isCombo: false
    },
    {
      id: '2',
      name: 'Manicure',
      description: 'Tratamento completo para unhas',
      duration: 45,
      price: 35,
      category: 'nails',
      isActive: true,
      isCombo: false
    }
  ]);

  // State for current service being edited or viewed
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // State for active category filter
  const [activeFilter, setActiveFilter] = useState<ServiceCategory | 'all'>('all');

  // Filter services based on active category
  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  // Handle editing a service
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    // In a real app, you might open a modal or navigate to an edit page
  };

  // Handle toggling service active state
  const handleToggleActive = (id: string, isActive: boolean) => {
    setServices(prev => 
      prev.map(service => service.id === id ? { ...service, isActive } : service)
    );
  };

  // Handle filter change
  const handleFilterChange = (category: ServiceCategory | 'all') => {
    setActiveFilter(category);
  };

  // Handle form submission
  const handleSubmitService = (serviceData: any) => {
    // In a real app, you would send this to an API
    if (selectedService) {
      // Update existing service
      setServices(prev => 
        prev.map(service => service.id === selectedService.id ? 
          { ...service, ...serviceData } : 
          service
        )
      );
      toast.success('Serviço atualizado com sucesso!');
    } else {
      // Create new service
      const newService = {
        id: Date.now().toString(), // Generate a temporary ID
        ...serviceData,
        isActive: true
      };
      setServices(prev => [...prev, newService as Service]);
      toast.success('Serviço criado com sucesso!');
    }
    setSelectedService(null);
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela sua empresa
          </p>
        </div>

        {showSubscriptionWarning && (
          <div className="mb-4">
            <SubscriptionLimits variant="compact" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <ServiceList 
              services={filteredServices} 
              onEdit={handleEditService} 
              onToggleActive={handleToggleActive}
              onFilter={handleFilterChange}
              activeFilter={activeFilter}
            />
          </div>
          <div className="space-y-6">
            <ServiceForm 
              onSubmit={handleSubmitService} 
              initialData={selectedService || undefined}
              availableServices={services.filter(s => !s.isCombo)}
              isEdit={!!selectedService}
            />
            {selectedService && (
              <ServiceDetails 
                service={selectedService} 
                relatedServices={services}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;
