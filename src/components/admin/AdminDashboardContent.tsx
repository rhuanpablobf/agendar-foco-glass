
import React from 'react';
import { DashboardOverview } from './DashboardOverview';
import { GrowthCharts } from './GrowthCharts';
import { DistributionCharts } from './DistributionCharts';

// Define the shape of our admin data
interface AdminDataType {
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
  recentCompanies: {
    name: string;
    plan: string;
    registeredAt: string;
  }[];
  monthlyGrowth: {
    month: string;
    mrr: number;
    users: number;
  }[];
  defaultRates: {
    name: string;
    value: number;
  }[];
}

interface AdminDashboardContentProps {
  adminData: AdminDataType;
}

export const AdminDashboardContent = ({ adminData }: AdminDashboardContentProps) => {
  return (
    <div className="space-y-6">
      <DashboardOverview adminData={adminData} />
      <GrowthCharts 
        monthlyGrowth={adminData.monthlyGrowth} 
        recentCompanies={adminData.recentCompanies} 
      />
      <DistributionCharts 
        planDistribution={adminData.planDistribution} 
        defaultRates={adminData.defaultRates} 
      />
    </div>
  );
};
