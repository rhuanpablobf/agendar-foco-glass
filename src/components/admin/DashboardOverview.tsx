
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Building, Users } from 'lucide-react';

interface AdminDashboardData {
  mrr: number;
  growth: number;
  companies: {
    total: number;
    active: number;
    new: number;
  };
  planDistribution: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

interface DashboardOverviewProps {
  adminData: AdminDashboardData;
}

export const DashboardOverview = ({ adminData }: DashboardOverviewProps) => {
  return (
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
  );
};
