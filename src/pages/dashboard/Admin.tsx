
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLocation } from 'react-router-dom';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';
import { AdminCompanyList } from '@/components/admin/AdminCompanyList';
import { AdminPlanManagement } from '@/components/admin/AdminPlanManagement';
import { AdminSubadminManagement } from '@/components/admin/AdminSubadminManagement';

const AdminDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
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

  // Set the page title based on the current path
  let pageTitle = "Dashboard Administrativo";
  let pageDescription = "Gerencie os clientes e o desempenho do BeautySalon";
  
  if (currentPath.includes('/admin/companies')) {
    pageTitle = "Empresas";
    pageDescription = "Gerencie as empresas cadastradas na plataforma";
  } else if (currentPath.includes('/admin/plans')) {
    pageTitle = "Planos";
    pageDescription = "Configure os planos disponíveis para seus clientes";
  } else if (currentPath.includes('/admin/subadmins')) {
    pageTitle = "Subadmins";
    pageDescription = "Gerencie os administradores auxiliares da plataforma";
  } else if (currentPath.includes('/admin/settings')) {
    pageTitle = "Configurações";
    pageDescription = "Configure as definições do sistema";
  }

  // Render the appropriate content based on the current path
  const renderContent = () => {
    if (currentPath.includes('/admin/companies')) {
      return <AdminCompanyList />;
    } else if (currentPath.includes('/admin/plans')) {
      return <AdminPlanManagement />;
    } else if (currentPath.includes('/admin/subadmins')) {
      return <AdminSubadminManagement />;
    } else if (currentPath.includes('/admin/settings')) {
      return <div className="space-y-6">Configurações do sistema</div>;
    } else {
      return <AdminDashboardContent adminData={adminData} />;
    }
  };

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {pageDescription}
          </p>
        </div>

        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
