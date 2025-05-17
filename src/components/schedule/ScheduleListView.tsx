
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

interface ScheduleListViewProps {
  filteredAppointments: Appointment[];
  professionals: Professional[];
}

export const ScheduleListView: React.FC<ScheduleListViewProps> = ({ filteredAppointments }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Confirmado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelado</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Horário</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Profissional</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <TableRow key={appointment.id}>
              <TableCell>{format(appointment.date, 'HH:mm')}</TableCell>
              <TableCell>{appointment.clientName}</TableCell>
              <TableCell>{appointment.serviceName}</TableCell>
              <TableCell>{appointment.professionalName}</TableCell>
              <TableCell>{appointment.duration} min</TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Nenhum agendamento encontrado para os filtros selecionados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
