
import React from 'react';
import { format, addHours, startOfDay, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Professional {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
}

interface Appointment {
  id: number;
  date: Date;
  clientId: number;
  clientName: string;
  professionalId: number;
  professionalName: string;
  serviceId: number;
  serviceName: string;
  duration: number;
  status: string;
  notes?: string;
}

interface ScheduleCalendarViewProps {
  professionals: Professional[];
  filteredAppointments: Appointment[];
  selectedProfessional: string | undefined;
}

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  professionals,
  filteredAppointments,
  selectedProfessional
}) => {
  // Generate time slots from 8:00 to 20:00
  const businessHours = {
    start: 8, // 8:00
    end: 20, // 20:00
  };

  const timeSlots = [];
  for (let hour = businessHours.start; hour < businessHours.end; hour++) {
    timeSlots.push(hour);
  }

  // Filter professionals based on the selected professional
  const displayedProfessionals = selectedProfessional
    ? professionals.filter(p => p.id.toString() === selectedProfessional)
    : professionals;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Grid Header - Professional Names */}
        <div className="grid grid-cols-[100px_repeat(auto-fill,minmax(180px,1fr))] gap-2">
          <div className="text-sm font-medium p-2 bg-muted/30 rounded-md">Horário</div>
          {displayedProfessionals.map(professional => (
            <div key={professional.id} className="text-sm font-medium p-2 bg-primary/10 text-primary rounded-md">
              {professional.name}
              <span className="block text-xs text-muted-foreground">{professional.specialty}</span>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="mt-2">
          {timeSlots.map(hour => (
            <div key={hour} className="grid grid-cols-[100px_repeat(auto-fill,minmax(180px,1fr))] gap-2 mb-2">
              <div className="text-sm p-2 bg-muted/20 rounded-md flex items-center justify-center">
                {hour}:00
              </div>

              {/* Slots for Each Professional */}
              {displayedProfessionals.map(professional => {
                const appointmentsInSlot = filteredAppointments.filter(
                  appointment => 
                    appointment.professionalId === professional.id && 
                    appointment.date.getHours() === hour
                );

                return (
                  <div 
                    key={professional.id}
                    className={cn(
                      "p-2 rounded-md min-h-16 relative",
                      appointmentsInSlot.length > 0 ? "bg-muted/5" : "bg-muted/0 border border-dashed border-muted"
                    )}
                  >
                    {appointmentsInSlot.map(appointment => (
                      <div 
                        key={appointment.id}
                        className={cn(
                          "p-2 rounded-md text-xs mb-1 border-l-4",
                          appointment.status === "confirmed" && "bg-green-500/10 border-l-green-500",
                          appointment.status === "pending" && "bg-yellow-500/10 border-l-yellow-500",
                          appointment.status === "cancelled" && "bg-red-500/10 border-l-red-500",
                          appointment.status === "completed" && "bg-blue-500/10 border-l-blue-500"
                        )}
                      >
                        <div className="font-medium">{appointment.clientName}</div>
                        <div>{appointment.serviceName}</div>
                        <div className="text-muted-foreground">
                          {format(appointment.date, 'HH:mm')} - 
                          {format(addMinutes(appointment.date, appointment.duration), 'HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
