
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScheduleFilters } from '@/components/schedule/ScheduleFilters';
import { ScheduleCalendarView } from '@/components/schedule/ScheduleCalendarView';
import { ScheduleListView } from '@/components/schedule/ScheduleListView';

interface ScheduleContentProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedProfessional: string | undefined;
  setSelectedProfessional: (id: string | undefined) => void;
  selectedStatus: string | undefined;
  setSelectedStatus: (status: string | undefined) => void;
  filteredAppointments: any[];
  professionals: any[];
}

export const ScheduleContent = ({
  selectedDate,
  setSelectedDate,
  selectedProfessional,
  setSelectedProfessional,
  selectedStatus,
  setSelectedStatus,
  filteredAppointments,
  professionals
}: ScheduleContentProps) => {
  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
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
            
            <ScheduleFilters
              selectedProfessional={selectedProfessional}
              setSelectedProfessional={setSelectedProfessional}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              professionals={professionals}
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar agendamentos..."
              className="pl-10 w-full sm:w-[240px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto pb-6">
        <div className="space-y-6">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <ScheduleCalendarView 
                professionals={professionals}
                filteredAppointments={filteredAppointments}
                selectedProfessional={selectedProfessional}
              />
            </TabsContent>
            
            <TabsContent value="list">
              <ScheduleListView 
                filteredAppointments={filteredAppointments}
                professionals={professionals}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
