
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Client, LoyaltyData, ServiceHistoryItem } from '@/types/client';
import { Heart, Award, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LoyaltySystemProps {
  client: Client;
  serviceHistory: ServiceHistoryItem[];
}

export const LoyaltySystem: React.FC<LoyaltySystemProps> = ({ client, serviceHistory }) => {
  const [isRewardsDialogOpen, setIsRewardsDialogOpen] = useState(false);
  
  const loyalty = client.loyalty || {
    points: 0,
    totalSpent: 0,
    visits: 0,
    stamps: 0
  };
  
  // Calcular pontos necessários para o próximo nível
  const pointsForNextLevel = 100;
  const progress = Math.min(100, (loyalty.points / pointsForNextLevel) * 100);
  
  // Calcular selos preenchidos (para sistema de carimbo virtual)
  const totalStamps = 10; // Total de selos necessários para um resgate
  const filledStamps = loyalty.stamps % totalStamps;
  const completedCards = Math.floor(loyalty.stamps / totalStamps);
  
  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Programa de Fidelidade
        </CardTitle>
        <CardDescription>
          Acompanhe o progresso do cliente no programa de fidelidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Visitas</div>
              <div className="text-2xl font-bold">{loyalty.visits}</div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Pontos</div>
              <div className="text-2xl font-bold">{loyalty.points}</div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Total Gasto</div>
              <div className="text-2xl font-bold">R$ {loyalty.totalSpent.toFixed(2)}</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">Progresso</div>
              <div className="text-sm text-muted-foreground">
                {loyalty.points} / {pointsForNextLevel} pontos
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {pointsForNextLevel - loyalty.points} pontos para o próximo benefício
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Cartão de Selos</div>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(totalStamps)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-full border ${
                    i < filledStamps
                      ? "bg-primary/20 border-primary"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  {i < filledStamps && <Heart className="h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
            {completedCards > 0 && (
              <div className="text-xs">
                <span className="text-primary font-medium">{completedCards}</span> cartões completos - 
                disponível para resgate!
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Complete 10 selos para ganhar um serviço gratuito
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              {loyalty.lastVisit && (
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Calendar className="h-3 w-3" />
                  Última visita: {format(new Date(loyalty.lastVisit), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              )}
            </div>
            
            <Dialog open={isRewardsDialogOpen} onOpenChange={setIsRewardsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">Ver Benefícios</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Benefícios Disponíveis</DialogTitle>
                  <DialogDescription>
                    Benefícios que o cliente pode resgatar com seus pontos e selos
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  {completedCards > 0 ? (
                    <div className="bg-primary/10 border border-primary/30 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Prêmio Disponível!</h3>
                      </div>
                      <p className="text-sm">
                        {completedCards} serviço(s) gratuito(s) disponível(is) para resgate.
                      </p>
                      <Button size="sm" className="mt-2">Resgatar Agora</Button>
                    </div>
                  ) : (
                    <div className="bg-white/5 p-4 rounded-md">
                      <p className="text-sm">Ainda não há benefícios disponíveis para resgate.</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Benefícios por Pontos</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-md bg-white/5">
                        <div className="text-sm">Desconto de 10%</div>
                        <Badge variant="outline">50 pontos</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md bg-white/5">
                        <div className="text-sm">Desconto de 20%</div>
                        <Badge variant="outline">100 pontos</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md bg-white/5">
                        <div className="text-sm">Serviço Gratuito</div>
                        <Badge variant="outline">200 pontos</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
