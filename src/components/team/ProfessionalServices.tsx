
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Service } from '@/types/service';
import { toast } from 'sonner';
import { Search, Plus, Percent } from 'lucide-react';

interface ProfessionalServicesProps {
  professionalId: string;
  services: Service[];
  selectedServices?: string[];
  professionalCommissions?: Record<string, number>;
  defaultCommission?: number;
  onSave: (selectedServices: string[], commissions: Record<string, number>, defaultCommission: number) => void;
}

export const ProfessionalServices: React.FC<ProfessionalServicesProps> = ({
  professionalId,
  services,
  selectedServices = [],
  professionalCommissions = {},
  defaultCommission = 30,
  onSave
}) => {
  const [selected, setSelected] = useState<string[]>(selectedServices);
  const [commissions, setCommissions] = useState<Record<string, number>>(professionalCommissions);
  const [commission, setCommission] = useState<number>(defaultCommission);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  
  const categories = Object.keys(servicesByCategory);
  
  const filteredServices = searchTerm
    ? services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const handleToggleService = (serviceId: string) => {
    setSelected(prevSelected => 
      prevSelected.includes(serviceId)
        ? prevSelected.filter(id => id !== serviceId)
        : [...prevSelected, serviceId]
    );
    
    // Se o serviço não tem uma comissão específica definida, use o padrão
    if (!commissions[serviceId] && !selected.includes(serviceId)) {
      setCommissions(prevCommissions => ({
        ...prevCommissions,
        [serviceId]: commission
      }));
    }
  };
  
  const handleCommissionChange = (serviceId: string, value: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setCommissions(prev => ({
        ...prev,
        [serviceId]: parsedValue
      }));
    }
  };
  
  const handleDefaultCommissionChange = (value: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setCommission(parsedValue);
    }
  };
  
  const applyDefaultCommission = () => {
    const updatedCommissions = { ...commissions };
    selected.forEach(serviceId => {
      updatedCommissions[serviceId] = commission;
    });
    setCommissions(updatedCommissions);
    toast.success(`Comissão de ${commission}% aplicada a todos os serviços selecionados`);
  };
  
  const handleSave = () => {
    // Garantir que todos os serviços selecionados tenham comissão definida
    const updatedCommissions = { ...commissions };
    selected.forEach(serviceId => {
      if (updatedCommissions[serviceId] === undefined) {
        updatedCommissions[serviceId] = commission;
      }
    });
    
    onSave(selected, updatedCommissions, commission);
    toast.success('Serviços e comissões salvas com sucesso');
  };
  
  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Serviços e Comissões</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md px-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <Input 
                type="number"
                min="0"
                max="100"
                value={commission}
                onChange={(e) => handleDefaultCommissionChange(e.target.value)}
                className="w-16 border-0 bg-transparent"
                placeholder="30%"
              />
              <span className="text-muted-foreground">%</span>
            </div>
            <Button variant="outline" size="sm" onClick={applyDefaultCommission}>
              Aplicar a Todos
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Tabs defaultValue={categories[0] || "search"}>
            <TabsList className="w-full overflow-x-auto">
              {searchTerm ? (
                <TabsTrigger value="search">
                  Resultados da busca ({filteredServices.length})
                </TabsTrigger>
              ) : (
                categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))
              )}
            </TabsList>

            {searchTerm ? (
              <TabsContent value="search" className="pt-4">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum serviço encontrado para "{searchTerm}"
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredServices.map(service => (
                      <ServiceItem
                        key={service.id}
                        service={service}
                        isChecked={selected.includes(service.id)}
                        commission={commissions[service.id] || commission}
                        onToggle={() => handleToggleService(service.id)}
                        onCommissionChange={(value) => handleCommissionChange(service.id, value)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ) : (
              categories.map(category => (
                <TabsContent key={category} value={category} className="pt-4">
                  <div className="space-y-2">
                    {servicesByCategory[category].map(service => (
                      <ServiceItem
                        key={service.id}
                        service={service}
                        isChecked={selected.includes(service.id)}
                        commission={commissions[service.id] || commission}
                        onToggle={() => handleToggleService(service.id)}
                        onCommissionChange={(value) => handleCommissionChange(service.id, value)}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))
            )}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

interface ServiceItemProps {
  service: Service;
  isChecked: boolean;
  commission: number;
  onToggle: () => void;
  onCommissionChange: (value: string) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  isChecked,
  commission,
  onToggle,
  onCommissionChange
}) => {
  return (
    <div className={`p-3 flex items-center justify-between rounded-md ${isChecked ? 'bg-white/5' : ''}`}>
      <div className="flex items-center gap-2 flex-1">
        <Checkbox id={`service-${service.id}`} checked={isChecked} onCheckedChange={() => onToggle()} />
        <Label htmlFor={`service-${service.id}`} className="cursor-pointer flex-1">
          <div className="font-medium">{service.name}</div>
          <div className="text-xs text-muted-foreground">
            {service.duration} min • R$ {service.price.toFixed(2)}
          </div>
        </Label>
      </div>
      
      {isChecked && (
        <div className="flex items-center">
          <div className="flex items-center border rounded-md px-2 bg-white/5">
            <Input 
              type="number"
              min="0"
              max="100"
              value={commission}
              onChange={(e) => onCommissionChange(e.target.value)}
              className="w-12 border-0 bg-transparent text-right"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
      )}
    </div>
  );
};
