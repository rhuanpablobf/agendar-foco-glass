
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, Filter, Plus, Search, User, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ClientCombobox } from '@/components/clients/ClientCombobox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Estilos CSS personalizados para o grid de horários
import './schedule.css';

// Dados mockados para demonstração
const mockProfessionals = [
  { id: 1, name: "Ana Silva", specialty: "Cabeleireira", photo: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Carlos Oliveira", specialty: "Barbeiro", photo: "https://i.pravatar.cc/150?img=8" },
  { id: 3, name: "Mariana Costa", specialty: "Manicure", photo: "https://i.pravatar.cc/150?img=5" },
];

const mockServices = [
  { id: 1, name: "Corte de Cabelo", duration: 30, price: 80, category: "Cabelo" },
  { id: 2, name: "Coloração", duration: 120, price: 150, category: "Cabelo" },
  { id: 3, name: "Manicure", duration: 60, price: 60, category: "Unhas" },
  { id: 4, name: "Barba", duration: 30, price: 50, category: "Barba" },
];

const mockClients = [
  { id: 1, name: "João Silva", phone: "(11) 98765-4321", email: "joao@email.com" },
  { id: 2, name: "Maria Souza", phone: "(11) 91234-5678", email: "maria@email.com" },
  { id: 3, name: "Pedro Santos", phone: "(11) 99876-5432", email: "pedro@email.com" },
  { id: 4, name: "Ana Oliveira", phone: "(11) 99999-8888", email: "ana@email.com" },
  { id: 5, name: "Lucas Pereira", phone: "(11) 98888-7777", email: "lucas@email.com" },
  { id: 6, name: "Juliana Mendes", phone: "(11) 97777-6666", email: "juliana@email.com" },
  { id: 7, name: "Roberto Almeida", phone: "(11) 96666-5555", email: "roberto@email.com" },
  { id: 8, name: "Carolina Souza", phone: "(11) 95555-4444", email: "carolina@email.com" },
];

const mockAppointments = [
  { 
    id: 1, 
    professionalId: 1, 
    clientId: 1, 
    clientName: "João Silva", 
    serviceId: 1, 
    serviceName: "Corte de Cabelo",
    date: new Date(), 
    startTime: "10:00", 
    endTime: "10:30", 
    status: "confirmado", 
    price: 80 
  },
  { 
    id: 2, 
    professionalId: 1, 
    clientId: 2, 
    clientName: "Maria Souza", 
    serviceId: 2, 
    serviceName: "Coloração",
    date: new Date(), 
    startTime: "11:00", 
    endTime: "13:00", 
    status: "pendente", 
    price: 150 
  },
  { 
    id: 3, 
    professionalId: 2, 
    clientId: 3, 
    clientName: "Pedro Santos", 
    serviceId: 4, 
    serviceName: "Barba",
    date: new Date(), 
    startTime: "14:00", 
    endTime: "14:30", 
    status: "confirmado", 
    price: 50 
  },
  { 
    id: 4, 
    professionalId: 3, 
    clientId: 2, 
    clientName: "Maria Souza", 
    serviceId: 3, 
    serviceName: "Manicure",
    date: addDays(new Date(), 1), 
    startTime: "09:00", 
    endTime: "10:00", 
    status: "confirmado", 
    price: 60
  }
];

// Horários disponíveis para agendamento
const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];

// Schema de validação para o formulário de agendamento
const appointmentFormSchema = z.object({
  professional: z.string().min(1, "Selecione um profissional"),
  client: z.string().min(1, "Selecione um cliente"),
  service: z.string().min(1, "Selecione um serviço"),
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
});

