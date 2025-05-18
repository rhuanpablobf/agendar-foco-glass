
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ClientList } from '@/components/clients/ClientList';
import { ClientDetails } from '@/components/clients/ClientDetails';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Client, ServiceHistoryItem, ClientFormData } from '@/types/client';
import { ServiceHistory } from '@/components/clients/ServiceHistory';
import { LoyaltySystem } from '@/components/clients/LoyaltySystem';
import { toast } from 'sonner';

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '(11) 98765-4321',
    createdAt: new Date('2023-01-15'),
    notes: 'Preferência por produtos sem sulfato',
    preferences: {
      communicationPreference: 'whatsapp',
      preferredProfessionals: ['1'],
      preferredServices: ['1', '4']
    },
    loyalty: {
      points: 75,
      totalSpent: 620,
      visits: 8,
      stamps: 6,
      lastVisit: new Date('2023-05-10')
    }
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@example.com',
    phone: '(11) 91234-5678',
    createdAt: new Date('2023-02-20'),
    loyalty: {
      points: 30,
      totalSpent: 250,
      visits: 3,
      stamps: 2,
      lastVisit: new Date('2023-04-25')
    }
  },
  {
    id: '3',
    name: 'Marina Santos',
    email: 'marina.santos@example.com',
    phone: '(11) 99876-5432',
    createdAt: new Date('2023-03-05'),
    loyalty: {
      points: 120,
      totalSpent: 980,
      visits: 12,
      stamps: 11,
      lastVisit: new Date('2023-05-18')
    }
  },
];

// Mock service history
const mockServiceHistory: Record<string, ServiceHistoryItem[]> = {
  '1': [
    {
      id: '101',
      serviceId: '1',
      serviceName: 'Corte de Cabelo Feminino',
      professionalId: '1',
      professionalName: 'Ana Silva',
      date: new Date('2023-05-10'),
      price: 80,
      status: 'completed',
      rating: 5,
      feedback: 'Adorei o corte, ficou exatamente como eu queria!',
      pointsEarned: 8,
      stampsEarned: 1
    },
    {
      id: '102',
      serviceId: '4',
      serviceName: 'Escova',
      professionalId: '1',
      professionalName: 'Ana Silva',
      date: new Date('2023-04-20'),
      price: 60,
      status: 'completed',
      rating: 4,
      pointsEarned: 6
    },
    {
      id: '103',
      serviceId: '1',
      serviceName: 'Corte de Cabelo Feminino',
      professionalId: '1',
      professionalName: 'Ana Silva',
      date: new Date('2023-03-15'),
      price: 80,
      status: 'completed',
      pointsEarned: 8,
      stampsEarned: 1
    }
  ],
  '2': [
    {
      id: '201',
      serviceId: '6',
      serviceName: 'Maquiagem',
      professionalId: '1',
      professionalName: 'Ana Silva',
      date: new Date('2023-04-25'),
      price: 120,
      status: 'completed',
      rating: 5,
      pointsEarned: 12,
      stampsEarned: 1
    },
    {
      id: '202',
      serviceId: '2',
      serviceName: 'Manicure',
      professionalId: '1',
      professionalName: 'Ana Silva',
      date: new Date('2023-03-30'),
      price: 35,
      status: 'no-show',
    }
  ],
  '3': [
    {
      id: '301',
      serviceId: '1',
      serviceName: 'Corte de Cabelo Feminino',
      professionalId: '1',
      professionalName: 'Ana Silva',
      date: new Date('2023-05-18'),
      price: 80,
      status: 'completed',
      rating: 5,
      pointsEarned: 8,
      stampsEarned: 1
    },
    {
      id: '302',
      serviceId: '3',
      serviceName: 'Pedicure',
      professionalId: '2',
      professionalName: 'Carlos Oliveira',
      date: new Date('2023-05-10'),
      price: 45,
      status: 'completed',
      rating: 4,
      pointsEarned: 4
    },
    {
      id: '303',
      serviceId: '2',
      serviceName: 'Manicure',
      professionalId: '2',
      professionalName: 'Carlos Oliveira',
      date: new Date('2023-05-10'),
      price: 35,
      status: 'completed',
      rating: 4,
      pointsEarned: 3
    },
    {
      id: '304',
      serviceId: '6',
      serviceName: 'Maquiagem',
      professionalId: '1',
      professionalName: 'Ana Silva',
      date: new Date('2023-04-25'),
      price: 120,
      status: 'cancelled',
    }
  ]
};

const Clients = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );
  
  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
  };
  
  const handleBackToList = () => {
    setSelectedClient(null);
  };
  
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleAddClient = (clientData: ClientFormData) => {
    // Implement client addition logic here
    console.log("Adding new client:", clientData);
    toast.success("Cliente adicionado com sucesso!");
    setIsFormOpen(false);
  };
  
  const handleUpdateNotes = (clientId: string, notes: string) => {
    if (selectedClient) {
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, notes } 
            : client
        )
      );
      toast.success("Anotações atualizadas com sucesso!");
    }
  };
  
  const handleAddLoyaltyPoints = (clientId: string, points: number) => {
    if (selectedClient && selectedClient.loyalty) {
      const updatedLoyalty = { 
        ...selectedClient.loyalty, 
        points: selectedClient.loyalty.points + points 
      };
      
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, loyalty: updatedLoyalty } 
            : client
        )
      );
      
      toast.success(`${points} pontos adicionados com sucesso!`);
    }
  };
  
  const handleAddStamp = (clientId: string) => {
    if (selectedClient && selectedClient.loyalty) {
      const updatedLoyalty = { 
        ...selectedClient.loyalty, 
        stamps: selectedClient.loyalty.stamps + 1 
      };
      
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, loyalty: updatedLoyalty } 
            : client
        )
      );
      
      toast.success("Selo adicionado com sucesso!");
    }
  };
  
  return (
    <MainLayout userType="company">
      {selectedClient ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleBackToList}>
              Voltar para a lista
            </Button>
            <Button onClick={() => {}}>Editar Cliente</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ClientDetails 
                client={selectedClient} 
                serviceHistory={mockServiceHistory[selectedClient.id] || []}
                onUpdateNotes={(notes) => handleUpdateNotes(selectedClient.id, notes)}
                onAddLoyaltyPoints={(points: number) => {
                  handleAddLoyaltyPoints(selectedClient.id, points);
                }}
                onAddStamp={() => handleAddStamp(selectedClient.id)}
              />
              <LoyaltySystem 
                client={selectedClient} 
                serviceHistory={mockServiceHistory[selectedClient.id] || []} 
              />
            </div>
            
            <div className="lg:col-span-3">
              <ServiceHistory history={mockServiceHistory[selectedClient.id] || []} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Clientes</h1>
              <p className="text-muted-foreground">
                Gerencie os clientes do seu estabelecimento
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <Button onClick={handleOpenForm} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Novo Cliente
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ClientList 
            clients={filteredClients} 
            onClientSelect={handleClientClick}
            onClientCreate={handleAddClient}
            onClientClick={handleClientClick}
          />
          
          <ClientFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleAddClient}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Clients;
