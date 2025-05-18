
import React, { useState, useEffect } from 'react';
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
import { fetchClients, createClient, fetchClientServiceHistory, updateClientNotes, addLoyaltyPoints, addLoyaltyStamp } from '@/services/clientService';
import { useAuthStatus } from '@/hooks/useAuthStatus';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);
  const [serviceHistoryLoading, setServiceHistoryLoading] = useState(false);
  
  // Check authentication status
  const { checkAuth } = useAuthStatus();

  // Load clients when the component mounts
  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      // Check if user is authenticated
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      const clientsData = await fetchClients();
      setClients(clientsData);
      setLoading(false);
    };

    loadClients();
  }, []);

  // Load client service history when a client is selected
  useEffect(() => {
    if (selectedClient) {
      const loadServiceHistory = async () => {
        setServiceHistoryLoading(true);
        const history = await fetchClientServiceHistory(selectedClient.id);
        setServiceHistory(history);
        setServiceHistoryLoading(false);
      };

      loadServiceHistory();
    }
  }, [selectedClient]);
  
  // Filter clients based on search term
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
    // Refresh client list to get any updates
    fetchClients().then(data => setClients(data));
  };
  
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleAddClient = async (clientData: ClientFormData) => {
    const newClient = await createClient(clientData);
    if (newClient) {
      setClients(prevClients => [...prevClients, newClient]);
      setIsFormOpen(false);
    }
  };
  
  const handleUpdateNotes = async (clientId: string, notes: string) => {
    if (selectedClient) {
      const success = await updateClientNotes(clientId, notes);
      if (success) {
        setSelectedClient({
          ...selectedClient,
          notes
        });
      }
    }
  };
  
  const handleAddLoyaltyPoints = async (clientId: string, points: number) => {
    if (selectedClient && selectedClient.loyalty) {
      const success = await addLoyaltyPoints(clientId, points);
      if (success) {
        const updatedLoyalty = { 
          ...selectedClient.loyalty, 
          points: selectedClient.loyalty.points + points 
        };
        
        setSelectedClient({
          ...selectedClient,
          loyalty: updatedLoyalty
        });
      }
    }
  };
  
  const handleAddStamp = async (clientId: string) => {
    if (selectedClient && selectedClient.loyalty) {
      const success = await addLoyaltyStamp(clientId);
      if (success) {
        const updatedLoyalty = { 
          ...selectedClient.loyalty, 
          stamps: selectedClient.loyalty.stamps + 1 
        };
        
        setSelectedClient({
          ...selectedClient,
          loyalty: updatedLoyalty
        });
      }
    }
  };
  
  return (
    <MainLayout userType="company">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando clientes...</p>
        </div>
      ) : selectedClient ? (
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
                serviceHistory={serviceHistory}
                onUpdateNotes={(notes) => handleUpdateNotes(selectedClient.id, notes)}
                onAddLoyaltyPoints={(points) => handleAddLoyaltyPoints(selectedClient.id, points)}
                onAddStamp={() => handleAddStamp(selectedClient.id)}
              />
              <LoyaltySystem 
                client={selectedClient} 
                serviceHistory={serviceHistory} 
              />
            </div>
            
            <div className="lg:col-span-3">
              <ServiceHistory 
                history={serviceHistory} 
                loading={serviceHistoryLoading} 
              />
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
          
          {filteredClients.length > 0 ? (
            <ClientList 
              clients={filteredClients} 
              onClientSelect={handleClientClick}
              onClientCreate={handleAddClient}
              onClientClick={handleClientClick}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado com estes critérios." : "Nenhum cliente cadastrado ainda."}
              </p>
              {searchTerm && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Limpar busca
                </Button>
              )}
            </div>
          )}
          
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
