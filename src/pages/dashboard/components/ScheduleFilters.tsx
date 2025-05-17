
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { mockProfessionals } from '../data/mockData';

interface ScheduleFiltersProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedProfessional: string | undefined;
  setSelectedProfessional: (id: string | undefined) => void;
  selectedStatus: string | undefined;
  setSelectedStatus: (status: string | undefined) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ScheduleFilters({
  selectedDate,
  setSelectedDate,
  selectedProfessional,
  setSelectedProfessional,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery
}: ScheduleFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center w-[240px]">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(selectedDate, "PPP", { locale: ptBR })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background/90 backdrop-blur-sm border border-white/20" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Todos os profissionais" />
          </SelectTrigger>
          <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
            <SelectItem value={undefined}>Todos os profissionais</SelectItem>
            {mockProfessionals.map(professional => (
              <SelectItem key={professional.id} value={professional.id.toString()}>
                {professional.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent className="bg-background/80 backdrop-blur-sm border border-white/20">
            <SelectItem value={undefined}>Todos os status</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar agendamentos..."
          className="pl-10 w-full sm:w-[240px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
