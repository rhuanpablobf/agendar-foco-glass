
export type PlanType = 'Gratuito' | 'Profissional';

export interface PlanDetails {
  name: PlanType;
  maxAppointments: number | 'unlimited';
  maxProfessionals: number | 'unlimited';
  hasFinancialAccess: boolean;
  hasReports: boolean;
  price: number;
}

export interface SubscriptionStatus {
  plan: PlanType;
  usedAppointments: number;
  maxAppointments: number | 'unlimited';
  percentUsed: number;
  nextResetDate: string;
  isLimitReached: boolean;
}
