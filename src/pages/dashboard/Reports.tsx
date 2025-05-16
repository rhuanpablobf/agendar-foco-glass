
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Reports = () => {
  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize dados e métricas da sua empresa
          </p>
        </div>

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
            <CardDescription>
              Analise o desempenho da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-10 text-muted-foreground">
              Implementação completa do módulo de Relatórios em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
