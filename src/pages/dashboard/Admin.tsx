
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Building, Users, UserPlus, Package } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminCompanyList } from '@/components/admin/AdminCompanyList';
import { AdminPlanManagement } from '@/components/admin/AdminPlanManagement';
import { AdminSubadminManagement } from '@/components/admin/AdminSubadminManagement';
import { toast } from 'sonner';

const AdminDashboard = () => {
  // Dados mockados para o dashboard de admin
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
    ],
    monthlyGrowth: [
      { month: 'Jan', mrr: 10200, users: 65 },
      { month: 'Fev', mrr: 11500, users: 68 },
      { month: 'Mar', mrr: 12800, users: 72 },
      { month: 'Abr', mrr: 13600, users: 76 },
      { month: 'Mai', mrr: 14200, users: 80 },
      { month: 'Jun', mrr: 15850, users: 87 },
    ],
    defaultRates: [
      { name: 'Pagos', value: 95 },
      { name: 'Inadimplentes', value: 5 }
    ]
  };

  const COLORS = ['#8B5CF6', '#EC4899', '#F97316', '#EAB308'];

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes e o desempenho do BeautySalon
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="subadmins">Subadmins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
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
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={adminData.monthlyGrowth}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="mrr"
                          name="MRR (R$)"
                          stroke="#8B5CF6"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="users"
                          name="Usuários"
                          stroke="#F97316"
                        />
                      </LineChart>
                    </ResponsiveContainer>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Distribuição por Planos</CardTitle>
                  <CardDescription>
                    Divisão de empresas por plano contratado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={adminData.planDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, percentage}) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {adminData.planDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Taxa de Inadimplência</CardTitle>
                  <CardDescription>
                    Percentual de pagamentos em dia vs. inadimplentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={adminData.defaultRates}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, value}) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#8B5CF6" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="companies" className="space-y-6">
            <AdminCompanyList />
          </TabsContent>
          
          <TabsContent value="plans" className="space-y-6">
            <AdminPlanManagement />
          </TabsContent>
          
          <TabsContent value="subadmins" className="space-y-6">
            <AdminSubadminManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
