
import React, { useState } from 'react';
import { format, parse, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Users,
  XCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AttendanceSummary, AttendanceByProfessional } from '@/types/financial';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface Appointment {
  id: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  clientId: string;
  clientName: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
}

interface AttendanceReportProps {
  appointments: Appointment[];
  professionals: Array<{ id: string; name: string }>;
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({ 
  appointments, 
  professionals 
}) => {
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  );

  // Filter appointments based on selected date range
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const start = parse(startDate, 'yyyy-MM-dd', new Date());
    const end = parse(endDate, 'yyyy-MM-dd', new Date());
    
    return appointmentDate >= start && appointmentDate <= end;
  });

  // Calculate overall attendance summary
  const overallSummary: AttendanceSummary = {
    total: filteredAppointments.length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
    cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length,
    noShow: filteredAppointments.filter(a => a.status === 'no_show').length,
    cancellationRate: 0,
    noShowRate: 0,
  };

  overallSummary.cancellationRate = overallSummary.total > 0 
    ? (overallSummary.cancelled / overallSummary.total) * 100 
    : 0;
    
  overallSummary.noShowRate = overallSummary.total > 0 
    ? (overallSummary.noShow / overallSummary.total) * 100 
    : 0;

  // Calculate attendance by professional
  const attendanceByProfessional: AttendanceByProfessional[] = professionals.map(professional => {
    const professionalAppointments = filteredAppointments.filter(
      a => a.professionalId === professional.id
    );
    
    const completed = professionalAppointments.filter(a => a.status === 'completed').length;
    const cancelled = professionalAppointments.filter(a => a.status === 'cancelled').length;
    const noShow = professionalAppointments.filter(a => a.status === 'no_show').length;
    const total = professionalAppointments.length;
    
    const summary: AttendanceSummary = {
      total,
      completed,
      cancelled,
      noShow,
      cancellationRate: total > 0 ? (cancelled / total) * 100 : 0,
      noShowRate: total > 0 ? (noShow / total) * 100 : 0
    };
    
    return {
      professionalId: professional.id,
      professionalName: professional.name,
      summary
    };
  }).filter(item => item.summary.total > 0)
    .sort((a, b) => b.summary.total - a.summary.total);

  // Chart data
  const chartData = attendanceByProfessional.map(prof => ({
    name: prof.professionalName,
    completed: prof.summary.completed,
    cancelled: prof.summary.cancelled,
    noShow: prof.summary.noShow,
  }));

  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Relatório de Faltas e Cancelamentos
            </CardTitle>
            <CardDescription>
              Analise cancelamentos e ausências por período
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDateAttendance">Data Inicial</Label>
            <Input
              id="startDateAttendance"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDateAttendance">Data Final</Label>
            <Input
              id="endDateAttendance" 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total de Agendamentos</div>
              <div className="text-2xl font-semibold">{overallSummary.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Atendimentos Concluídos</div>
              <div className="text-2xl font-semibold text-green-500">{overallSummary.completed}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Cancelamentos</div>
              <div className="text-2xl font-semibold text-amber-500">
                {overallSummary.cancelled} 
                <span className="text-sm text-muted-foreground ml-2">
                  ({overallSummary.cancellationRate.toFixed(1)}%)
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Ausências</div>
              <div className="text-2xl font-semibold text-red-500">
                {overallSummary.noShow}
                <span className="text-sm text-muted-foreground ml-2">
                  ({overallSummary.noShowRate.toFixed(1)}%)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Dados por Profissional</h3>
          {chartData.length > 0 ? (
            <div className="h-[350px]">
              <ChartContainer
                config={{
                  completed: { color: '#10B981' },
                  cancelled: { color: '#F59E0B' },
                  noShow: { color: '#EF4444' }
                }}
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="completed" name="Concluídos" fill="var(--color-completed)" />
                  <Bar dataKey="cancelled" name="Cancelamentos" fill="var(--color-cancelled)" />
                  <Bar dataKey="noShow" name="Ausências" fill="var(--color-noShow)" />
                </BarChart>
              </ChartContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              Não há dados para exibir.
            </p>
          )}
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Concluídos</TableHead>
                <TableHead className="text-right">Cancelamentos</TableHead>
                <TableHead className="text-right">Taxa Canc.</TableHead>
                <TableHead className="text-right">Ausências</TableHead>
                <TableHead className="text-right">Taxa Ausência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceByProfessional.length > 0 ? (
                attendanceByProfessional.map((item) => (
                  <TableRow key={item.professionalId}>
                    <TableCell className="font-medium">{item.professionalName}</TableCell>
                    <TableCell className="text-right">{item.summary.total}</TableCell>
                    <TableCell className="text-right text-green-500">{item.summary.completed}</TableCell>
                    <TableCell className="text-right text-amber-500">{item.summary.cancelled}</TableCell>
                    <TableCell className="text-right">{item.summary.cancellationRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right text-red-500">{item.summary.noShow}</TableCell>
                    <TableCell className="text-right">{item.summary.noShowRate.toFixed(1)}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Não há dados para exibir.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceReport;
