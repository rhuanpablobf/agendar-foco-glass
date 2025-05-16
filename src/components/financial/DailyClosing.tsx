
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Transaction, DailyBalance } from '@/types/financial';
import { CalendarIcon, Lock, Unlock, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface DailyClosingProps {
  transactions: Transaction[];
  currentBalance: DailyBalance;
  onClosingConfirm: (notes: string) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const DailyClosing: React.FC<DailyClosingProps> = ({ 
  transactions, 
  currentBalance,
  onClosingConfirm
}) => {
  const [date, setDate] = useState<Date>(currentBalance.date || new Date());
  const [closingNotes, setClosingNotes] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirmClosing = () => {
    onClosingConfirm(closingNotes);
    setShowDialog(false);
    toast.success('Fechamento do caixa realizado com sucesso!');
  };

  const todaysIncome = transactions
    .filter(t => 
      t.type === 'income' && 
      t.status === 'completed' &&
      format(t.date, 'yyyy-MM-dd') === format(currentBalance.date, 'yyyy-MM-dd')
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const todaysExpense = transactions
    .filter(t => 
      t.type === 'expense' && 
      t.status === 'completed' &&
      format(t.date, 'yyyy-MM-dd') === format(currentBalance.date, 'yyyy-MM-dd')
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const paymentMethodSummary = transactions
    .filter(t => 
      t.status === 'completed' &&
      format(t.date, 'yyyy-MM-dd') === format(currentBalance.date, 'yyyy-MM-dd')
    )
    .reduce((acc, t) => {
      const method = t.paymentMethod || 'unknown';
      if (!acc[method]) {
        acc[method] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[method].income += t.amount;
      } else {
        acc[method].expense += t.amount;
      }
      return acc;
    }, {} as Record<string, { income: number, expense: number }>);

  const paymentMethods = {
    cash: 'Dinheiro',
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    unknown: 'Outros'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fechamento diário</CardTitle>
            <CardDescription>
              {format(currentBalance.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 flex flex-col">
            <div className="text-sm text-muted-foreground">Saldo Inicial</div>
            <div className="text-xl font-medium">{formatCurrency(currentBalance.openingBalance)}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 flex flex-col">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ArrowUp className="h-4 w-4 text-green-500" /> Entradas
            </div>
            <div className="text-xl font-medium text-green-500">
              {formatCurrency(todaysIncome)}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 flex flex-col">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ArrowDown className="h-4 w-4 text-red-500" /> Saídas
            </div>
            <div className="text-xl font-medium text-red-500">
              {formatCurrency(todaysExpense)}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="payments">Formas de Pagamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Saldo Inicial</span>
                    <span>{formatCurrency(currentBalance.openingBalance)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-500">
                    <span className="text-muted-foreground">Total Entradas</span>
                    <span>+ {formatCurrency(todaysIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-500">
                    <span className="text-muted-foreground">Total Saídas</span>
                    <span>- {formatCurrency(todaysExpense)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-medium">
                    <span>Saldo Final</span>
                    <span className={currentBalance.closingBalance >= 0 ? "text-green-500" : "text-red-500"}>
                      {formatCurrency(currentBalance.openingBalance + todaysIncome - todaysExpense)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {Object.entries(paymentMethodSummary).map(([method, values]) => (
                    <div key={method} className="space-y-2">
                      <div className="font-medium">{paymentMethods[method as keyof typeof paymentMethods]}</div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Entradas</span>
                        <span className="text-green-500">{formatCurrency(values.income)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Saídas</span>
                        <span className="text-red-500">{formatCurrency(values.expense)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Saldo</span>
                        <span className={(values.income - values.expense) >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatCurrency(values.income - values.expense)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full"
              disabled={currentBalance.isClosed}
            >
              {currentBalance.isClosed ? (
                <>
                  <Lock className="mr-2 h-4 w-4" /> Caixa Fechado
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" /> Fechar Caixa
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fechar Caixa</DialogTitle>
              <DialogDescription>
                Confirme o fechamento de caixa do dia {format(date, "dd/MM/yyyy")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="font-medium">Conferência de valores</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Dinheiro em caixa</p>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diferença</p>
                    <p className="py-2 px-3 border rounded-md bg-muted/30">R$ 0,00</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="text-sm font-medium">
                  Observações
                </label>
                <Textarea
                  id="notes"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Adicione observações sobre o fechamento do caixa..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmClosing}>
                Confirmar Fechamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
