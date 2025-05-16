
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

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
    ]
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Olá, Equipe BeautySalon</h1>
          <p className="text-muted-foreground">
            Aqui está o resumo do seu negócio hoje, {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long'
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dashboard-card">
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

          <Card className="dashboard-card">
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

          <Card className="dashboard-card">
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

          <Card className="dashboard-card">
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
          <Card className="dashboard-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Desempenho Semanal</CardTitle>
              <CardDescription>
                Comparação de atendimentos e faturamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Gráfico de desempenho será implementado aqui</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Próximos Atendimentos</CardTitle>
              <CardDescription>
                Agendamentos para hoje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.upcomingAppointments.map((appointment, i) => (
                  <div key={i} className="flex items-start space-x-3 pb-3 border-b last:border-0">
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
            </CardContent>
          </Card>
        </div>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Plano Atual: Gratuito</CardTitle>
            <CardDescription>
              Você utilizou 3 de 5 agendamentos este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">3/5 agendamentos</p>
                <p className="text-sm text-primary font-medium">60% usado</p>
              </div>
              <Button className="w-full sm:w-auto">Atualizar para o Plano Profissional</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CompanyDashboard;
