
export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'pix' | 'credit_card' | 'debit_card';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  category: string;
  paymentMethod?: PaymentMethod;
  relatedServiceId?: string;
  relatedProfessionalId?: string;
  relatedClientId?: string;
  commissionAmount?: number;
  status: 'pending' | 'completed' | 'cancelled';
  tags?: string[];
}

export interface DailyBalance {
  date: Date;
  openingBalance: number;
  closingBalance: number;
  totalIncome: number;
  totalExpense: number;
  isClosed: boolean;
  closedBy?: string;
  closedAt?: Date;
  notes?: string;
}

export interface Commission {
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  baseAmount: number;
  percentage: number;
  commissionAmount: number;
  isPaid: boolean;
  paidDate?: Date;
  transactionId?: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  category: string;
  paymentMethod?: PaymentMethod;
  relatedServiceId?: string;
  relatedProfessionalId?: string;
  relatedClientId?: string;
  tags?: string[];
}

export interface CommissionSettings {
  defaultPercentage: number;
  serviceSpecificPercentages: Record<string, number>;
}

// Report related interfaces
export interface RevenueByProfessional {
  professionalId: string;
  professionalName: string;
  totalRevenue: number;
  serviceCount: number;
  transactions: Transaction[];
}

export interface RevenueByService {
  serviceId: string;
  serviceName: string;
  totalRevenue: number;
  serviceCount: number;
  transactions: Transaction[];
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  serviceCount: number;
  averageTicket: number;
}

export interface AttendanceSummary {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  cancellationRate: number;
  noShowRate: number;
}

export interface AttendanceByProfessional {
  professionalId: string;
  professionalName: string;
  summary: AttendanceSummary;
}

