
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar, MoreHorizontal, PenSquare, Trash2, ShieldCheck, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type Permission = 'companies' | 'plans' | 'reports' | 'billing' | 'subadmins';

type SubAdmin = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'subadmin';
  active: boolean;
  lastLogin?: string;
  permissions: Permission[];
};

export const AdminSubadminManagement = () => {
  const [subadmins, setSubadmins] = useState<SubAdmin[]>([
    {
      id: '1',
      name: 'Administrador Principal',
      email: 'admin@beautysalon.com',
      avatar: '',
      role: 'admin',
      active: true,
      lastLogin: '15/05/2023',
      permissions: ['companies', 'plans', 'reports', 'billing', 'subadmins'],
    },
    {
      id: '2',
      name: 'João Silva',
      email: 'joao@beautysalon.com',
      avatar: '',
      role: 'subadmin',
      active: true,
      lastLogin: '14/05/2023',
      permissions: ['companies', 'reports'],
    },
    {
      id: '3',
      name: 'Maria Souza',
      email: 'maria@beautysalon.com',
      avatar: '',
      role: 'subadmin',
      active: false,
      lastLogin: '10/04/2023',
      permissions: ['companies'],
    },
  ]);

  const [newSubadmin, setNewSubadmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    permissions: [] as Permission[],
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubadmin, setEditingSubadmin] = useState<SubAdmin | null>(null);

  const permissionLabels: Record<Permission, string> = {
    companies: 'Gerenciar Empresas',
    plans: 'Gerenciar Planos',
    reports: 'Acessar Relatórios',
    billing: 'Acessar Faturamento',
    subadmins: 'Gerenciar Subadmins',
  };

  const handleAddSubadmin = () => {
    if (!newSubadmin.name || !newSubadmin.email || !newSubadmin.password) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (newSubadmin.password !== newSubadmin.confirmPassword) {
      toast.error('As senhas não correspondem');
      return;
    }

    if (subadmins.some(admin => admin.email === newSubadmin.email)) {
      toast.error('Este e-mail já está em uso');
      return;
    }

    const id = Date.now().toString();
    setSubadmins([...subadmins, {
      id,
      name: newSubadmin.name,
      email: newSubadmin.email,
      role: 'subadmin',
      active: true,
      permissions: newSubadmin.permissions,
    }]);

    setNewSubadmin({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      permissions: [],
    });
    
    setIsAddDialogOpen(false);
    toast.success('Subadministrador adicionado com sucesso');
  };

  const handleUpdateSubadmin = () => {
    if (!editingSubadmin) return;

    const updatedSubadmins = subadmins.map(admin => 
      admin.id === editingSubadmin.id ? editingSubadmin : admin
    );
    
    setSubadmins(updatedSubadmins);
    setEditingSubadmin(null);
    toast.success('Subadministrador atualizado com sucesso');
  };

  const handleDeleteSubadmin = (id: string) => {
    // Prevent deleting the main admin
    const adminToDelete = subadmins.find(admin => admin.id === id);
    if (adminToDelete?.role === 'admin') {
      toast.error('Não é possível excluir o administrador principal');
      return;
    }

    setSubadmins(subadmins.filter(admin => admin.id !== id));
    toast.success('Subadministrador removido com sucesso');
  };

  const handleToggleActive = (id: string) => {
    // Prevent deactivating the main admin
    const adminToToggle = subadmins.find(admin => admin.id === id);
    if (adminToToggle?.role === 'admin') {
      toast.error('Não é possível desativar o administrador principal');
      return;
    }

    const updatedSubadmins = subadmins.map(admin => 
      admin.id === id ? { ...admin, active: !admin.active } : admin
    );
    
    setSubadmins(updatedSubadmins);
    const admin = updatedSubadmins.find(a => a.id === id);
    toast.success(`Subadministrador ${admin?.active ? 'ativado' : 'desativado'} com sucesso`);
  };

  const handlePermissionChange = (permission: Permission) => {
    if (!editingSubadmin) return;

    const permissions = editingSubadmin.permissions.includes(permission)
      ? editingSubadmin.permissions.filter(p => p !== permission)
      : [...editingSubadmin.permissions, permission];

    setEditingSubadmin({ ...editingSubadmin, permissions });
  };

  const handleNewSubadminPermissionChange = (permission: Permission) => {
    const permissions = newSubadmin.permissions.includes(permission)
      ? newSubadmin.permissions.filter(p => p !== permission)
      : [...newSubadmin.permissions, permission];

    setNewSubadmin({ ...newSubadmin, permissions });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Administradores</CardTitle>
            <CardDescription>
              Gerenciar administradores e subadministradores do sistema
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Subadmin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Subadministrador</DialogTitle>
                <DialogDescription>
                  Adicione um novo subadministrador e defina suas permissões.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={newSubadmin.name} 
                    onChange={(e) => setNewSubadmin({...newSubadmin, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newSubadmin.email} 
                    onChange={(e) => setNewSubadmin({...newSubadmin, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newSubadmin.password} 
                    onChange={(e) => setNewSubadmin({...newSubadmin, password: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={newSubadmin.confirmPassword} 
                    onChange={(e) => setNewSubadmin({...newSubadmin, confirmPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Permissões</Label>
                  <div className="space-y-2">
                    {(Object.keys(permissionLabels) as Permission[]).map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission}`}
                          checked={newSubadmin.permissions.includes(permission)}
                          onCheckedChange={() => handleNewSubadminPermissionChange(permission)}
                        />
                        <Label htmlFor={`permission-${permission}`} className="text-sm">
                          {permissionLabels[permission]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddSubadmin}>Criar Subadministrador</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Subadmin Dialog */}
          <Dialog open={!!editingSubadmin} onOpenChange={(open) => !open && setEditingSubadmin(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Subadministrador</DialogTitle>
                <DialogDescription>
                  Atualize as informações e permissões do subadministrador.
                </DialogDescription>
              </DialogHeader>
              
              {editingSubadmin && (
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nome Completo</Label>
                    <Input 
                      id="edit-name" 
                      value={editingSubadmin.name} 
                      onChange={(e) => setEditingSubadmin({...editingSubadmin, name: e.target.value})}
                      disabled={editingSubadmin.role === 'admin'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">E-mail</Label>
                    <Input 
                      id="edit-email" 
                      type="email"
                      value={editingSubadmin.email} 
                      onChange={(e) => setEditingSubadmin({...editingSubadmin, email: e.target.value})}
                      disabled={editingSubadmin.role === 'admin'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-status"
                        checked={editingSubadmin.active}
                        onCheckedChange={(checked) => setEditingSubadmin({...editingSubadmin, active: checked})}
                        disabled={editingSubadmin.role === 'admin'}
                      />
                      <Label htmlFor="edit-status">
                        {editingSubadmin.active ? 'Ativo' : 'Inativo'}
                        {editingSubadmin.role === 'admin' && (
                          <span className="ml-2 text-xs text-muted-foreground">(Admin principal sempre está ativo)</span>
                        )}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Permissões</Label>
                    <div className="space-y-2">
                      {(Object.keys(permissionLabels) as Permission[]).map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-permission-${permission}`}
                            checked={editingSubadmin.permissions.includes(permission)}
                            onCheckedChange={() => handlePermissionChange(permission)}
                            disabled={editingSubadmin.role === 'admin'}
                          />
                          <Label htmlFor={`edit-permission-${permission}`} className="text-sm">
                            {permissionLabels[permission]}
                            {editingSubadmin.role === 'admin' && permission === 'subadmins' && (
                              <span className="ml-2 text-xs text-muted-foreground">(Admin principal sempre tem todas as permissões)</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Redefinir Senha</Label>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.success('Link para redefinição de senha enviado para o email do usuário')}
                    >
                      Enviar E-mail de Redefinição de Senha
                    </Button>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingSubadmin(null)}>Cancelar</Button>
                <Button onClick={handleUpdateSubadmin} disabled={editingSubadmin?.role === 'admin'}>
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subadmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={admin.avatar} />
                        <AvatarFallback>{admin.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {admin.role === 'admin' ? (
                      <Badge className="bg-primary">Admin Principal</Badge>
                    ) : (
                      <Badge variant="outline">Subadmin</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {admin.active ? (
                      <Badge className="bg-green-500">Ativo</Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {admin.role === 'admin' ? (
                      <Badge className="bg-primary/20 text-primary">Acesso Total</Badge>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {admin.lastLogin || 'Nunca'}
                    </div>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => setEditingSubadmin(admin)}>
                          <PenSquare className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(admin.id)}
                          disabled={admin.role === 'admin'}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          {admin.active ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteSubadmin(admin.id)}
                          disabled={admin.role === 'admin'}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
