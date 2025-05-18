
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  bio: string;
  defaultCommission: number;
  schedule: Record<string, any>;
  services: string[];
}

interface ProfessionalListProps {
  professionals: Professional[];
  onEdit: (professional: Professional) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
}

export const ProfessionalList: React.FC<ProfessionalListProps> = ({ 
  professionals, 
  onEdit, 
  onDelete,
  onSelect
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCardClick = (professional: Professional) => {
    if (onSelect) {
      onSelect(professional.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {professionals.map((professional) => (
        <Card 
          key={professional.id} 
          className="relative overflow-hidden hover:shadow-md transition-all bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer"
          onClick={() => handleCardClick(professional)}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={professional.photo} alt={professional.name} />
                <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{professional.name}</h3>
              <p className="text-muted-foreground">{professional.specialty}</p>
            </div>
            
            <p className="text-sm mb-4 line-clamp-3">{professional.bio}</p>
            
            <div className="text-sm mb-4">
              <span className="font-semibold">Comissão padrão:</span> {professional.defaultCommission}%
            </div>
            
            <div className="flex justify-center space-x-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(professional);
                }}
              >
                <Pencil className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(professional.id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
