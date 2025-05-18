
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  isWorking: boolean;
  timeSlots: TimeSlot[];
  breakTime?: TimeSlot;
}

type WeekSchedule = {
  [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: DaySchedule;
};

interface WeeklyScheduleProps {
  professionalId: string;
  onSave: (schedule: WeekSchedule) => void;
  initialSchedule?: WeekSchedule;
}

const defaultTimeSlot: TimeSlot = { start: '09:00', end: '18:00' };
const defaultBreakTime: TimeSlot = { start: '12:00', end: '13:00' };

const defaultDaySchedule: DaySchedule = {
  isWorking: true,
  timeSlots: [{ ...defaultTimeSlot }],
  breakTime: { ...defaultBreakTime }
};

const defaultSchedule: WeekSchedule = {
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { ...defaultDaySchedule },
  saturday: { isWorking: false, timeSlots: [{ ...defaultTimeSlot }] },
  sunday: { isWorking: false, timeSlots: [{ ...defaultTimeSlot }] }
};

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
] as const;

const timeOptions = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ professionalId, onSave, initialSchedule }) => {
  const [schedule, setSchedule] = useState<WeekSchedule>(initialSchedule || defaultSchedule);
  
  const handleToggleWorkDay = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking
      }
    }));
  };

  const handleTimeChange = (
    day: keyof WeekSchedule, 
    slotIndex: number, 
    field: 'start' | 'end', 
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, idx) => 
          idx === slotIndex 
            ? { ...slot, [field]: value }
            : slot
        )
      }
    }));
  };

  const handleBreakTimeChange = (
    day: keyof WeekSchedule,
    field: 'start' | 'end',
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        breakTime: {
          ...prev[day].breakTime!,
          [field]: value
        }
      }
    }));
  };

  const copyToWorkdays = () => {
    const workdayTemplate = { ...schedule.monday };
    
    setSchedule(prev => ({
      ...prev,
      tuesday: { ...workdayTemplate },
      wednesday: { ...workdayTemplate },
      thursday: { ...workdayTemplate },
      friday: { ...workdayTemplate },
    }));
    
    toast.success('Horário copiado para todos os dias úteis');
  };

  const handleSaveSchedule = () => {
    onSave(schedule);
    toast.success('Horários salvos com sucesso');
  };

  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Configuração de Horários</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToWorkdays}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copiar para dias úteis</span>
              <span className="sm:hidden">Copiar</span>
            </Button>
            <Button onClick={handleSaveSchedule}>Salvar Horários</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {daysOfWeek.map(({ key, label }) => (
            <div key={key} className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`working-${key}`}
                    checked={schedule[key].isWorking}
                    onCheckedChange={() => handleToggleWorkDay(key)}
                  />
                  <Label htmlFor={`working-${key}`} className="text-base font-medium">
                    {label}
                  </Label>
                </div>
                <div className="text-xs text-muted-foreground">
                  {schedule[key].isWorking ? 'Trabalhando' : 'Folga'}
                </div>
              </div>

              {schedule[key].isWorking && (
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-2">Horário de Trabalho</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={schedule[key].timeSlots[0].start}
                        onValueChange={(value) => handleTimeChange(key, 0, 'start', value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Início" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span>até</span>
                      <Select
                        value={schedule[key].timeSlots[0].end}
                        onValueChange={(value) => handleTimeChange(key, 0, 'end', value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Fim" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="block mb-2">Horário de Almoço/Intervalo</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={schedule[key].breakTime?.start || '12:00'}
                        onValueChange={(value) => handleBreakTimeChange(key, 'start', value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Início" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span>até</span>
                      <Select
                        value={schedule[key].breakTime?.end || '13:00'}
                        onValueChange={(value) => handleBreakTimeChange(key, 'end', value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Fim" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
