import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SubscriptionLimits } from '@/components/subscription/SubscriptionLimits';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { useSubscription } from '@/hooks/useSubscription';

const CompanyDashboard = () => {
  // Dados fictícios para o dashboard
  const dashboardData = {
    appointments: {
      today: 8,
      completed: 3,
      pending: 5,
    },
    revenue: {
      today: 650,
      month: 9850,
    },
    clients: {
      new: 12,
      total: 284,
      returnRate: 68,
    },
    upcomingAppointments: [
      { time: '14:30', client: 'Ana Silva', service: 'Corte de Cabelo' },
      { time: '15:45', client: 'Carlos Oliveira', service: 'Barba' },
      { time: '16:30', client: 'Mariana Costa', service: 'Coloração' },
    ],
    weeklyPerformance: [
      { name: 'Segunda', agendamentos: 6, faturamento: 450 },
      { name: 'Terça', agendamentos: 8, faturamento: 620 },
      { name: 'Quarta', agendamentos: 7, faturamento: 580 },
      { name: 'Quinta', agendamentos: 9, faturamento: 750 },
      { name: 'Sexta', agendamentos: 10, faturamento: 820 },
      { name: 'Sábado', agendamentos: 12, faturamento: 950 },
      { name: 'Domingo', agendamentos: 2, faturamento: 180 },
    ],
    bestServices: [
      { name: 'Corte de Cabelo', count: 18, revenue: 1440 },
      { name: 'Coloração', count: 12, revenue: 1800 },
      { name: 'Barba', count: 15, revenue: 750 },
      { name: 'Manicure', count: 10, revenue: 600 },
    ]
  };

  // Formatar a data atual
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    });
  }, []);

  const { subscriptionStatus, checkCanSchedule } = useSubscription();
  const limitReached = subscriptionStatus?.isLimitReached && subscriptionStatus?.plan === 'Gratuito';

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Olá, Equipe BeautySalon</h1>
          <p className="text-muted-foreground">
            Aqui está o resumo do seu negócio hoje, {currentDate}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Agendamentos Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.appointments.today}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.appointments.completed} concluídos, {dashboardData.appointments.pending} pendentes
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Faturamento Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R$ {dashboardData.revenue.month.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                R$ {dashboardData.revenue.today.toLocaleString('pt-BR')} hoje
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Novos Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.clients.new}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.clients.total} clientes no total
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Taxa de Retorno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.clients.returnRate}%</div>
              <p className="text-xs text-muted-foreground">
                Clientes que voltam
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass lg:col-span-2">
            <CardHeader>
              <CardTitle>Desempenho Semanal</CardTitle>
              <CardDescription>
                Comparação de atendimentos e faturamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.weeklyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis yAxisId="left" stroke="rgba(255,255,255,0.7)" />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="agendamentos"
                      name="Agendamentos"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="faturamento"
                      name="Faturamento (R$)"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader>
              <CardTitle>Próximos Atendimentos</CardTitle>
              <CardDescription>
                Agendamentos para hoje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.upcomingAppointments.map((appointment, i) => (
                  <div key={i} className="flex items-start space-x-3 pb-3 border-b border-white/10 last:border-0">
                    <div className="bg-muted rounded p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.time} - {appointment.client}</p>
                      <p className="text-xs text-muted-foreground">{appointment.service}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center" 
                  disabled={limitReached}
                >
                  <Calendar className="mr-2 h-4 w-4" /> 
                  Novo Agendamento
                  {limitReached && (
                    <span className="ml-1 text-xs text-amber-200">(Limite atingido)</span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader>
              <CardTitle>Serviços Mais Populares</CardTitle>
              <CardDescription>
                Serviços mais procurados este mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.bestServices}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Quantidade" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" name="Faturamento (R$)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <SubscriptionLimits />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDashboard;
