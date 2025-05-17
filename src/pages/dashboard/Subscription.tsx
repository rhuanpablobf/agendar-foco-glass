
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionManagement } from '@/components/subscription/SubscriptionManagement';
import { useSubscription } from '@/hooks/useSubscription';

const Subscription = () => {
  const { isLoading } = useSubscription();

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assinatura</h1>
          <p className="text-muted-foreground">
            Gerencie seu plano e pagamentos
          </p>
        </div>

        <Tabs defaultValue="subscription">
          <TabsList>
            <TabsTrigger value="subscription">Meu Plano</TabsTrigger>
            <TabsTrigger value="payment-history">Histórico de Pagamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription" className="space-y-6 mt-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/10 rounded w-1/4"></div>
                <div className="h-32 bg-white/10 rounded"></div>
              </div>
            ) : (
              <SubscriptionManagement />
            )}
          </TabsContent>
          
          <TabsContent value="payment-history" className="mt-6">
            {/* This would be implemented with real payment data in production */}
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Histórico de Pagamentos</h3>
              <p className="text-muted-foreground mt-2">
                Todas as suas transações e faturas aparecerão aqui quando disponíveis.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Subscription;
