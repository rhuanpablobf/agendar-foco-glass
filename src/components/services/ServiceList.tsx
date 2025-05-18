
import React from 'react';
import { Service, ServiceCategory } from '@/types/service';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Clock, DollarSign, Tag, Disc, Disc2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onFilter: (category: ServiceCategory | 'all') => void;
  activeFilter: ServiceCategory | 'all';
}

const getCategoryLabel = (category: ServiceCategory): string => {
  const categories: Record<ServiceCategory, string> = {
    hair: 'Cabelo',
    nails: 'Unhas',
    skincare: 'Skincare',
    makeup: 'Maquiagem',
    other: 'Outro',
    combo: 'Combo'
  };
  return categories[category];
};

export const ServiceList = ({ 
  services, 
  onEdit, 
  onToggleActive,
  onFilter,
  activeFilter,
  onDelete
}: ServiceListProps) => {
  const filterOptions: Array<{ value: ServiceCategory | 'all'; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'hair', label: 'Cabelo' },
    { value: 'nails', label: 'Unhas' },
    { value: 'skincare', label: 'Skincare' },
    { value: 'makeup', label: 'Maquiagem' },
    { value: 'other', label: 'Outro' },
    { value: 'combo', label: 'Combos' }
  ];

  const handleToggleActive = (service: Service) => {
    const newStatus = !service.isActive;
    onToggleActive(service.id, newStatus);
    
    toast.success(
      newStatus 
        ? `Serviço "${service.name}" ativado com sucesso` 
        : `Serviço "${service.name}" desativado com sucesso`
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(option => (
          <Button 
            key={option.value}
            variant={activeFilter === option.value ? "default" : "outline"} 
            size="sm"
            onClick={() => onFilter(option.value)}
          >
            {option.value !== 'all' && <Tag className="mr-1 h-3 w-3" />}
            {option.label}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Tipo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Duração</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="w-24 text-center">Ativo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum serviço encontrado.
                </TableCell>
              </TableRow>
            ) : (
              services.map(service => (
                <TableRow key={service.id}>
                  <TableCell>
                    {service.isCombo 
                      ? <Disc2 className="h-4 w-4 text-primary" /> 
                      : <Disc className="h-4 w-4 text-primary" />}
                  </TableCell>
                  <TableCell className="font-medium">
                    {service.name}
                    {!service.isActive && (
                      <Badge variant="outline" className="ml-2 text-xs">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {getCategoryLabel(service.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration} min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>R$ {service.price.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={service.isActive}
                      onCheckedChange={() => handleToggleActive(service)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(service)}
                      title="Editar serviço"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
