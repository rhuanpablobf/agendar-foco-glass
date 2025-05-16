
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Transaction, 
  TransactionType, 
  PaymentMethod 
} from '@/types/financial';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  CreditCard,
  Wallet,
  Banknote,
  Receipt
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionSelect?: (transaction: Transaction) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getPaymentMethodIcon = (method?: PaymentMethod) => {
  switch (method) {
    case 'credit_card':
    case 'debit_card':
      return <CreditCard className="h-4 w-4" />;
    case 'pix':
      return <Receipt className="h-4 w-4" />;
    case 'cash':
      return <Banknote className="h-4 w-4" />;
    default:
      return <Wallet className="h-4 w-4" />;
  }
};

const getPaymentMethodLabel = (method?: PaymentMethod): string => {
  const methods: Record<PaymentMethod, string> = {
    cash: 'Dinheiro',
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
  };
  return method ? methods[method] : 'N/A';
};

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  onTransactionSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn("p-4", "bg-white/5 hover:bg-white/10")}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Entradas</p>
              <p className="text-2xl font-semibold text-green-500">{formatCurrency(totalIncome)}</p>
            </div>
            <ArrowUpCircle className="h-10 w-10 text-green-500/30" />
          </div>
        </Card>
        
        <Card className={cn("p-4", "bg-white/5 hover:bg-white/10")}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Saídas</p>
              <p className="text-2xl font-semibold text-red-500">{formatCurrency(totalExpense)}</p>
            </div>
            <ArrowDownCircle className="h-10 w-10 text-red-500/30" />
          </div>
        </Card>
        
        <Card className={cn("p-4", "bg-white/5 hover:bg-white/10")}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className={cn(
                "text-2xl font-semibold", 
                balance >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              balance >= 0 ? "bg-green-500/10" : "bg-red-500/10"
            )}>
              <span className={cn(
                "text-xl font-bold",
                balance >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {balance >= 0 ? "+" : "-"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={typeFilter} onValueChange={(value: 'income' | 'expense' | 'all') => setTypeFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className="cursor-pointer hover:bg-accent/20"
                  onClick={() => onTransactionSelect?.(transaction)}
                >
                  <TableCell>
                    {format(transaction.date, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.status === 'pending' && <Badge variant="outline" className="text-xs">Pendente</Badge>}
                      {transaction.status === 'cancelled' && <Badge variant="destructive" className="text-xs">Cancelado</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="text-sm">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    transaction.type === 'income' ? "text-green-500" : "text-red-500"
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
