
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Filter,
  Users
} from 'lucide-react';
import { Commission } from '@/types/financial';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface CommissionReportProps {
  commissions: Commission[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const CommissionReport: React.FC<CommissionReportProps> = ({ commissions }) => {
  const [professionalFilter, setProfessionalFilter] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  
  // Get unique professionals
  const professionals = Array.from(new Set(commissions.map(comm => comm.professionalId)))
    .map(id => {
      const commission = commissions.find(c => c.professionalId === id);
      return { 
        id, 
        name: commission?.professionalName || 'Unknown'
      };
    });
  
  // Filter commissions based on selected filters
  const filteredCommissions = commissions.filter(commission => {
    const matchesProfessional = professionalFilter === 'all' || commission.professionalId === professionalFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'paid' && commission.isPaid) || 
                         (statusFilter === 'unpaid' && !commission.isPaid);
    
    return matchesProfessional && matchesStatus;
  });
  
  // Calculate totals
  const totalCommission = filteredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalPaid = filteredCommissions.filter(c => c.isPaid).reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalPending = filteredCommissions.filter(c => !c.isPaid).reduce((sum, c) => sum + c.commissionAmount, 0);
  
  // Prepare data for chart
  const chartData = professionals.map(professional => {
    const commissionsByProfessional = filteredCommissions.filter(c => c.professionalId === professional.id);
    const totalAmount = commissionsByProfessional.reduce((sum, c) => sum + c.commissionAmount, 0);
    const paidAmount = commissionsByProfessional.filter(c => c.isPaid).reduce((sum, c) => sum + c.commissionAmount, 0);
    const pendingAmount = commissionsByProfessional.filter(c => !c.isPaid).reduce((sum, c) => sum + c.commissionAmount, 0);
    
    return {
      name: professional.name,
      total: totalAmount,
      paid: paidAmount,
      pending: pendingAmount,
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Relatório de Comissões
              </CardTitle>
              <CardDescription>
                Visualize e gerencie comissões por profissional
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={professionalFilter}
                onValueChange={(value) => setProfessionalFilter(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {professionals.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={(value: 'all' | 'paid' | 'unpaid') => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagas</SelectItem>
                  <SelectItem value="unpaid">Pendentes</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/5">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total em Comissões</div>
                <div className="text-2xl font-semibold">{formatCurrency(totalCommission)}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Comissões Pagas</div>
                <div className="text-2xl font-semibold text-green-500">{formatCurrency(totalPaid)}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Comissões Pendentes</div>
                <div className="text-2xl font-semibold text-amber-500">{formatCurrency(totalPending)}</div>
              </CardContent>
            </Card>
          </div>
          
          {chartData.length > 0 && (
            <div className="h-[300px] mb-8">
              <ChartContainer
                config={{
                  paid: { color: '#10B981' },
                  pending: { color: '#F59E0B' },
                  total: { color: '#6366F1' }
                }}
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="paid" name="Pagas" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pendentes" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor Base</TableHead>
                  <TableHead>%</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.length > 0 ? (
                  filteredCommissions.map((commission) => (
                    <TableRow key={`${commission.professionalId}-${commission.serviceId}-${commission.date.toString()}`}>
                      <TableCell>{commission.professionalName}</TableCell>
                      <TableCell>{commission.serviceName}</TableCell>
                      <TableCell>{format(commission.date, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{formatCurrency(commission.baseAmount)}</TableCell>
                      <TableCell>{commission.percentage}%</TableCell>
                      <TableCell className="font-medium">{formatCurrency(commission.commissionAmount)}</TableCell>
                      <TableCell>
                        {commission.isPaid ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Paga
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhuma comissão encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>
                Mostrando {filteredCommissions.length} comissões de {commissions.length} total.
              </TableCaption>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
