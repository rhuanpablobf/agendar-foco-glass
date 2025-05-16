
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
    planUsage: {
      plan: 'Gratuito',
      usedAppointments: 3,
      maxAppointments: 5,
      percentUsed: 60,
    },
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

  // Calcular a percentagem usada do plano
  const usedPercentage = useMemo(() => {
    const { usedAppointments, maxAppointments } = dashboardData.planUsage;
    return (usedAppointments / maxAppointments) * 100;
  }, [dashboardData.planUsage]);

  // Verificar se o limite foi atingido
  const limitReached = useMemo(() => {
    const { usedAppointments, maxAppointments } = dashboardData.planUsage;
    return usedAppointments >= maxAppointments;
  }, [dashboardData.planUsage]);

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
                <Button variant="outline" className="w-full flex items-center justify-center" disabled={limitReached}>
                  <Calendar className="mr-2 h-4 w-4" /> 
                  Novo Agendamento
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

          <Card className="dashboard-card border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Plano Atual: {dashboardData.planUsage.plan}</CardTitle>
                  <CardDescription>
                    Você utilizou {dashboardData.planUsage.usedAppointments} de {dashboardData.planUsage.maxAppointments} agendamentos este mês
                  </CardDescription>
                </div>
                {limitReached && (
                  <div className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full border border-red-300/30">
                    Limite atingido
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={usedPercentage} className="h-2" />
                <div className="flex justify-between">
                  <p className="text-sm">{dashboardData.planUsage.usedAppointments}/{dashboardData.planUsage.maxAppointments} agendamentos</p>
                  <p className="text-sm text-primary font-medium">{dashboardData.planUsage.percentUsed}% usado</p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      Atualizar para o Plano Profissional
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                    <DialogHeader>
                      <DialogTitle>Atualize para o Plano Profissional</DialogTitle>
                      <DialogDescription>
                        Desbloqueie recursos ilimitados e aproveite ao máximo o BeautySalon
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white/5 border border-white/10 p-4">
                          <CardTitle className="text-lg mb-2">Plano Gratuito</CardTitle>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <span className="mr-2 bg-white/20 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              5 agendamentos/mês
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 bg-white/20 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              1 profissional
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 bg-white/20 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              Recursos básicos
                            </li>
                          </ul>
                          <div className="mt-4 text-lg font-bold">Grátis</div>
                          <div className="text-xs text-muted-foreground">Seu plano atual</div>
                        </Card>
                        
                        <Card className="bg-primary/10 border border-primary/30 p-4">
                          <CardTitle className="text-lg mb-2">Plano Profissional</CardTitle>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              Agendamentos ilimitados
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              Múltiplos profissionais
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              Relatórios avançados
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              Gestão financeira
                            </li>
                          </ul>
                          <div className="mt-4 text-lg font-bold">R$49,90<span className="text-xs font-normal">/mês</span></div>
                        </Card>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <Button type="button" variant="secondary" className="md:w-auto">
                        Ver mais detalhes
                      </Button>
                      <Button type="button">
                        Assinar plano profissional
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {limitReached && (
                  <div className="mt-2 text-sm bg-amber-500/20 border border-amber-300/20 rounded-md p-3 text-amber-200">
                    <p>Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar usando o sistema.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDashboard;
