
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Utensils } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface ScheduleDay {
  active: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
  breakEnabled?: boolean;
}

interface Schedule {
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
}

interface ScheduleConfigProps {
  schedule: Schedule;
  onChange: (day: string, field: string, value: string | boolean) => void;
  onCopyWeekdays: () => void;
}

export const ScheduleConfig: React.FC<ScheduleConfigProps> = ({
  schedule,
  onChange,
  onCopyWeekdays
}) => {
  const days = [
    { name: 'monday', label: 'Segunda-feira' },
    { name: 'tuesday', label: 'Terça-feira' },
    { name: 'wednesday', label: 'Quarta-feira' },
    { name: 'thursday', label: 'Quinta-feira' },
    { name: 'friday', label: 'Sexta-feira' },
    { name: 'saturday', label: 'Sábado' },
    { name: 'sunday', label: 'Domingo' }
  ];

  // Inicializar o estado "breakEnabled" como true para cada dia, se não estiver definido
  React.useEffect(() => {
    days.forEach((day) => {
      if (schedule[day.name].breakEnabled === undefined) {
        onChange(day.name, 'breakEnabled', true);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCopyWeekdays}
          className="flex items-center"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar horário de Segunda para dias úteis
        </Button>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day.name} className="p-4 border rounded-md bg-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Switch
                  id={`${day.name}-active`}
                  checked={schedule[day.name].active}
                  onCheckedChange={(checked) => onChange(day.name, 'active', checked)}
                />
                <Label htmlFor={`${day.name}-active`} className="ml-2 font-medium">
                  {day.label}
                </Label>
              </div>
              <div className="text-sm text-muted-foreground">
                {schedule[day.name].active ? 'Disponível' : 'Indisponível'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2">Horário de Trabalho</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${day.name}-start`} className="text-xs">Início</Label>
                    <Input
                      id={`${day.name}-start`}
                      type="time"
                      value={schedule[day.name].start}
                      onChange={(e) => onChange(day.name, 'start', e.target.value)}
                      disabled={!schedule[day.name].active}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${day.name}-end`} className="text-xs">Fim</Label>
                    <Input
                      id={`${day.name}-end`}
                      type="time"
                      value={schedule[day.name].end}
                      onChange={(e) => onChange(day.name, 'end', e.target.value)}
                      disabled={!schedule[day.name].active}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Utensils className="h-4 w-4 mr-1" />
                    <h4 className="text-sm font-medium">Intervalo / Almoço</h4>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id={`${day.name}-break-enabled`}
                      checked={schedule[day.name].breakEnabled !== false}
                      onCheckedChange={(checked) => onChange(day.name, 'breakEnabled', checked)}
                      disabled={!schedule[day.name].active}
                      className={schedule[day.name].breakEnabled !== false ? "bg-green-500 hover:bg-green-600" : ""}
                    />
                    <Label htmlFor={`${day.name}-break-enabled`} className="ml-2 text-xs">
                      {schedule[day.name].breakEnabled !== false ? 'Ativado' : 'Desativado'}
                    </Label>
                  </div>
                </div>

                {schedule[day.name].breakEnabled !== false && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${day.name}-break-start`} className="text-xs">Início</Label>
                      <Input
                        id={`${day.name}-break-start`}
                        type="time"
                        value={schedule[day.name].breakStart}
                        onChange={(e) => onChange(day.name, 'breakStart', e.target.value)}
                        disabled={!schedule[day.name].active}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${day.name}-break-end`} className="text-xs">Fim</Label>
                      <Input
                        id={`${day.name}-break-end`}
                        type="time"
                        value={schedule[day.name].breakEnd}
                        onChange={(e) => onChange(day.name, 'breakEnd', e.target.value)}
                        disabled={!schedule[day.name].active}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
