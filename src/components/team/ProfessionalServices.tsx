
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Service } from '@/types/service';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

interface ProfessionalServicesProps {
  professionalId: string;
  services: Service[];
  selectedServices: string[];
  professionalCommissions?: Record<string, number>;
  defaultCommission?: number;
  onSave: (selectedServices: string[], commissions: Record<string, number>, defaultCommission: number) => void;
}

export const ProfessionalServices: React.FC<ProfessionalServicesProps> = ({
  professionalId,
  services,
  selectedServices: initialSelectedServices,
  professionalCommissions: initialCommissions = {},
  defaultCommission: initialDefaultCommission = 30,
  onSave,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(initialSelectedServices || []);
  const [commissions, setCommissions] = useState<Record<string, number>>(initialCommissions);
  const [defaultCommission, setDefaultCommission] = useState<number>(initialDefaultCommission);

  useEffect(() => {
    // Initialize state when props change
    setSelectedServices(initialSelectedServices || []);
    setCommissions(initialCommissions || {});
    setDefaultCommission(initialDefaultCommission || 30);
  }, [initialSelectedServices, initialCommissions, initialDefaultCommission]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prevSelected => {
      if (prevSelected.includes(serviceId)) {
        return prevSelected.filter(id => id !== serviceId);
      } else {
        return [...prevSelected, serviceId];
      }
    });
  };

  const handleCommissionChange = (serviceId: string, value: string) => {
    const commissionValue = parseFloat(value);
    if (!isNaN(commissionValue) && commissionValue >= 0 && commissionValue <= 100) {
      setCommissions(prevState => ({
        ...prevState,
        [serviceId]: commissionValue
      }));
    }
  };

  const handleDefaultCommissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setDefaultCommission(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedServices, commissions, defaultCommission);
  };

  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Serviços e Comissões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="defaultCommission">Comissão Padrão (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="defaultCommission"
                  type="number"
                  min="0"
                  max="100"
                  className="w-24"
                  value={defaultCommission}
                  onChange={handleDefaultCommissionChange}
                />
                <span>%</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <InfoIcon className="h-4 w-4" />
              <span>A comissão padrão é aplicada para todos os serviços sem uma comissão específica.</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Serviços Oferecidos</Label>
            <div className="border rounded-md divide-y">
              {services.map(service => (
                <div key={service.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleToggleService(service.id)}
                    />
                    <div>
                      <Label htmlFor={`service-${service.id}`} className="font-medium cursor-pointer">
                        {service.name}
                      </Label>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs font-normal">
                          {service.category}
                        </Badge>
                        <span>{service.duration} min</span>
                        <span>R$ {service.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedServices.includes(service.id) && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`commission-${service.id}`} className="whitespace-nowrap text-sm">
                        Comissão (%)
                      </Label>
                      <Input
                        id={`commission-${service.id}`}
                        type="number"
                        min="0"
                        max="100"
                        className="w-20"
                        value={commissions[service.id] || defaultCommission}
                        onChange={(e) => handleCommissionChange(service.id, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {services.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum serviço cadastrado
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Salvar</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
