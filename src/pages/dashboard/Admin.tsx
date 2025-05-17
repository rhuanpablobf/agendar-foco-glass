
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminCompanyList } from '@/components/admin/AdminCompanyList';
import { AdminPlanManagement } from '@/components/admin/AdminPlanManagement';
import { AdminSubadminManagement } from '@/components/admin/AdminSubadminManagement';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';

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
            <AdminDashboardContent adminData={adminData} />
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
