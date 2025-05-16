
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  FileText,
  ChartLine,
  Calendar
} from 'lucide-react';
import RevenueReport from '@/components/reports/RevenueReport';
import MonthlyComparison from '@/components/reports/MonthlyComparison';
import AttendanceReport from '@/components/reports/AttendanceReport';
import { Transaction } from '@/types/financial';
import { v4 as uuidv4 } from 'uuid';

// Mock data for professionals
const mockProfessionals = [
  { id: 'p1', name: 'João Silva' },
  { id: 'p2', name: 'Maria Souza' },
  { id: 'p3', name: 'Ana Oliveira' },
];

// Mock data for services
const mockServices = [
  { id: 's1', name: 'Corte de Cabelo', price: 150 },
  { id: 's2', name: 'Manicure', price: 80 },
  { id: 's3', name: 'Barba', price: 50 },
  { id: 's4', name: 'Coloração', price: 200 },
  { id: 's5', name: 'Design de Sobrancelhas', price: 70 },
];

// Generate mock transactions
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const currentDate = new Date();
  
  // Generate some transactions for past months
  for (let i = 0; i < 50; i++) {
    const monthOffset = Math.floor(Math.random() * 6); // Transactions from up to 6 months ago
    const dayOffset = Math.floor(Math.random() * 30); // Random day in the month
    
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - monthOffset,
      currentDate.getDate() - dayOffset
    );
    
    const isIncome = Math.random() > 0.3; // 70% are income
    
    if (isIncome) {
      // Random service and professional
      const serviceIndex = Math.floor(Math.random() * mockServices.length);
      const professionalIndex = Math.floor(Math.random() * mockProfessionals.length);
      const service = mockServices[serviceIndex];
      const professional = mockProfessionals[professionalIndex];
      
      // Random price variation around the service price
      const priceVariation = 1 + (Math.random() * 0.2 - 0.1); // +-10% variation
      const amount = Math.round(service.price * priceVariation);
      
      transactions.push({
        id: uuidv4(),
        type: 'income',
        amount,
        date,
        description: service.name,
        category: 'service',
        paymentMethod: ['cash', 'credit_card', 'debit_card', 'pix'][Math.floor(Math.random() * 4)] as any,
        relatedServiceId: service.id,
        relatedProfessionalId: professional.id,
        relatedClientId: `c${Math.floor(Math.random() * 10) + 1}`,
        commissionAmount: Math.round(amount * 0.3),
        status: Math.random() > 0.05 ? 'completed' : 'cancelled', // 5% chance of cancelled
      });
    } else {
      // Expenses
      const expenseCategories = ['supplies', 'rent', 'utilities', 'marketing', 'staff'];
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const amount = Math.floor(Math.random() * 500) + 50; // Between 50 and 550
      
      transactions.push({
        id: uuidv4(),
        type: 'expense',
        amount,
        date,
        description: `${category} expense`,
        category,
        paymentMethod: ['cash', 'credit_card', 'pix'][Math.floor(Math.random() * 3)] as any,
        status: 'completed',
      });
    }
  }
  
  return transactions;
};

// Generate mock appointments
const generateMockAppointments = () => {
  const appointments = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 100; i++) {
    const monthOffset = Math.floor(Math.random() * 3); // Appointments from up to 3 months ago
    const dayOffset = Math.floor(Math.random() * 30); // Random day in the month
    
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - monthOffset,
      currentDate.getDate() - dayOffset
    );
    
    // Random service and professional
    const serviceIndex = Math.floor(Math.random() * mockServices.length);
    const professionalIndex = Math.floor(Math.random() * mockProfessionals.length);
    const service = mockServices[serviceIndex];
    const professional = mockProfessionals[professionalIndex];
    
    // Status distribution: 75% completed, 15% cancelled, 10% no_show
    const statusRandom = Math.random();
    let status;
    if (statusRandom < 0.75) status = 'completed';
    else if (statusRandom < 0.90) status = 'cancelled';
    else status = 'no_show';
    
    appointments.push({
      id: uuidv4(),
      professionalId: professional.id,
      professionalName: professional.name,
      serviceId: service.id,
      serviceName: service.name,
      clientId: `c${Math.floor(Math.random() * 10) + 1}`,
      clientName: `Client ${Math.floor(Math.random() * 10) + 1}`,
      date,
      status,
    });
  }
  
  return appointments;
};

const Reports = () => {
  const [transactions] = useState<Transaction[]>(generateMockTransactions());
  const [appointments] = useState(generateMockAppointments());
  
  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize dados e métricas da sua empresa
          </p>
        </div>

        <Tabs defaultValue="revenue">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="revenue" className="flex gap-2 items-center justify-center">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Faturamento</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex gap-2 items-center justify-center">
              <ChartLine className="h-4 w-4" />
              <span className="hidden sm:inline">Mês a Mês</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex gap-2 items-center justify-center">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Presença</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="pt-6">
            <RevenueReport 
              transactions={transactions} 
              professionals={mockProfessionals}
              services={mockServices}
            />
          </TabsContent>
          
          <TabsContent value="monthly" className="pt-6">
            <MonthlyComparison transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="attendance" className="pt-6">
            <AttendanceReport 
              appointments={appointments}
              professionals={mockProfessionals}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
