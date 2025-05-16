
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
}

interface CommissionConfigProps {
  services: Service[];
  defaultCommission: number;
  serviceCommissions: Record<string, number>;
  onChange: (serviceId: string, commission: number) => void;
}

export const CommissionConfig: React.FC<CommissionConfigProps> = ({
  services,
  defaultCommission,
  serviceCommissions,
  onChange
}) => {
  const categories = [...new Set(services.map(service => service.category))];
  
  if (services.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">
          Primeiro selecione os serviços que este profissional realiza na aba "Serviços".
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Comissão padrão: <strong>{defaultCommission}%</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Essa é a comissão aplicada a todos os serviços por padrão.
              Você pode personalizar comissões específicas abaixo.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {categories.map(category => {
          const categoryServices = services.filter(service => service.category === category);
          return (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-medium">{category}</h3>
              <div className="space-y-2">
                {categoryServices.map(service => {
                  const commission = serviceCommissions[service.id] !== undefined 
                    ? serviceCommissions[service.id] 
                    : defaultCommission;
                  
                  const calculatedValue = (service.price * commission / 100).toFixed(2);
                  
                  return (
                    <div key={service.id} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Preço: R$ {service.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-28">
                        <div className="flex items-center space-x-2">
                          <Input
                            id={`commission-${service.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={commission}
                            onChange={(e) => onChange(service.id, parseFloat(e.target.value) || 0)}
                            className="w-16 text-right"
                          />
                          <Label htmlFor={`commission-${service.id}`} className="text-sm">%</Label>
                        </div>
                      </div>
                      <div className="w-20 text-right">
                        <p className="text-sm">R$ {calculatedValue}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator />
            </div>
          );
        })}
      </div>
    </div>
  );
};
