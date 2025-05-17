
import React from 'react';
import { cn } from '@/lib/utils';
import { mockProfessionals, timeSlots } from '../data/mockData';
import { Appointment } from '../types/schedule';

interface ScheduleCalendarViewProps {
  filteredAppointments: Appointment[];
  selectedProfessional?: string;
}

export function ScheduleCalendarView({ filteredAppointments, selectedProfessional }: ScheduleCalendarViewProps) {
  // Ensure arrays are valid
  const safeAppointments = Array.isArray(filteredAppointments) ? filteredAppointments : [];
  const safeProfessionals = Array.isArray(mockProfessionals) ? mockProfessionals : [];
  const safeTimeSlots = Array.isArray(timeSlots) ? timeSlots : [];
  
  // Renderizar as células de horário para cada profissional
  const renderTimeSlots = (professional: typeof safeProfessionals[0]) => {
    return (
      <div className="grid grid-cols-24 gap-1">
        {safeTimeSlots.map((time) => {
          const appointment = safeAppointments.find(
            app => app.professionalId === professional.id && app.startTime === time
          );

          return (
            <div 
              key={`${professional.id}-${time}`} 
              className={cn(
                "h-16 rounded-md relative flex items-center justify-center transition-all",
                appointment 
                  ? appointment.status === "confirmado"
                    ? "bg-green-500/20 border border-green-500/30" 
                    : "bg-amber-500/20 border border-amber-500/30"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              )}
              style={{
                gridColumn: `span ${appointment?.serviceId === 2 ? 4 : 1} / span ${appointment?.serviceId === 2 ? 4 : 1}`,
              }}
            >
              {appointment ? (
                <div className="p-2 w-full h-full flex flex-col justify-between overflow-hidden">
                  <div className="font-medium text-sm truncate">{appointment.clientName}</div>
                  <div className="text-xs text-muted-foreground truncate">{appointment.serviceName}</div>
                  <div className="text-xs mt-1">{appointment.startTime} - {appointment.endTime}</div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">{time}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (selectedProfessional) {
    // Se um profissional específico está selecionado, mostra apenas ele
    const professional = safeProfessionals.find(p => p.id.toString() === selectedProfessional);
    if (!professional) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 border-b border-white/10">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img 
              src={professional.photo || ''}
              alt="Profissional" 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{professional.name}</div>
            <div className="text-xs text-muted-foreground">{professional.specialty}</div>
          </div>
        </div>
        
        <div className="overflow-auto">
          {renderTimeSlots(professional)}
        </div>
      </div>
    );
  }

  // Se nenhum profissional específico está selecionado, mostra todos
  return (
    <>
      {safeProfessionals.map(professional => (
        <div key={professional.id} className="space-y-4">
          <div className="flex items-center gap-3 p-3 border-b border-white/10">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img src={professional.photo || ''} alt={professional.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-medium">{professional.name}</div>
              <div className="text-xs text-muted-foreground">{professional.specialty}</div>
            </div>
          </div>
          
          <div className="overflow-auto">
            {renderTimeSlots(professional)}
          </div>
        </div>
      ))}
    </>
  );
}
