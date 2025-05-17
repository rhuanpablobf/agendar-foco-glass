import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Clock, Search, UserPlus, X } from 'lucide-react';
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
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showNoResults, setShowNoResults] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);
  
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

  // Filter clients when search query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter((client) => 
        client.name.toLowerCase().includes(query) || 
        client.email.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
      setIsSearchOpen(true);
      setSelectedIndex(-1);
      setShowNoResults(filtered.length === 0);
    } else {
      setFilteredClients([]);
      setShowNoResults(false);
      if (searchQuery.length === 0) {
        setIsSearchOpen(false);
      }
    }
  }, [searchQuery, clients]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isSearchOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredClients.length - 1 ? prev + 1 : filteredClients.length - 1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredClients.length) {
          selectClient(filteredClients[selectedIndex].id.toString());
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsSearchOpen(false);
        break;
      default:
        break;
    }
  };
  
  // Handle client selection
  const selectClient = (clientId: string) => {
    form.setValue('client', clientId);
    const client = clients.find(c => c.id.toString() === clientId);
    if (client) {
      setSearchQuery(client.name);
    }
    setIsSearchOpen(false);
    setShowNoResults(false);
  };
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
    form.setValue('client', '');
    setShowNoResults(false);
    setIsSearchOpen(false);
  };

  // Handle form submission
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
  
  // Get selected client name
  const getSelectedClientName = () => {
    const clientId = form.watch('client');
    if (!clientId) return '';
    
    const client = clients.find(c => c.id.toString() === clientId);
    return client ? client.name : '';
  };

  // Handle new client button click with preventing default and stopping propagation
  const handleNewClientClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onNewClient function to open the modal
    if (onNewClient) {
      onNewClient();
    }
    
    // Keep the search open state as is to avoid UI flicker
    // We'll let the modal or navigation handle closing this if needed
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Novo Agendamento</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Client search and autocomplete */}
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Cliente</FormLabel>
                  <div className="relative">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente por nome, email ou telefone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
                        className="pl-10 pr-10"
                      />
                      {searchQuery && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={clearSearch}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {isSearchOpen && (
                      <div
                        ref={commandRef}
                        onKeyDown={handleKeyDown}
                        className="absolute top-full left-0 z-50 w-full mt-1 rounded-md border bg-popover shadow-md"
                      >
                        <Command className="rounded-lg border shadow-md">
                          <CommandList>
                            {filteredClients.length > 0 ? (
                              <CommandGroup>
                                {filteredClients.map((client, index) => (
                                  <CommandItem
                                    key={client.id}
                                    className={cn(
                                      "flex flex-col items-start p-2",
                                      selectedIndex === index ? "bg-accent text-accent-foreground" : ""
                                    )}
                                    onSelect={() => selectClient(client.id.toString())}
                                  >
                                    <div className="font-medium">{client.name}</div>
                                    <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                                      <span>{client.phone}</span>
                                      {client.email && <span>• {client.email}</span>}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ) : showNoResults ? (
                              <CommandEmpty className="py-6 px-2">
                                <div className="text-center space-y-4">
                                  <p>Nenhum cliente encontrado com "{searchQuery}"</p>
                                  <Button 
                                    type="button" 
                                    onClick={handleNewClientClick}
                                    className="bg-primary hover:bg-primary/90"
                                  >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Criar novo cliente
                                  </Button>
                                </div>
                              </CommandEmpty>
                            ) : null}
                          </CommandList>
                        </Command>
                      </div>
                    )}
                  </div>
                  <input type="hidden" {...field} />
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
