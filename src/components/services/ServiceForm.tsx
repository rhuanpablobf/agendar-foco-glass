
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceCategory, Service, ServiceFormData } from '@/types/service';
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, DollarSign, Percent, Tag } from "lucide-react";
import { toast } from "sonner";

const serviceCategories: { value: ServiceCategory; label: string }[] = [
  { value: 'hair', label: 'Cabelo' },
  { value: 'nails', label: 'Unhas' },
  { value: 'skincare', label: 'Skincare' },
  { value: 'makeup', label: 'Maquiagem' },
  { value: 'other', label: 'Outro' },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  description: z.string().optional(),
  duration: z.coerce.number().min(5, { message: "A duração mínima é de 5 minutos" }),
  price: z.coerce.number().min(0, { message: "O preço não pode ser negativo" }),
  category: z.enum(['hair', 'nails', 'skincare', 'makeup', 'other']),
  isCombo: z.boolean().default(false),
  comboServices: z.array(z.string()).optional(),
  comboDiscount: z.coerce.number().min(0).max(100).optional(),
});

interface ServiceFormProps {
  onSubmit: (data: ServiceFormData) => void;
  initialData?: Partial<ServiceFormData>;
  availableServices?: Service[];
  isEdit?: boolean;
}

export const ServiceForm = ({
  onSubmit,
  initialData,
  availableServices = [],
  isEdit = false
}: ServiceFormProps) => {
  const [isCombo, setIsCombo] = useState(initialData?.isCombo || false);
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.comboServices || []);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 30,
      price: initialData?.price || 0,
      category: initialData?.category || "other",
      isCombo: initialData?.isCombo || false,
      comboServices: initialData?.comboServices || [],
      comboDiscount: initialData?.comboDiscount || 0,
    },
  });

  // Calculate totals for combo services
  useEffect(() => {
    if (isCombo && availableServices.length > 0) {
      const services = availableServices.filter(s => selectedServices.includes(s.id));
      const duration = services.reduce((total, service) => total + service.duration, 0);
      const price = services.reduce((total, service) => total + service.price, 0);
      const discount = form.getValues("comboDiscount") || 0;
      const discounted = price * (1 - discount / 100);
      
      setTotalDuration(duration);
      setTotalPrice(price);
      setDiscountedPrice(discounted);
      
      // Update form values
      form.setValue("duration", duration);
      form.setValue("price", discounted);
    }
  }, [selectedServices, form.watch("comboDiscount"), isCombo, availableServices]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (isCombo && selectedServices.length < 2) {
      toast.error("Um combo deve conter pelo menos 2 serviços");
      return;
    }
    
    onSubmit({
      ...data,
      comboServices: isCombo ? selectedServices : undefined,
    });
  };

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Serviço</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corte de Cabelo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os detalhes do serviço" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag size={16} />
                  Categoria
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isCombo && (
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock size={16} />
                    Duração (minutos)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isCombo && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Preço (R$)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={0.01} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="isCombo" 
              checked={isCombo}
              onCheckedChange={(checked) => {
                setIsCombo(checked);
                form.setValue("isCombo", checked);
              }}
            />
            <Label htmlFor="isCombo">Este é um combo de serviços</Label>
          </div>

          {isCombo && (
            <div className="space-y-4 p-4 bg-muted/20 rounded-md">
              <h3 className="font-medium">Serviços incluídos no combo</h3>
              
              {availableServices.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum serviço disponível. Adicione serviços individuais primeiro.
                </p>
              ) : (
                <div className="grid gap-2 max-h-[200px] overflow-y-auto p-2">
                  {availableServices
                    .filter(service => !service.isCombo) // Filter out existing combos
                    .map(service => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => toggleServiceSelection(service.id)}
                        />
                        <label
                          htmlFor={service.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                        >
                          {service.name}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {service.duration}min
                        </span>
                        <span className="text-xs text-muted-foreground">
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              <FormField
                control={form.control}
                name="comboDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Percent size={16} />
                      Desconto (%)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        max={100} 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          const discount = parseFloat(e.target.value) || 0;
                          setDiscountedPrice(totalPrice * (1 - discount / 100));
                          form.setValue("price", totalPrice * (1 - discount / 100));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedServices.length > 0 && (
                <div className="bg-accent/10 p-3 rounded-md space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Duração total:</span>
                    <span className="font-medium">{totalDuration} minutos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Valor total:</span>
                    <span className="font-medium">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Valor com desconto:</span>
                    <span className="font-medium">R$ {discountedPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEdit ? "Salvar" : "Criar serviço"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
