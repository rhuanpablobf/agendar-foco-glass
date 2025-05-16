
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
}

interface ServicesSelectionProps {
  allServices: Service[];
  selectedServices: string[];
  onChange: (selectedServices: string[]) => void;
}

export const ServicesSelection: React.FC<ServicesSelectionProps> = ({
  allServices,
  selectedServices,
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [...new Set(allServices.map(service => service.category))];
  
  const filteredServices = allServices.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggleService = (serviceId: string) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onChange(newSelection);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search-services">Buscar Serviços</Label>
        <Input
          id="search-services"
          type="text"
          placeholder="Buscar por nome ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="space-y-6">
        {searchTerm ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resultados da Busca</h3>
            <div className="space-y-2">
              {filteredServices.map(service => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`service-${service.id}`}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleToggleService(service.id)}
                  />
                  <Label 
                    htmlFor={`service-${service.id}`}
                    className="flex-1 text-sm cursor-pointer"
                  >
                    {service.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {service.duration} min • R$ {service.price.toFixed(2)}
                    </span>
                  </Label>
                </div>
              ))}
              
              {filteredServices.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum serviço encontrado para "{searchTerm}".
                </p>
              )}
            </div>
          </div>
        ) : (
          categories.map(category => {
            const categoryServices = allServices.filter(service => service.category === category);
            return (
              <div key={category} className="space-y-4">
                <h3 className="text-sm font-medium">{category}</h3>
                <div className="space-y-2">
                  {categoryServices.map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleToggleService(service.id)}
                      />
                      <Label 
                        htmlFor={`service-${service.id}`}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        {service.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {service.duration} min • R$ {service.price.toFixed(2)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
                <Separator />
              </div>
            );
          })
        )}
      </div>
      
      <div className="bg-muted/20 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          Serviços selecionados: <strong>{selectedServices.length}</strong> de {allServices.length}
        </p>
      </div>
    </div>
  );
};
