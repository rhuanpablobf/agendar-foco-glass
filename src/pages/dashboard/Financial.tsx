
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Financial = () => {
  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Financeiro</h1>
            <p className="text-muted-foreground">
              Gerencie as finanças da sua empresa
            </p>
          </div>

          <div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Transação
            </Button>
          </div>
        </div>

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <CardTitle>Movimentações Financeiras</CardTitle>
            <CardDescription>
              Controle de entradas e saídas financeiras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-10 text-muted-foreground">
              Implementação completa do módulo Financeiro em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Financial;
