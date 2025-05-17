
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Define interfaces for data types
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Professional {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
}

// Form schema
const appointmentFormSchema = z.object({
  client: z.string().min(1, { message: "Cliente é obrigatório" }),
  professional: z.string().min(1, { message: "Profissional é obrigatório" }),
  service: z.string().min(1, { message: "Serviço é obrigatório" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  time: z.string().min(1, { message: "Horário é obrigatório" }),
  status: z.enum(["confirmed", "pending", "cancelled"], {
    required_error: "Status é obrigatório",
  }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  clients: Client[];
  professionals: Professional[];
  services: Service[];
  onSubmit: (data: any) => void;
  onNewClient: () => void;
  showNewClientModal: boolean;
  setShowNewClientModal: (show: boolean) => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  clients,
  professionals,
  services,
  onSubmit,
  onNewClient,
}) => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      client: "",
      professional: "",
      service: "",
      date: new Date(),
      time: "10:00",
      status: "confirmed",
      notes: "",
    },
  });

  const handleSubmit = (values: AppointmentFormValues) => {
    // Combine date and time
    const [hours, minutes] = values.time.split(":").map(Number);
    const appointmentDate = new Date(values.date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Find selected service to get duration
    const selectedService = services.find(s => s.id.toString() === values.service);
    
    const formattedData = {
      ...values,
      date: appointmentDate,
      duration: selectedService?.duration || 30,
      clientId: parseInt(values.client),
      clientName: clients.find(c => c.id.toString() === values.client)?.name || "",
      professionalId: parseInt(values.professional),
      professionalName: professionals.find(p => p.id.toString() === values.professional)?.name || "",
      serviceId: parseInt(values.service),
      serviceName: selectedService?.name || "",
    };

    onSubmit(formattedData);
  };

  // Generate time slots from 8:00 to 20:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Novo Agendamento</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client selection */}
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={onNewClient} className="whitespace-nowrap">
                      Novo Cliente
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Professional selection */}
            <FormField
              control={form.control}
              name="professional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professionals.filter(p => p.available).map((professional) => (
                        <SelectItem key={professional.id} value={professional.id.toString()}>
                          {professional.name} - {professional.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Service selection */}
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - {service.duration} min - R$ {service.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time selection */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status selection */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="confirmed" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Confirmado</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pending" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Pendente</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="cancelled" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Cancelado</FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Observações adicionais sobre o agendamento..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit">Agendar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
