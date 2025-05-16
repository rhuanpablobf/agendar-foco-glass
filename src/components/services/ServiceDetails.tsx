
import React from 'react';
import { Service } from '@/types/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Tag, Check, Disc, Disc2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ServiceDetailsProps {
  service: Service;
  relatedServices?: Service[];
}

const getCategoryLabel = (category: string): string => {
  const categories: Record<string, string> = {
    hair: 'Cabelo',
    nails: 'Unhas',
    skincare: 'Skincare',
    makeup: 'Maquiagem',
    other: 'Outro'
  };
  return categories[category] || category;
};

export const ServiceDetails = ({ service, relatedServices = [] }: ServiceDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {service.isCombo ? <Disc2 className="h-5 w-5 text-primary" /> : <Disc className="h-5 w-5 text-primary" />}
          <div>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>
              {service.isCombo ? 'Combo de Serviços' : 'Serviço Individual'}
              {!service.isActive && <Badge variant="destructive" className="ml-2">Inativo</Badge>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {service.description && (
          <div className="text-sm">
            {service.description}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Categoria:</span>
            <Badge variant="outline">{getCategoryLabel(service.category)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Duração:</span>
            <span className="font-medium">{service.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Preço:</span>
            <span className="font-medium">R$ {service.price.toFixed(2)}</span>
          </div>
        </div>

        {service.isCombo && service.comboServices && service.comboServices.length > 0 && relatedServices.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Serviços incluídos neste combo:</h3>
              <div className="space-y-2">
                {service.comboServices.map(serviceId => {
                  const relatedService = relatedServices.find(s => s.id === serviceId);
                  if (!relatedService) return null;
                  
                  return (
                    <div key={serviceId} className="flex items-center justify-between px-4 py-2 bg-accent/10 rounded-md">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{relatedService.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>{relatedService.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          <span>R$ {relatedService.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {service.comboDiscount && service.comboDiscount > 0 && (
                <div className="flex justify-end mt-2">
                  <Badge variant="secondary">Desconto: {service.comboDiscount}%</Badge>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
