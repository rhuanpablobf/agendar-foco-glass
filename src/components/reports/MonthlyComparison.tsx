
import React, { useState } from 'react';
import { format, subMonths, getYear, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  ChartLine,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Transaction, MonthlyRevenueData } from '@/types/financial';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface MonthlyComparisonProps {
  transactions: Transaction[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({ transactions }) => {
  const [compareMonths, setCompareMonths] = useState<number>(6);
  
  const currentDate = new Date();
  
  // Generate monthly data for the past N months
  const monthlyData: MonthlyRevenueData[] = Array.from({ length: compareMonths }).map((_, index) => {
    const monthDate = subMonths(currentDate, index);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd;
    });
    
    const revenue = monthTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const serviceCount = monthTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .length;
    
    return {
      month: format(monthDate, 'MMM/yy', { locale: ptBR }),
      revenue,
      expenses,
      profit: revenue - expenses,
      serviceCount,
      averageTicket: serviceCount > 0 ? revenue / serviceCount : 0
    };
  }).reverse(); // Reverse to show oldest first
  
  // Calculate percentage changes
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const latestMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2] || { revenue: 0, expenses: 0, profit: 0, serviceCount: 0 };
  
  const revenueChange = calculateChange(latestMonth.revenue, previousMonth.revenue);
  const expensesChange = calculateChange(latestMonth.expenses, previousMonth.expenses);
  const profitChange = calculateChange(latestMonth.profit, previousMonth.profit);
  const serviceCountChange = calculateChange(latestMonth.serviceCount, previousMonth.serviceCount);
  
  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="h-5 w-5" /> Comparativo Mensal
            </CardTitle>
            <CardDescription>
              Compare os resultados mês a mês
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select 
              value={compareMonths.toString()} 
              onValueChange={(value) => setCompareMonths(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Últimos 3 meses</SelectItem>
                <SelectItem value="6">Últimos 6 meses</SelectItem>
                <SelectItem value="12">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" /> Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Faturamento</div>
                  <div className="text-2xl font-semibold text-green-500">
                    {formatCurrency(latestMonth.revenue)}
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  revenueChange >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {revenueChange >= 0 
                    ? <TrendingUp className="h-4 w-4" />
                    : <TrendingDown className="h-4 w-4" />
                  }
                  {Math.abs(revenueChange).toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Despesas</div>
                  <div className="text-2xl font-semibold text-red-500">
                    {formatCurrency(latestMonth.expenses)}
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  expensesChange <= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {expensesChange <= 0 
                    ? <TrendingDown className="h-4 w-4" />
                    : <TrendingUp className="h-4 w-4" />
                  }
                  {Math.abs(expensesChange).toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Lucro</div>
                  <div className={cn(
                    "text-2xl font-semibold",
                    latestMonth.profit >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {formatCurrency(latestMonth.profit)}
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  profitChange >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {profitChange >= 0 
                    ? <TrendingUp className="h-4 w-4" />
                    : <TrendingDown className="h-4 w-4" />
                  }
                  {Math.abs(profitChange).toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Atendimentos</div>
                  <div className="text-2xl font-semibold">{latestMonth.serviceCount}</div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  serviceCountChange >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {serviceCountChange >= 0 
                    ? <TrendingUp className="h-4 w-4" />
                    : <TrendingDown className="h-4 w-4" />
                  }
                  {Math.abs(serviceCountChange).toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <div className="h-[350px]">
            <ChartContainer
              config={{
                revenue: { color: '#10B981' },
                expenses: { color: '#EF4444' },
                profit: { color: '#8B5CF6' }
              }}
            >
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Faturamento"
                  stroke="var(--color-revenue)" 
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  name="Despesas"
                  stroke="var(--color-expenses)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Lucro"
                  stroke="var(--color-profit)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                  <TableHead className="text-right">Despesas</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                  <TableHead className="text-right">Atendimentos</TableHead>
                  <TableHead className="text-right">Ticket Médio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((data, index) => (
                  <TableRow key={index} className={index === monthlyData.length - 1 ? "font-medium" : ""}>
                    <TableCell>{data.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.revenue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.expenses)}</TableCell>
                    <TableCell className={cn(
                      "text-right",
                      data.profit >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {formatCurrency(data.profit)}
                    </TableCell>
                    <TableCell className="text-right">{data.serviceCount}</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.averageTicket)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyComparison;
