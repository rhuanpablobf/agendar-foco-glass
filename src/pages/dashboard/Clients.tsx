
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Clients = () => {
  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie os clientes da sua empresa
            </p>
          </div>

          <div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </div>
        </div>

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <CardTitle>Cadastro de Clientes</CardTitle>
            <CardDescription>
              Visualize e gerencie os clientes cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-10 text-muted-foreground">
              Implementação completa do módulo de Clientes em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Clients;
