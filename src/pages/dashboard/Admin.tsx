
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Building, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  // Dados fictícios para o dashboard de admin
  const adminData = {
    mrr: 15850,
    growth: 12.5,
    companies: {
      total: 87,
      active: 72,
      new: 8
    },
    planDistribution: [
      { name: 'Gratuito', count: 52, percentage: 60 },
      { name: 'Profissional', count: 35, percentage: 40 }
    ],
    recentCompanies: [
      { name: 'Salão Belle Femme', plan: 'Gratuito', registeredAt: '15/05/2023' },
      { name: 'Barbearia Modern Cut', plan: 'Profissional', registeredAt: '14/05/2023' },
      { name: 'Espaço Beleza Total', plan: 'Gratuito', registeredAt: '12/05/2023' },
    ]
  };

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes e o desempenho do BeautySalon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                MRR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R$ {adminData.mrr.toLocaleString('pt-BR')}
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-xs text-green-500">
                  +{adminData.growth}% mês a mês
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{adminData.companies.total}</div>
              <p className="text-xs text-muted-foreground">
                {adminData.companies.active} ativas, {adminData.companies.new} novas este mês
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Plano Gratuito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{adminData.planDistribution[0].count}</div>
              <p className="text-xs text-muted-foreground">
                {adminData.planDistribution[0].percentage}% das empresas
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Plano Profissional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{adminData.planDistribution[1].count}</div>
              <p className="text-xs text-muted-foreground">
                {adminData.planDistribution[1].percentage}% das empresas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="dashboard-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Crescimento Mensal</CardTitle>
              <CardDescription>
                MRR e novos cadastros nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Gráfico de crescimento será implementado aqui</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Empresas Recentes</CardTitle>
              <CardDescription>
                Últimos cadastros na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminData.recentCompanies.map((company, i) => (
                  <div key={i} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div className="bg-muted rounded p-2">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          Plano: {company.plan}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {company.registeredAt}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Distribuição por Planos</CardTitle>
              <CardDescription>
                Divisão de empresas por plano contratado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Gráfico de distribuição será implementado aqui</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
