import { addDays } from 'date-fns';

// Mock data for demonstration
export const mockProfessionals = [
  { id: 1, name: "Ana Silva", specialty: "Cabeleireira", photo: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Carlos Oliveira", specialty: "Barbeiro", photo: "https://i.pravatar.cc/150?img=8" },
  { id: 3, name: "Mariana Costa", specialty: "Manicure", photo: "https://i.pravatar.cc/150?img=5" },
];

export const mockServices = [
  { id: 1, name: "Corte de Cabelo", duration: 30, price: 80, category: "Cabelo" },
  { id: 2, name: "Coloração", duration: 120, price: 150, category: "Cabelo" },
  { id: 3, name: "Manicure", duration: 60, price: 60, category: "Unhas" },
  { id: 4, name: "Barba", duration: 30, price: 50, category: "Barba" },
];

export const mockClients = [
  { id: 1, name: "João Silva", phone: "(11) 98765-4321", email: "joao@email.com" },
  { id: 2, name: "Maria Souza", phone: "(11) 91234-5678", email: "maria@email.com" },
  { id: 3, name: "Pedro Santos", phone: "(11) 99876-5432", email: "pedro@email.com" },
];

export const mockAppointments = [
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
export const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];
