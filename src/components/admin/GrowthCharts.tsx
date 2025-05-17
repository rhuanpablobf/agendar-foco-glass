
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import {
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

interface MonthlyGrowthData {
  month: string;
  mrr: number;
  users: number;
}

interface CompanyData {
  name: string;
  plan: string;
  registeredAt: string;
}

interface GrowthChartsProps {
  monthlyGrowth: MonthlyGrowthData[];
  recentCompanies: CompanyData[];
}

export const GrowthCharts = ({ monthlyGrowth, recentCompanies }: GrowthChartsProps) => {
  return (
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
                data={monthlyGrowth}
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
            {recentCompanies.map((company, i) => (
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
  );
};
