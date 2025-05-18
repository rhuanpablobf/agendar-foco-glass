
import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Client } from '@/types/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClientForm } from './ClientForm';
import { ClientFormData } from '@/types/client';
import { toast } from 'sonner';

interface ClientListProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  onClientCreate?: (data: ClientFormData) => void;
  onClientClick?: (client: Client) => void;
}

export const ClientList = ({ 
  clients, 
  onClientSelect, 
  onClientCreate,
  onClientClick
}: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query) ||
      (client.email && client.email.toLowerCase().includes(query))
    );
  });

  const handleCreateClient = (data: ClientFormData) => {
    if (onClientCreate) {
      onClientCreate(data);
    }
    setShowAddClientDialog(false);
    toast.success("Cliente cadastrado com sucesso!");
  };

  const handleClientClick = (client: Client) => {
    if (onClientClick) {
      onClientClick(client);
    } else if (onClientSelect) {
      onClientSelect(client);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
              <DialogDescription>
                Cadastre um novo cliente para sua empresa
              </DialogDescription>
            </DialogHeader>
            
            <ClientForm onSubmit={handleCreateClient} buttonText="Cadastrar" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        {filteredClients.length > 0 ? (
          <div className="divide-y">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => handleClientClick(client)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {client.phone} {client.email ? `• ${client.email}` : ''}
                    </div>
                  </div>
                  {client.loyalty && (
                    <div className="text-right">
                      <div className="text-sm text-amber-400">
                        {client.loyalty.points} pontos
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {client.loyalty.visits} visitas
                      </div>
                    </div>
                  )}
                  {client.client_loyalty && (
                    <div className="text-right">
                      <div className="text-sm text-amber-400">
                        {client.client_loyalty.points} pontos
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {client.client_loyalty.visits} visitas
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </p>
            {searchQuery && (
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Limpar busca
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
