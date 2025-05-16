
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ServiceList } from '@/components/services/ServiceList';
import { ServiceForm } from '@/components/services/ServiceForm';
import { ServiceDetails } from '@/components/services/ServiceDetails';
import { SubscriptionLimits } from '@/components/subscription/SubscriptionLimits';
import { useSubscription } from '@/hooks/useSubscription';

const Services = () => {
  const { subscriptionStatus } = useSubscription();
  const showSubscriptionWarning = subscriptionStatus?.isLimitReached && subscriptionStatus?.plan === 'Gratuito';

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela sua empresa
          </p>
        </div>

        {showSubscriptionWarning && (
          <div className="mb-4">
            <SubscriptionLimits variant="compact" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <ServiceList />
          </div>
          <div className="space-y-6">
            <ServiceForm />
            <ServiceDetails />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;
