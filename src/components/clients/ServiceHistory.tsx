
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceHistoryItem } from '@/types/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ServiceHistoryProps {
  history: ServiceHistoryItem[];
  loading?: boolean;
}

export const ServiceHistory: React.FC<ServiceHistoryProps> = ({ history, loading = false }) => {
  // Function to format date nicely
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  // Function to render rating stars
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelado</Badge>;
      case 'no-show':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Não Compareceu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <CardTitle>Histórico de Serviços</CardTitle>
        <CardDescription>
          Registro de todos os serviços utilizados pelo cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando histórico de serviços...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="p-4 border border-white/10 rounded-md bg-white/5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{item.serviceName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.date)} • {item.professionalName}
                    </p>
                    {renderRating(item.rating)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xl font-bold">
                      R$ {item.price.toFixed(2)}
                    </div>
                    <div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
                
                {item.feedback && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-sm">
                      <span className="font-medium">Feedback:</span> {item.feedback}
                    </p>
                  </div>
                )}
                
                {(item.pointsEarned || item.stampsEarned) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {item.pointsEarned && <span className="mr-3">+{item.pointsEarned} pontos</span>}
                    {item.stampsEarned && <span>+{item.stampsEarned} selo</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum serviço encontrado para este cliente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
