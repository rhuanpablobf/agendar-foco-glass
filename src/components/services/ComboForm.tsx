
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Service, ServiceFormData } from '@/types/service';
import { toast } from 'sonner';

interface ComboFormProps {
  services: Service[];
  onSave: (serviceData: ServiceFormData) => void;
  initialData?: Partial<ServiceFormData>;
}

export const ComboForm: React.FC<ComboFormProps> = ({
  services,
  onSave,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.comboServices || []);
  const [discountPercent, setDiscountPercent] = useState(initialData?.comboDiscount || 10);
  
  const [totalDuration, setTotalDuration] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  
  // Recalcular duração e preços quando os serviços selecionados ou o desconto mudam
  useEffect(() => {
    const selected = services.filter(service => selectedServices.includes(service.id));
    
    const duration = selected.reduce((total, service) => total + service.duration, 0);
    const price = selected.reduce((total, service) => total + service.price, 0);
    const discountedPrice = price * (1 - discountPercent / 100);
    
    setTotalDuration(duration);
    setOriginalPrice(price);
    setFinalPrice(discountedPrice);
  }, [selectedServices, discountPercent, services]);
  
  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  
  const handleDiscountChange = (value: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setDiscountPercent(parsedValue);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Por favor, informe um nome para o combo');
      return;
    }
    
    if (selectedServices.length < 2) {
      toast.error('Selecione pelo menos 2 serviços para criar um combo');
      return;
    }
    
    const serviceData: ServiceFormData = {
      name,
      description,
      duration: totalDuration,
      price: finalPrice,
      category: 'combo', // Podemos ter uma categoria específica para combos
      isCombo: true,
      comboServices: selectedServices,
      comboDiscount: discountPercent
    };
    
    onSave(serviceData);
  };
  
  // Agrupar serviços por categoria para melhor visualização
  const servicesByCategory = services.reduce((acc, service) => {
    // Não incluir outros combos na lista
    if (service.isCombo) return acc;
    
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  
  const categories = Object.keys(servicesByCategory);
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <CardTitle>Criar Combo de Serviços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Combo *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Dia da Noiva Completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que está incluso neste combo..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <div className="flex items-center">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="w-24"
                  />
                  <span className="ml-2">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Desconto aplicado sobre o valor total dos serviços individuais
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <CardTitle>Selecione os Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-medium capitalize">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {servicesByCategory[category].map(service => (
                      <div key={service.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/5">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleToggleService(service.id)}
                        />
                        <Label
                          htmlFor={`service-${service.id}`}
                          className="flex flex-1 justify-between cursor-pointer text-sm"
                        >
                          <span>{service.name}</span>
                          <span className="text-muted-foreground">
                            {service.duration} min • R$ {service.price.toFixed(2)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {selectedServices.length > 0 && (
                <div className="bg-white/5 p-4 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Resumo do Combo</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Duração total:</span>
                      <span>{totalDuration} minutos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor original:</span>
                      <span>R$ {originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desconto ({discountPercent}%):</span>
                      <span>-R$ {(originalPrice - finalPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Valor final:</span>
                      <span>R$ {finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={selectedServices.length < 2 || !name}>
            Salvar Combo
          </Button>
        </div>
      </div>
    </form>
  );
};
