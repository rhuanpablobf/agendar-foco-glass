import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockProfessionals } from '../data/mockData';
import { Appointment } from '../types/schedule';

interface ScheduleListViewProps {
  filteredAppointments: Appointment[];
}

export function ScheduleListView({ filteredAppointments }: ScheduleListViewProps) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-white/5">
          <tr>
            <th scope="col" className="px-6 py-3">Cliente</th>
            <th scope="col" className="px-6 py-3">Serviço</th>
            <th scope="col" className="px-6 py-3">Profissional</th>
            <th scope="col" className="px-6 py-3">Horário</th>
            <th scope="col" className="px-6 py-3">Valor</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map(appointment => (
            <tr key={appointment.id} className="border-b border-white/10">
              <td className="px-6 py-4 font-medium whitespace-nowrap">
                {appointment.clientName}
              </td>
              <td className="px-6 py-4">
                {appointment.serviceName}
              </td>
              <td className="px-6 py-4">
                {mockProfessionals.find(p => p.id === appointment.professionalId)?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {appointment.startTime} - {appointment.endTime}
              </td>
              <td className="px-6 py-4">
                R$ {appointment.price.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-2 py-1 rounded text-xs",
                  appointment.status === "confirmado" ? "bg-green-500/20 text-green-300" : 
                  appointment.status === "pendente" ? "bg-amber-500/20 text-amber-300" : ""
                )}>
                  {appointment.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <Button variant="ghost" size="sm">Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
