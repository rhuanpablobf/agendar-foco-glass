
import { z } from "zod";

export interface ScheduleDay {
  active: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
}

export interface Schedule {
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
}

export interface Appointment {
  id: number;
  professionalId: number;
  clientId: number;
  clientName: string;
  serviceId: number;
  serviceName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
}

// Schema de validação para o formulário de agendamento
export const appointmentFormSchema = z.object({
  professional: z.string().min(1, "Selecione um profissional"),
  client: z.string().min(1, "Selecione um cliente"),
  service: z.string().min(1, "Selecione um serviço"),
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

// Schema para novo cliente
export const newClientFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  phone: z.string().min(8, "O telefone deve ter pelo menos 8 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

export type NewClientFormValues = z.infer<typeof newClientFormSchema>;
