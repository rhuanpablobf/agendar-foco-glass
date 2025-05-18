
// Mock data for development purposes
export const mockProfessionals = [
  { id: 1, name: 'Ana Silva', specialty: 'Cabeleireira', available: true },
  { id: 2, name: 'João Costa', specialty: 'Barbeiro', available: true },
  { id: 3, name: 'Maria Souza', specialty: 'Manicure', available: false },
  { id: 4, name: 'Pedro Santos', specialty: 'Esteticista', available: true },
];

export const mockClients = [
  { id: 1, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 98765-4321' },
  { id: 2, name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '(11) 91234-5678' },
  { id: 3, name: 'Ricardo Gomes', email: 'ricardo@email.com', phone: '(11) 99876-5432' },
];

export const mockServices = [
  { id: 1, name: 'Corte de Cabelo', duration: 30, price: 50, category: 'Cabelo' },
  { id: 2, name: 'Pintura', duration: 90, price: 120, category: 'Cabelo' },
  { id: 3, name: 'Manicure', duration: 45, price: 35, category: 'Unhas' },
  { id: 4, name: 'Pedicure', duration: 60, price: 45, category: 'Unhas' },
  { id: 5, name: 'Barba', duration: 30, price: 40, category: 'Barba' },
  { id: 6, name: 'Limpeza de Pele', duration: 60, price: 80, category: 'Estética' },
];

export const mockAppointments = [
  { 
    id: 1, 
    date: new Date(2023, 5, 14, 10, 0), 
    clientId: 1,
    clientName: 'Carlos Oliveira',
    professionalId: 1,
    professionalName: 'Ana Silva',
    serviceId: 1,
    serviceName: 'Corte de Cabelo',
    duration: 30,
    status: 'confirmed',
    notes: 'Cliente prefere corte curto',
  },
  { 
    id: 2, 
    date: new Date(2023, 5, 14, 11, 0), 
    clientId: 2,
    clientName: 'Fernanda Lima',
    professionalId: 1,
    professionalName: 'Ana Silva',
    serviceId: 2,
    serviceName: 'Pintura',
    duration: 90,
    status: 'confirmed',
    notes: 'Pintura loiro platinado',
  },
  { 
    id: 3, 
    date: new Date(2023, 5, 14, 14, 0), 
    clientId: 3,
    clientName: 'Ricardo Gomes',
    professionalId: 2,
    professionalName: 'João Costa',
    serviceId: 5,
    serviceName: 'Barba',
    duration: 30,
    status: 'pending',
    notes: '',
  },
];
