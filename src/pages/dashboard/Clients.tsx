
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientList } from '@/components/clients/ClientList';
import { ClientDetails } from '@/components/clients/ClientDetails';
import { Client, ClientFormData, ServiceHistoryItem } from '@/types/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Mock data to simulate clients
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 98765-4321',
    createdAt: new Date('2023-01-15'),
    notes: 'Prefere atendimento à tarde. Cliente assídua.',
    preferences: {
      communicationPreference: 'whatsapp',
      preferredProfessionals: ['Ana Costa', 'Ricardo Santos'],
      preferredServices: ['Corte de Cabelo', 'Tintura']
    },
    loyalty: {
      points: 320,
      totalSpent: 1250.50,
      visits: 15,
      stamps: 7,
      lastVisit: new Date('2023-06-10')
    }
  },
  {
    id: '2',
    name: 'João Pereira',
    phone: '(11) 91234-5678',
    createdAt: new Date('2023-02-20'),
    loyalty: {
      points: 150,
      totalSpent: 450.00,
      visits: 6,
      stamps: 3,
      lastVisit: new Date('2023-05-22')
    }
  },
  {
    id: '3',
    name: 'Ana Carolina Santos',
    email: 'ana@email.com',
    phone: '(11) 99876-5432',
    createdAt: new Date('2023-03-05'),
    notes: 'Alérgica a produtos com amônia.',
    preferences: {
      communicationPreference: 'email',
    },
    loyalty: {
      points: 80,
      totalSpent: 320.00,
      visits: 4,
      stamps: 2,
      lastVisit: new Date('2023-06-01')
    }
  }
];

// Mock service history data
const mockServiceHistory: Record<string, ServiceHistoryItem[]> = {
  '1': [
    {
      id: 's1',
      serviceId: 'svc1',
      serviceName: 'Corte de Cabelo',
      professionalId: 'p1',
      professionalName: 'Ana Costa',
      date: new Date('2023-06-10'),
      price: 85.00,
      status: 'completed',
      rating: 5,
      feedback: 'Excelente atendimento, amei o resultado!',
      pointsEarned: 8,
      stampsEarned: 1
    },
    {
      id: 's2',
      serviceId: 'svc2',
      serviceName: 'Tintura',
      professionalId: 'p1',
      professionalName: 'Ana Costa',
      date: new Date('2023-05-15'),
      price: 150.00,
      status: 'completed',
      rating: 4,
      pointsEarned: 15,
      stampsEarned: 1
    },
    {
      id: 's3',
      serviceId: 'svc3',
      serviceName: 'Hidratação',
      professionalId: 'p3',
      professionalName: 'Ricardo Santos',
      date: new Date('2023-04-20'),
      price: 75.50,
      status: 'cancelled',
      pointsEarned: 0
    }
  ],
  '2': [
    {
      id: 's4',
      serviceId: 'svc4',
      serviceName: 'Barba',
      professionalId: 'p2',
      professionalName: 'Carlos Oliveira',
      date: new Date('2023-05-22'),
      price: 60.00,
      status: 'completed',
      rating: 5,
      pointsEarned: 6,
      stampsEarned: 1
    },
    {
      id: 's5',
      serviceId: 'svc1',
      serviceName: 'Corte de Cabelo',
      professionalId: 'p2',
      professionalName: 'Carlos Oliveira',
      date: new Date('2023-04-10'),
      price: 85.00,
      status: 'completed',
      rating: 3,
      feedback: 'Ficou bom, mas acho que poderia ter sido melhor.',
      pointsEarned: 8,
      stampsEarned: 1
    }
  ],
  '3': [
    {
      id: 's6',
      serviceId: 'svc5',
      serviceName: 'Manicure',
      professionalId: 'p4',
      professionalName: 'Mariana Costa',
      date: new Date('2023-06-01'),
      price: 65.00,
      status: 'completed',
      rating: 4,
      pointsEarned: 6,
      stampsEarned: 1
    },
    {
      id: 's7',
      serviceId: 'svc6',
      serviceName: 'Pedicure',
      professionalId: 'p4',
      professionalName: 'Mariana Costa',
      date: new Date('2023-05-01'),
      price: 75.00,
      status: 'no-show',
      pointsEarned: 0
    }
  ]
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setServiceHistory(mockServiceHistory[client.id] || []);
  };

  // Handle client creation
  const handleClientCreate = (data: ClientFormData) => {
    const newClient: Client = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      preferences: data.preferences,
      createdAt: new Date(),
      loyalty: {
        points: 0,
        totalSpent: 0,
        visits: 0,
        stamps: 0
      }
    };
    
    setClients([...clients, newClient]);
  };

  // Handle updating client notes
  const handleUpdateNotes = (clientId: string, notes: string) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, notes } 
        : client
    );
    
    setClients(updatedClients);
    
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({ ...selectedClient, notes });
    }
  };

  // Handle adding loyalty points
  const handleAddLoyaltyPoints = (clientId: string, points: number) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const currentLoyalty = client.loyalty || { points: 0, totalSpent: 0, visits: 0, stamps: 0 };
        
        return { 
          ...client, 
          loyalty: {
            ...currentLoyalty,
            points: (currentLoyalty.points || 0) + points
          }
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    
    if (selectedClient && selectedClient.id === clientId) {
      const currentLoyalty = selectedClient.loyalty || { points: 0, totalSpent: 0, visits: 0, stamps: 0 };
      
      setSelectedClient({
        ...selectedClient,
        loyalty: {
          ...currentLoyalty,
          points: (currentLoyalty.points || 0) + points
        }
      });
    }
    
    toast.success(`${points} pontos adicionados com sucesso!`);
  };

  // Handle adding a stamp
  const handleAddStamp = (clientId: string) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const currentLoyalty = client.loyalty || { points: 0, totalSpent: 0, visits: 0, stamps: 0 };
        const newStamps = Math.min((currentLoyalty.stamps || 0) + 1, 10); // Max 10 stamps
        
        return { 
          ...client, 
          loyalty: {
            ...currentLoyalty,
            stamps: newStamps
          }
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    
    if (selectedClient && selectedClient.id === clientId) {
      const currentLoyalty = selectedClient.loyalty || { points: 0, totalSpent: 0, visits: 0, stamps: 0 };
      const newStamps = Math.min((currentLoyalty.stamps || 0) + 1, 10);
      
      setSelectedClient({
        ...selectedClient,
        loyalty: {
          ...currentLoyalty,
          stamps: newStamps
        }
      });
      
      if (newStamps === 10) {
        toast.success("Cartão de fidelidade completo! Cliente elegível para prêmio.");
      } else {
        toast.success("Selo adicionado com sucesso!");
      }
    }
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie os clientes da sua empresa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Visualize e gerencie seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientList 
                clients={clients}
                onClientSelect={handleClientSelect}
                onClientCreate={handleClientCreate}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader>
              <CardTitle>Detalhes do Cliente</CardTitle>
              <CardDescription>
                Informações detalhadas, histórico e fidelidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                <ClientDetails
                  client={selectedClient}
                  serviceHistory={serviceHistory}
                  onUpdateNotes={handleUpdateNotes}
                  onAddLoyaltyPoints={handleAddLoyaltyPoints}
                  onAddStamp={handleAddStamp}
                />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  Selecione um cliente para visualizar seus detalhes
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Clients;
