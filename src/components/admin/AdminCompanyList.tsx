
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Company = {
  id: string;
  name: string;
  email: string;
  plan: 'Gratuito' | 'Profissional';
  usedAppointments: number;
  maxAppointments: number;
  status: 'active' | 'inactive' | 'pending';
  registeredAt: string;
  lastPayment: string;
};

export const AdminCompanyList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for companies
  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'Salão Belle Femme',
      email: 'contato@bellefemme.com',
      plan: 'Gratuito',
      usedAppointments: 3,
      maxAppointments: 5,
      status: 'active',
      registeredAt: '15/05/2023',
      lastPayment: 'N/A',
    },
    {
      id: '2',
      name: 'Barbearia Modern Cut',
      email: 'admin@moderncut.com',
      plan: 'Profissional',
      usedAppointments: 45,
      maxAppointments: 999,
      status: 'active',
      registeredAt: '14/05/2023',
      lastPayment: '01/06/2023',
    },
    {
      id: '3',
      name: 'Espaço Beleza Total',
      email: 'contato@belezatotal.com',
      plan: 'Gratuito',
      usedAppointments: 5,
      maxAppointments: 5,
      status: 'active',
      registeredAt: '12/05/2023',
      lastPayment: 'N/A',
    },
    {
      id: '4',
      name: 'Studio Hair Design',
      email: 'studio@hairdesign.com',
      plan: 'Profissional',
      usedAppointments: 78,
      maxAppointments: 999,
      status: 'inactive',
      registeredAt: '10/04/2023',
      lastPayment: '10/05/2023',
    },
    {
      id: '5',
      name: 'Manicure Express',
      email: 'agendamento@manicure.com',
      plan: 'Gratuito',
      usedAppointments: 4,
      maxAppointments: 5,
      status: 'pending',
      registeredAt: '05/06/2023',
      lastPayment: 'N/A',
    },
  ];

  const filteredCompanies = mockCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inativa</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresas Registradas</CardTitle>
        <CardDescription>
          Gerencie todas as empresas registradas na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button>Adicionar Empresa</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Agendamentos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Último Pagamento</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhuma empresa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-xs text-muted-foreground">{company.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={company.plan === 'Profissional' ? 'border-primary text-primary' : ''}
                      >
                        {company.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {company.usedAppointments}/{company.maxAppointments === 999 ? '∞' : company.maxAppointments}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell>{company.registeredAt}</TableCell>
                    <TableCell>{company.lastPayment}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar empresa</DropdownMenuItem>
                          <DropdownMenuItem>Alterar plano</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Desativar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
