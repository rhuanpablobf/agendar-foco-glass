
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
}

interface ScheduleFiltersProps {
  selectedProfessional: string | undefined;
  setSelectedProfessional: (value: string | undefined) => void;
  selectedStatus: string | undefined;
  setSelectedStatus: (value: string | undefined) => void;
  professionals: Professional[];
}

export const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  selectedProfessional,
  setSelectedProfessional,
  selectedStatus,
  setSelectedStatus,
  professionals
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
        <SelectTrigger className="w-[180px] bg-white/20">
          <SelectValue placeholder="Profissional" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os profissionais</SelectItem>
          {professionals.map(professional => (
            <SelectItem key={professional.id} value={professional.id.toString()}>
              {professional.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px] bg-white/20">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value="confirmed">Confirmados</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="cancelled">Cancelados</SelectItem>
          <SelectItem value="completed">Concluídos</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="gap-2" onClick={() => {
        setSelectedProfessional(undefined);
        setSelectedStatus(undefined);
      }}>
        <Filter className="h-4 w-4" />
        Limpar Filtros
      </Button>
    </div>
  );
};
