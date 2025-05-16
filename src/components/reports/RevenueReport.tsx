
import React, { useState } from 'react';
import { format, parse, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  FileText,
  Users,
  Calendar,
  CreditCard
} from 'lucide-react';
import { 
  Transaction, 
  RevenueByProfessional, 
  RevenueByService 
} from '@/types/financial';
import { Service } from '@/types/service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface RevenueReportProps {
  transactions: Transaction[];
  professionals: Array<{ id: string; name: string }>;
  services: Array<{ id: string; name: string; price: number }>;
}

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6', '#F97316'];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatShortDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

const RevenueReport: React.FC<RevenueReportProps> = ({ 
  transactions, 
  professionals, 
  services 
}) => {
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  
  // Filter transactions based on selected criteria
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const start = parse(startDate, 'yyyy-MM-dd', new Date());
    const end = parse(endDate, 'yyyy-MM-dd', new Date());
    
    const isInDateRange = transactionDate >= start && transactionDate <= end;
    const matchesProfessional = 
      selectedProfessional === 'all' || 
      transaction.relatedProfessionalId === selectedProfessional;
    const matchesService = 
      selectedService === 'all' || 
      transaction.relatedServiceId === selectedService;
    
    return (
      transaction.type === 'income' && 
      transaction.status === 'completed' && 
      isInDateRange && 
      matchesProfessional && 
      matchesService
    );
  });

  // Calculate revenue by professional
  const revenueByProfessional: RevenueByProfessional[] = professionals.map(professional => {
    const profTransactions = filteredTransactions.filter(
      t => t.relatedProfessionalId === professional.id
    );
    
    return {
      professionalId: professional.id,
      professionalName: professional.name,
      totalRevenue: profTransactions.reduce((sum, t) => sum + t.amount, 0),
      serviceCount: profTransactions.length,
      transactions: profTransactions
    };
  }).filter(item => item.serviceCount > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Calculate revenue by service
  const revenueByService: RevenueByService[] = services.map(service => {
    const serviceTransactions = filteredTransactions.filter(
      t => t.relatedServiceId === service.id
    );
    
    return {
      serviceId: service.id,
      serviceName: service.name,
      totalRevenue: serviceTransactions.reduce((sum, t) => sum + t.amount, 0),
      serviceCount: serviceTransactions.length,
      transactions: serviceTransactions
    };
  }).filter(item => item.serviceCount > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Chart data for professionals
  const professionalChartData = revenueByProfessional.slice(0, 8).map((item, index) => ({
    name: item.professionalName,
    value: item.totalRevenue,
    fill: COLORS[index % COLORS.length]
  }));

  // Chart data for services
  const serviceChartData = revenueByService.slice(0, 8).map((item, index) => ({
    name: item.serviceName,
    value: item.totalRevenue,
    fill: COLORS[index % COLORS.length]
  }));

  // Calculate totals
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = filteredTransactions.length;
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  
  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Relatório de Faturamento
            </CardTitle>
            <CardDescription>
              Analise o faturamento por profissional, serviço e período
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate" 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professional">Profissional</Label>
            <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger id="professional">
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {professionals.map(prof => (
                  <SelectItem key={prof.id} value={prof.id}>{prof.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Serviço</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Faturamento Total</div>
              <div className="text-2xl font-semibold text-green-500">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total de Atendimentos</div>
              <div className="text-2xl font-semibold">{totalTransactions}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Ticket Médio</div>
              <div className="text-2xl font-semibold text-blue-500">{formatCurrency(averageTicket)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="professionals">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="professionals" className="flex gap-2 items-center justify-center">
              <Users className="h-4 w-4" />
              <span>Por Profissional</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex gap-2 items-center justify-center">
              <CreditCard className="h-4 w-4" />
              <span>Por Serviço</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="professionals" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Faturamento por Profissional</h3>
                {revenueByProfessional.length > 0 ? (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        revenue: { color: '#8B5CF6' },
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={professionalChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => entry.name}
                          labelLine={true}
                        >
                          {professionalChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ChartContainer>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-10">
                    Não há dados para exibir.
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Detalhamento</h3>
                <div className="rounded-md border max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Profissional</TableHead>
                        <TableHead className="text-right">Atendimentos</TableHead>
                        <TableHead className="text-right">Faturamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueByProfessional.length > 0 ? (
                        revenueByProfessional.map((item) => (
                          <TableRow key={item.professionalId}>
                            <TableCell>{item.professionalName}</TableCell>
                            <TableCell className="text-right">{item.serviceCount}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.totalRevenue)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            Não há dados para exibir.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Faturamento por Serviço</h3>
                {revenueByService.length > 0 ? (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        revenue: { color: '#10B981' },
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={serviceChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => entry.name}
                          labelLine={true}
                        >
                          {serviceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ChartContainer>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-10">
                    Não há dados para exibir.
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Detalhamento</h3>
                <div className="rounded-md border max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Faturamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueByService.length > 0 ? (
                        revenueByService.map((item) => (
                          <TableRow key={item.serviceId}>
                            <TableCell>{item.serviceName}</TableCell>
                            <TableCell className="text-right">{item.serviceCount}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.totalRevenue)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            Não há dados para exibir.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RevenueReport;