// Schema para novo cliente
const newClientFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  phone: z.string().min(8, "O telefone deve ter pelo menos 8 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
type NewClientFormValues = z.infer<typeof newClientFormSchema>;

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [planLimitReached, setPlanLimitReached] = useState(false); // Mock: controle de limite do plano
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  // Formulário para novo agendamento
  const appointmentForm = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  // Formulário para novo cliente
  const newClientForm = useForm<NewClientFormValues>({
    resolver: zodResolver(newClientFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  // Filtrar agendamentos com base nos filtros selecionados
  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchDate = isSameDay(appointment.date, selectedDate);
    const matchProfessional = selectedProfessional ? Number(selectedProfessional) === appointment.professionalId : true;
    const matchStatus = selectedStatus ? selectedStatus === appointment.status : true;

    return matchDate && matchProfessional && matchStatus;
  });

  const handleCreateAppointment = (data: AppointmentFormValues) => {
    if (planLimitReached) {
      toast.error("Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar.");
      return;
    }

    // Aqui iria a lógica para criar um novo agendamento
    console.log("Criando novo agendamento:", data);
    
    toast.success("Agendamento criado com sucesso!");
    appointmentForm.reset();
    setIsAppointmentDialogOpen(false);
  };

  const handleCreateClient = (data: NewClientFormValues) => {
    // Aqui iria a lógica para criar um novo cliente
    console.log("Criando novo cliente:", data);
    
    toast.success("Cliente cadastrado com sucesso!");
    newClientForm.reset();
    setShowNewClientModal(false);
  };

  // Renderizar as células de horário para cada profissional
  const renderTimeSlots = (professional: typeof mockProfessionals[0]) => {
    return (
      <div className="grid grid-cols-24 gap-2">
        {timeSlots.map((time, index) => {
          const appointment = filteredAppointments.find(
            app => app.professionalId === professional.id && app.startTime === time
          );

          const getAppointmentClass = (status?: string) => {
            switch (status) {
              case "confirmado":
                return "bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30";
              case "pendente":
                return "bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30";
              default:
                return "bg-white/5 border border-white/10 hover:bg-white/10";
            }
          };

          return (
            <div 
              key={`${professional.id}-${time}`} 
              className={cn(
                "time-slot transition-all rounded-md shadow-sm",
                appointment 
                  ? getAppointmentClass(appointment.status)
                  : "time-slot-free"
              )}
              style={{
                gridColumn: `span ${appointment?.serviceId === 2 ? 4 : 1} / span ${appointment?.serviceId === 2 ? 4 : 1}`,
              }}
            >
              {appointment ? (
                <div className="appointment-card">
                  <div>
                    <div className="appointment-client">{appointment.clientName}</div>
                    <div className="appointment-service">{appointment.serviceName}</div>
                  </div>
                  <div className="appointment-time">
                    {appointment.startTime} - {appointment.endTime}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">{time}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Agenda</h1>
            <p className="text-muted-foreground">
              Gerencie os agendamentos da sua empresa
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-purple-500" disabled={planLimitReached}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
                <div className="p-6 space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Novo Agendamento</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo agendamento
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...appointmentForm}>
                    <form onSubmit={appointmentForm.handleSubmit(handleCreateAppointment)} className="space-y-5">
                      <div className="grid grid-cols-1 gap-5">
                        <FormField
                          control={appointmentForm.control}
                          name="professional"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Profissional</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full bg-white/5 border-white/20">
                                  <SelectValue placeholder="Selecione um profissional" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-md border border-white/20">
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
                        
                        <FormField
                          control={appointmentForm.control}
                          name="client"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel className="text-sm font-medium">Cliente</FormLabel>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                  onClick={() => setShowNewClientModal(true)}
                                >
                                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                                  Novo
                                </Button>
                              </div>
                              <ClientCombobox 
                                clients={mockClients}
                                value={field.value}
                                onChange={field.onChange}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={appointmentForm.control}
                          name="service"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Serviço</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full bg-white/5 border-white/20">
                                  <SelectValue placeholder="Selecione um serviço" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-md border border-white/20">
                                  {mockServices.map(service => (
                                    <SelectItem key={service.id} value={service.id.toString()}>
                                      <div className="flex justify-between items-center w-full">
                                        <span>{service.name}</span>
                                        <span className="text-muted-foreground text-xs">
                                          {service.duration}min • R${service.price.toFixed(2)}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-5">
                          <FormField
                            control={appointmentForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-sm font-medium">Data</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal bg-white/5 border-white/20",
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
                                  <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-md border border-white/20" align="start">
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
                                <FormLabel className="text-sm font-medium">Horário</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="w-full bg-white/5 border-white/20">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background/95 backdrop-blur-md border border-white/20 max-h-[200px]">
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
                              <FormLabel className="text-sm font-medium">Observações</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Observações sobre o agendamento" 
                                  className="bg-white/5 border-white/20" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAppointmentDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-primary to-purple-500"
                        >
                          Agendar
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>

            <Sheet open={showNewClientModal} onOpenChange={setShowNewClientModal}>
              <SheetContent className="sm:max-w-[450px] border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
                <SheetHeader>
                  <SheetTitle>Novo Cliente</SheetTitle>
                  <SheetDescription>
                    Cadastre um novo cliente para agendar serviços
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                  <Form {...newClientForm}>
                    <form onSubmit={newClientForm.handleSubmit(handleCreateClient)} className="space-y-5">
                      <FormField
                        control={newClientForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Nome completo</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nome do cliente" 
                                className="bg-white/5 border-white/20" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={newClientForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Telefone</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(00) 00000-0000" 
                                className="bg-white/5 border-white/20" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={newClientForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">E-mail (opcional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="email@exemplo.com" 
                                className="bg-white/5 border-white/20" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowNewClientModal(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-purple-500">
                          Cadastrar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {planLimitReached && (
          <Card className="bg-red-500/20 border border-red-300/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-red-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-red-200">Limite de agendamentos atingido</p>
                  <p className="text-sm text-red-300/80">
                    Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar usando o sistema.
                  </p>
                </div>
                <div className="ml-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Atualizar plano</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                      <DialogHeader>
                        <DialogTitle>Atualize para o Plano Profissional</DialogTitle>
                        <DialogDescription>
                          Desbloqueie recursos ilimitados e aproveite ao máximo o BeautySalon
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-white/5 border border-white/10 p-4">
                            <CardTitle className="text-lg mb-2">Plano Gratuito</CardTitle>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <span className="mr-2 bg-white/20 rounded-full p-0.5">
                                  <Clock className="h-3 w-3" />
                                </span>
                                5 agendamentos/mês
                              </li>
                              <li className="flex items-center">
                                <span className="mr-2 bg-white/20 rounded-full p-0.5">
                                  <User className="h-3 w-3" />
                                </span>
                                1 profissional
                              </li>
                            </ul>
                            <div className="mt-4 text-lg font-bold">Grátis</div>
                            <div className="text-xs text-muted-foreground">Seu plano atual</div>
                          </Card>
                          
                          <Card className="bg-primary/10 border border-primary/30 p-4">
                            <CardTitle className="text-lg mb-2">Plano Profissional</CardTitle>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                                  <Clock className="h-3 w-3" />
                                </span>
                                Agendamentos ilimitados
                              </li>
                              <li className="flex items-center">
                                <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                                  <User className="h-3 w-3" />
                                </span>
                                Múltiplos profissionais
                              </li>
                            </ul>
                            <div className="mt-4 text-lg font-bold">R$49,90<span className="text-xs font-normal">/mês</span></div>
                          </Card>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-end">
                        <Button type="button">
                          Assinar plano profissional
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2 items-center w-[240px]">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(selectedDate, "PPP", { locale: ptBR })}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-md border border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Todos os profissionais" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border border-white/20">
                    <SelectItem value={undefined}>Todos os profissionais</SelectItem>
                    {mockProfessionals.map(professional => (
                      <SelectItem key={professional.id} value={professional.id.toString()}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border border-white/20">
                    <SelectItem value={undefined}>Todos os status</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="concluído">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar agendamentos..."
                  className="pl-10 w-full sm:w-[240px] bg-white/5 border-white/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto pb-6">
            <div className="space-y-6">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="calendar">Calendário</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar" className="space-y-6 animate-fadeIn">
                  {selectedProfessional ? (
                    // Se um profissional específico está selecionado, mostra apenas ele
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 border-b border-white/10 bg-white/5 rounded-t-md">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-white/20 shadow-sm">
                          <img 
                            src={mockProfessionals.find(p => p.id.toString() === selectedProfessional)?.photo} 
                            alt="Profissional" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">
                            {mockProfessionals.find(p => p.id.toString() === selectedProfessional)?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {mockProfessionals.find(p => p.id.toString() === selectedProfessional)?.specialty}
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-auto schedule-scroll-container p-2">
                        {renderTimeSlots(
                          mockProfessionals.find(p => p.id.toString() === selectedProfessional)!
                        )}
                      </div>
                    </div>
                  ) : (
                    // Se nenhum profissional específico está selecionado, mostra todos
                    mockProfessionals.map(professional => (
                      <div key={professional.id} className="space-y-4 bg-white/5 rounded-md shadow-sm hover:bg-white/8 transition-colors">
                        <div className="flex items-center gap-3 p-4 border-b border-white/10">
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-white/20 shadow-sm">
                            <img src={professional.photo} alt={professional.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium">{professional.name}</div>
                            <div className="text-xs text-muted-foreground">{professional.specialty}</div>
                          </div>
                        </div>
                        
                        <div className="overflow-auto schedule-scroll-container p-2 pb-4">
                          {renderTimeSlots(professional)}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="list" className="animate-fadeIn">
                  <div className="relative overflow-x-auto rounded-md shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase bg-white/8">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left">Cliente</th>
                          <th scope="col" className="px-6 py-3 text-left">Serviço</th>
                          <th scope="col" className="px-6 py-3 text-left">Profissional</th>
                          <th scope="col" className="px-6 py-3 text-left">Horário</th>
                          <th scope="col" className="px-6 py-3 text-left">Valor</th>
                          <th scope="col" className="px-6 py-3 text-left">Status</th>
                          <th scope="col" className="px-6 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.length > 0 ? (
                          filteredAppointments.map(appointment => (
                            <tr key={appointment.id} className="border-b border-white/10 hover:bg-white/5">
                              <td className="px-6 py-4 font-medium whitespace-nowrap">
                                {appointment.clientName}
                              </td>
                              <td className="px-6 py-4">
                                {appointment.serviceName}
                              </td>
                              <td className="px-6 py-4">
                                {mockProfessionals.find(p => p.id === appointment.professionalId)?.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {appointment.startTime} - {appointment.endTime}
                              </td>
                              <td className="px-6 py-4">
                                R$ {appointment.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2 py-1 rounded text-xs",
                                  appointment.status === "confirmado" ? "bg-emerald-500/20 text-emerald-300" : 
                                  appointment.status === "pendente" ? "bg-amber-500/20 text-amber-300" : ""
                                )}>
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  Editar
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                              Nenhum agendamento encontrado para os filtros selecionados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Schedule;
