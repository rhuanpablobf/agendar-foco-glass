
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Receipt, 
  CreditCard, 
  Users, 
  Calendar
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { TransactionForm } from '@/components/financial/TransactionForm';
import { TransactionList } from '@/components/financial/TransactionList';
import { DailyClosing } from '@/components/financial/DailyClosing';
import { CommissionReport } from '@/components/financial/CommissionReport';
import { Transaction, TransactionFormData, DailyBalance, Commission } from '@/types/financial';

// Mock data for demo purposes
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 150.00,
    date: new Date(),
    description: 'Corte de cabelo',
    category: 'service',
    paymentMethod: 'credit_card',
    relatedServiceId: 's1',
    relatedProfessionalId: 'p1',
    relatedClientId: 'c1',
    commissionAmount: 45,
    status: 'completed',
  },
  {
    id: '2',
    type: 'income',
    amount: 80.00,
    date: new Date(),
    description: 'Manicure',
    category: 'service',
    paymentMethod: 'pix',
    relatedServiceId: 's2',
    relatedProfessionalId: 'p2',
    relatedClientId: 'c2',
    commissionAmount: 24,
    status: 'completed',
  },
  {
    id: '3',
    type: 'expense',
    amount: 200.00,
    date: new Date(),
    description: 'Produtos de cabelo',
    category: 'supplies',
    paymentMethod: 'cash',
    status: 'completed',
  },
  {
    id: '4',
    type: 'expense',
    amount: 50.00,
    date: new Date(),
    description: 'Material de limpeza',
    category: 'supplies',
    paymentMethod: 'cash',
    status: 'completed',
  },
];

const mockCommissions: Commission[] = [
  {
    professionalId: 'p1',
    professionalName: 'João Silva',
    serviceId: 's1',
    serviceName: 'Corte de cabelo',
    date: new Date(),
    baseAmount: 150.00,
    percentage: 30,
    commissionAmount: 45.00,
    isPaid: false,
  },
  {
    professionalId: 'p2',
    professionalName: 'Maria Souza',
    serviceId: 's2',
    serviceName: 'Manicure',
    date: new Date(),
    baseAmount: 80.00,
    percentage: 30,
    commissionAmount: 24.00,
    isPaid: true,
  },
  {
    professionalId: 'p1',
    professionalName: 'João Silva',
    serviceId: 's3',
    serviceName: 'Barba',
    date: new Date(Date.now() - 86400000), // yesterday
    baseAmount: 50.00,
    percentage: 30,
    commissionAmount: 15.00,
    isPaid: true,
  }
];

const mockDailyBalance: DailyBalance = {
  date: new Date(),
  openingBalance: 500.00,
  closingBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
  isClosed: false,
};

const Financial = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [dailyBalance, setDailyBalance] = useState<DailyBalance>(mockDailyBalance);
  const [showNewTransactionDialog, setShowNewTransactionDialog] = useState(false);
  
  // Calculate the totals for the daily balance
  const todaysIncome = transactions
    .filter(t => 
      t.type === 'income' && 
      t.status === 'completed' &&
      new Date(t.date).toDateString() === new Date().toDateString()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const todaysExpense = transactions
    .filter(t => 
      t.type === 'expense' && 
      t.status === 'completed' &&
      new Date(t.date).toDateString() === new Date().toDateString()
    )
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentDailyBalance: DailyBalance = {
    ...dailyBalance,
    totalIncome: todaysIncome,
    totalExpense: todaysExpense,
    closingBalance: dailyBalance.openingBalance + todaysIncome - todaysExpense
  };

  const handleCreateTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      ...data,
      status: 'completed',
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowNewTransactionDialog(false);
    toast.success(`${data.type === 'income' ? 'Receita' : 'Despesa'} registrada com sucesso!`);
  };
  
  const handleDailyClosing = (notes: string) => {
    setDailyBalance({
      ...currentDailyBalance,
      isClosed: true,
      closedAt: new Date(),
      closedBy: 'current-user',
      notes,
    });
  };

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

          <Dialog open={showNewTransactionDialog} onOpenChange={setShowNewTransactionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
                <DialogDescription>
                  Registre uma nova entrada ou saída financeira
                </DialogDescription>
              </DialogHeader>
              
              <TransactionForm onSubmit={handleCreateTransaction} buttonText="Registrar" />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="transactions">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="transactions" className="flex gap-2 items-center justify-center">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Transações</span>
            </TabsTrigger>
            <TabsTrigger value="closing" className="flex gap-2 items-center justify-center">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Fechamento</span>
            </TabsTrigger>
            <TabsTrigger value="commissions" className="flex gap-2 items-center justify-center">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Comissões</span>
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="flex gap-2 items-center justify-center">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="border-none p-0 pt-4">
            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>Movimentações Financeiras</CardTitle>
                <CardDescription>
                  Controle de entradas e saídas financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionList 
                  transactions={transactions} 
                  onTransactionSelect={(transaction) => {
                    console.log('Selected transaction:', transaction);
                    // Future functionality: edit, delete, mark as paid/unpaid
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="closing" className="border-none p-0 pt-4">
            <DailyClosing 
              transactions={transactions}
              currentBalance={currentDailyBalance}
              onClosingConfirm={handleDailyClosing}
            />
          </TabsContent>
          
          <TabsContent value="commissions" className="border-none p-0 pt-4">
            <CommissionReport commissions={commissions} />
          </TabsContent>
          
          <TabsContent value="payment-methods" className="border-none p-0 pt-4">
            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>
                  Configure formas de pagamento aceitas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['credit_card', 'debit_card', 'pix', 'cash'].map((method) => (
                    <Card key={method} className="bg-white/5 hover:bg-white/10 cursor-pointer">
                      <CardContent className="p-6 flex items-center gap-4">
                        {method === 'credit_card' && <CreditCard className="h-8 w-8" />}
                        {method === 'debit_card' && <CreditCard className="h-8 w-8" />}
                        {method === 'pix' && <Receipt className="h-8 w-8" />}
                        {method === 'cash' && <Receipt className="h-8 w-8" />}
                        <div>
                          <h3 className="font-medium">
                            {method === 'credit_card' && 'Cartão de Crédito'}
                            {method === 'debit_card' && 'Cartão de Débito'}
                            {method === 'pix' && 'PIX'}
                            {method === 'cash' && 'Dinheiro'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {method === 'credit_card' && 'Aceito em todas as máquinas'}
                            {method === 'debit_card' && 'Aceito em todas as máquinas'}
                            {method === 'pix' && 'Pagamento instantâneo'}
                            {method === 'cash' && 'Pagamento em espécie'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Financial;
