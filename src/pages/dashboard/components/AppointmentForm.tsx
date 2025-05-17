import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DialogFooter } from '@/components/ui/dialog';
import { ClientCombobox } from '@/components/clients/ClientCombobox';
import { cn } from '@/lib/utils';

import { mockProfessionals, mockServices, mockClients, timeSlots } from '../data/mockData';
import { appointmentFormSchema, AppointmentFormValues } from '../types/schedule';

interface AppointmentFormProps {
  onCreateAppointment: (data: AppointmentFormValues) => void;
  onAddNewClient: () => void;
  planLimitReached: boolean;
}

export function AppointmentForm({ onCreateAppointment, onAddNewClient, planLimitReached }: AppointmentFormProps) {
  const appointmentForm = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  const handleCreateAppointment = (data: AppointmentFormValues) => {
    if (planLimitReached) {
      toast.error("Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar.");
      return;
    }

    onCreateAppointment(data);
    appointmentForm.reset();
  };

  return (
    <Form {...appointmentForm}>
      <form onSubmit={appointmentForm.handleSubmit(handleCreateAppointment)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={appointmentForm.control}
            name="professional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissional</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
                    {mockProfessionals.map(professional => (
                      <SelectItem key={professional.id} value={professional.id.toString()}>
                        {professional.name} ({professional.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between items-start gap-2">
            <FormField
              control={appointmentForm.control}
              name="client"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientCombobox 
                      clients={mockClients}
                      selectedClientId={field.value}
                      onClientSelect={field.onChange}
                      onAddNewClient={onAddNewClient}
                      error={!!appointmentForm.formState.errors.client}
                      placeholder="Selecione um cliente"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={appointmentForm.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
                    {mockServices.map(service => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} ({service.duration}min - R$ {service.price.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={appointmentForm.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
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
                    <PopoverContent className="w-auto p-0 bg-background/90 backdrop-blur-sm border border-white/20" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={appointmentForm.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
                      {timeSlots.map(time => (
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

          <FormField
            control={appointmentForm.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Input placeholder="Observações sobre o agendamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit">Agendar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
