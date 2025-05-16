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
      <div className="grid grid-cols-24 gap-1">
        {timeSlots.map((time, index) => {
          const appointment = filteredAppointments.find(
            app => app.professionalId === professional.id && app.startTime === time
          );

          return (
            <div 
              key={`${professional.id}-${time}`} 
              className={cn(
                "h-16 rounded-md relative flex items-center justify-center transition-all",
                appointment 
                  ? appointment.status === "confirmado"
                    ? "bg-green-500/20 border border-green-500/30" 
                    : "bg-amber-500/20 border border-amber-500/30"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              )}
              style={{
                gridColumn: `span ${appointment?.serviceId === 2 ? 4 : 1} / span ${appointment?.serviceId === 2 ? 4 : 1}`,
              }}
            >
              {appointment ? (
                <div className="p-2 w-full h-full flex flex-col justify-between overflow-hidden">
                  <div className="font-medium text-sm truncate">{appointment.clientName}</div>
                  <div className="text-xs text-muted-foreground truncate">{appointment.serviceName}</div>
                  <div className="text-xs mt-1">{appointment.startTime} - {appointment.endTime}</div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">{time}</span>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={planLimitReached}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo agendamento
                  </DialogDescription>
                </DialogHeader>

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
                      
                      <div className="flex justify-between items-center gap-2">
                        <FormField
                          control={appointmentForm.control}
                          name="client"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Cliente</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um cliente" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
                                  {mockClients.map(client => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                      {client.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="mt-8">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setShowNewClientModal(true)}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
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
              </DialogContent>
            </Dialog>

            <Dialog open={showNewClientModal} onOpenChange={setShowNewClientModal}>
              <DialogContent className="sm:max-w-[500px] border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo cliente para agendar serviços
                  </DialogDescription>
                </DialogHeader>

                <Form {...newClientForm}>
                  <form onSubmit={newClientForm.handleSubmit(handleCreateClient)} className="space-y-4">
                    <FormField
                      control={newClientForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do cliente" {...field} />
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
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
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
                          <FormLabel>E-mail (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowNewClientModal(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Cadastrar</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                  <PopoverContent className="w-auto p-0 bg-background/90 backdrop-blur-sm border border-white/20" align="start">
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
                  <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
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
                  <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
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
                  className="pl-10 w-full sm:w-[240px]"
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
                
                <TabsContent value="calendar" className="space-y-6">
                  {selectedProfessional ? (
                    // Se um profissional específico está selecionado, mostra apenas ele
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 border-b border-white/10">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
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
                      
                      <div className="overflow-auto">
                        {renderTimeSlots(
                          mockProfessionals.find(p => p.id.toString() === selectedProfessional)!
                        )}
                      </div>
                    </div>
                  ) : (
                    // Se nenhum profissional específico está selecionado, mostra todos
                    mockProfessionals.map(professional => (
                      <div key={professional.id} className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border-b border-white/10">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src={professional.photo} alt={professional.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium">{professional.name}</div>
                            <div className="text-xs text-muted-foreground">{professional.specialty}</div>
                          </div>
                        </div>
                        
                        <div className="overflow-auto">
                          {renderTimeSlots(professional)}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="list">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-white/5">
                        <tr>
                          <th scope="col" className="px-6 py-3">Cliente</th>
                          <th scope="col" className="px-6 py-3">Serviço</th>
                          <th scope="col" className="px-6 py-3">Profissional</th>
                          <th scope="col" className="px-6 py-3">Horário</th>
                          <th scope="col" className="px-6 py-3">Valor</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.map(appointment => (
                          <tr key={appointment.id} className="border-b border-white/10">
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
                                appointment.status === "confirmado" ? "bg-green-500/20 text-green-300" : 
                                appointment.status === "pendente" ? "bg-amber-500/20 text-amber-300" : ""
                              )}>
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button variant="ghost" size="sm">Editar</Button>
                            </td>
                          </tr>
                        ))}
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
