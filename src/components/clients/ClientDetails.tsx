import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client, ServiceHistoryItem } from '@/types/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Award,
  BadgePercent,
  Star,
  StarHalf,
  StarOff,
  FileText,
  UserRound,
} from 'lucide-react';

interface ClientDetailsProps {
  client: Client;
  serviceHistory: ServiceHistoryItem[];
  onUpdateNotes: (notes: string) => void; // Modified to only accept notes
  onAddLoyaltyPoints: (points: number) => void; // Modified to only accept points
  onAddStamp: () => void; // Modified to accept no parameters
}

export const ClientDetails = ({ 
  client, 
  serviceHistory,
  onUpdateNotes,
  onAddLoyaltyPoints,
  onAddStamp 
}: ClientDetailsProps) => {
  const [notes, setNotes] = React.useState(client.notes || "");

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    toast.success("Observações salvas com sucesso");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 rounded-full p-3">
            <UserRound className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <div className="text-muted-foreground flex flex-wrap gap-x-3">
              <span>{client.phone}</span>
              {client.email && <span>{client.email}</span>}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="loyalty">Fidelidade</TabsTrigger>
          <TabsTrigger value="notes">Observações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4 pt-4">
          {serviceHistory.length > 0 ? (
            serviceHistory.map((item) => (
              <Card key={item.id} className="bg-white/5">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{item.serviceName}</CardTitle>
                    <Badge
                      variant={
                        item.status === 'completed'
                          ? 'default'
                          : item.status === 'cancelled'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {item.status === 'completed'
                        ? 'Concluído'
                        : item.status === 'cancelled'
                        ? 'Cancelado'
                        : 'Não compareceu'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {format(item.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Profissional: {item.professionalName}</p>
                  <p className="text-sm">Valor: R$ {item.price.toFixed(2)}</p>
                  {item.rating && (
                    <div className="flex items-center mt-2">
                      <span className="mr-2 text-sm">Avaliação:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400">
                            {star <= item.rating! ? (
                              <Star className="h-4 w-4" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.feedback && (
                    <div className="mt-2 text-sm italic">
                      "{item.feedback}"
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Este cliente ainda não possui histórico de serviços.
            </div>
          )}
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-amber-400" />
                  Pontos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-400">
                  {client.loyalty?.points || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  pontos acumulados
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAddLoyaltyPoints(10)}
                >
                  Adicionar pontos (+10)
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgePercent className="mr-2 h-5 w-5 text-green-400" />
                  Selos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        i < (client.loyalty?.stamps || 0)
                          ? 'bg-primary border-primary/50'
                          : 'bg-transparent border-primary/20'
                      }`}
                    >
                      {i < (client.loyalty?.stamps || 0) && (
                        <Star className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {client.loyalty?.stamps || 0}/10 selos - {(client.loyalty?.stamps || 0) >= 10 ? 'Prêmio disponível!' : 'Colete 10 para um serviço grátis'}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAddStamp()}
                  disabled={(client.loyalty?.stamps || 0) >= 10}
                >
                  Adicionar selo
                </Button>
                {(client.loyalty?.stamps || 0) >= 10 && (
                  <Button 
                    size="sm"
                    className="ml-2"
                    onClick={() => toast.success("Prêmio resgatado com sucesso!")}
                  >
                    Resgatar prêmio
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card className="bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total gasto:</span>
                  <span>R$ {client.loyalty?.totalSpent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visitas:</span>
                  <span>{client.loyalty?.visits || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última visita:</span>
                  <span>
                    {client.loyalty?.lastVisit
                      ? format(client.loyalty.lastVisit, "dd/MM/yyyy")
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white/5">
            <CardHeader>
              <CardTitle>Regras de Fidelidade</CardTitle>
              <CardDescription>
                Como funciona nosso programa de fidelidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Pontos</h4>
                <p className="text-sm text-muted-foreground">
                  Ganhe 1 ponto para cada R$ 10,00 gastos em serviços. Acumule pontos para trocar por descontos.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Cartão de Selos</h4>
                <p className="text-sm text-muted-foreground">
                  A cada serviço realizado, ganhe 1 selo. Ao completar 10 selos, ganhe um serviço gratuito.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4 pt-4">
          <Card className="bg-white/5">
            <CardHeader>
              <CardTitle>Observações e Preferências</CardTitle>
              <CardDescription>
                Adicione notas e preferências do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="notes" className="text-sm font-medium mb-1 block">
                  Observações
                </label>
                <Textarea
                  id="notes"
                  placeholder="Adicione observações sobre o cliente..."
                  className="resize-none min-h-[150px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotes}>Salvar observações</Button>
              </div>
              
              {client.preferences && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Preferências</h4>
                  
                  {client.preferences.communicationPreference && (
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-muted-foreground w-1/3">
                        Comunicação:
                      </span>
                      <Badge variant="outline">
                        {client.preferences.communicationPreference === 'email' ? 'Email' :
                         client.preferences.communicationPreference === 'phone' ? 'Telefone' : 'WhatsApp'}
                      </Badge>
                    </div>
                  )}
                  
                  {client.preferences.preferredProfessionals?.length > 0 && (
                    <div className="flex items-start mb-2">
                      <span className="text-sm text-muted-foreground w-1/3">
                        Profissionais:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {client.preferences.preferredProfessionals.map((prof, i) => (
                          <Badge key={i} variant="outline">{prof}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {client.preferences.preferredServices?.length > 0 && (
                    <div className="flex items-start">
                      <span className="text-sm text-muted-foreground w-1/3">
                        Serviços:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {client.preferences.preferredServices.map((svc, i) => (
                          <Badge key={i} variant="outline">{svc}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
