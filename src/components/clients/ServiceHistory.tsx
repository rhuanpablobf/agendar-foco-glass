
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceHistoryItem } from '@/types/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star, DollarSign, Calendar } from 'lucide-react';

interface ServiceHistoryProps {
  history: ServiceHistoryItem[];
}

export const ServiceHistory: React.FC<ServiceHistoryProps> = ({ history }) => {
  // Ordenar por data mais recente primeiro
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const renderStatusBadge = (status: ServiceHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/30">Concluído</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/30">Cancelado</Badge>;
      case 'no-show':
        return <Badge className="bg-amber-500/30">Não compareceu</Badge>;
      default:
        return null;
    }
  };
  
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Histórico de Serviços
        </CardTitle>
        <CardDescription>
          Serviços realizados pelo cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Este cliente ainda não realizou nenhum serviço
          </div>
        ) : (
          <div className="space-y-4">
            {sortedHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-md bg-white/5 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <div className="font-medium">{item.serviceName}</div>
                    <div className="text-sm text-muted-foreground">
                      com {item.professionalName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(item.status)}
                    <span className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-col sm:flex-row justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(item.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                  {renderRating(item.rating)}
                </div>
                
                {item.feedback && (
                  <div className="mt-2 text-xs italic text-muted-foreground border-t border-white/10 pt-2">
                    "{item.feedback}"
                  </div>
                )}
                
                {(item.pointsEarned || item.stampsEarned) && (
                  <div className="mt-2 flex gap-2 items-center text-xs text-primary-foreground">
                    {item.pointsEarned && (
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        +{item.pointsEarned} pontos
                      </Badge>
                    )}
                    {item.stampsEarned && (
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        +{item.stampsEarned} selos
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
