
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2 } from 'lucide-react';

// Define the user type with permissions
interface UserPermission {
  agenda: boolean;
  clients: boolean;
  professionals: boolean;
  services: boolean;
  financial: boolean;
  reports: boolean;
  settings: boolean;
}

interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: UserPermission;
}

// Mock data for demonstration purposes
const mockUsers: CompanyUser[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'Gerente',
    permissions: {
      agenda: true,
      clients: true,
      professionals: true,
      services: true,
      financial: true,
      reports: true,
      settings: true
    }
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@empresa.com',
    role: 'Recepcionista',
    permissions: {
      agenda: true,
      clients: true,
      professionals: false,
      services: false,
      financial: false,
      reports: false,
      settings: false
    }
  }
];

export const UserManagement = () => {
  const [users, setUsers] = useState<CompanyUser[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CompanyUser | null>(null);
  
  // New user template
  const newUserTemplate: CompanyUser = {
    id: '',
    name: '',
    email: '',
    role: '',
    permissions: {
      agenda: false,
      clients: false,
      professionals: false,
      services: false,
      financial: false,
      reports: false,
      settings: false
    }
  };
  
  const [formData, setFormData] = useState<CompanyUser>(newUserTemplate);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePermissionChange = (permission: keyof UserPermission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };
  
  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({...newUserTemplate, id: crypto.randomUUID()});
    setIsDialogOpen(true);
  };
  
  const handleEditUser = (user: CompanyUser) => {
    setCurrentUser(user);
    setFormData(user);
    setIsDialogOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentUser) {
      // Edit existing user
      setUsers(users.map(user => 
        user.id === currentUser.id ? formData : user
      ));
    } else {
      // Add new user
      setUsers([...users, formData]);
    }
    
    setIsDialogOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Usuários</h2>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead className="w-28">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {currentUser ? 'Editar Usuário' : 'Adicionar Usuário'}
              </DialogTitle>
              <DialogDescription>
                {currentUser 
                  ? 'Edite as informações e permissões do usuário'
                  : 'Preencha os dados do novo usuário e defina as permissões de acesso'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                  required 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">E-mail</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                  required 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Cargo</Label>
                <Input 
                  id="role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Permissões</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="agenda" 
                      checked={formData.permissions.agenda} 
                      onCheckedChange={() => handlePermissionChange('agenda')} 
                    />
                    <Label htmlFor="agenda">Agenda</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="clients"
                      checked={formData.permissions.clients} 
                      onCheckedChange={() => handlePermissionChange('clients')} 
                    />
                    <Label htmlFor="clients">Clientes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="professionals"
                      checked={formData.permissions.professionals} 
                      onCheckedChange={() => handlePermissionChange('professionals')} 
                    />
                    <Label htmlFor="professionals">Profissionais</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="services"
                      checked={formData.permissions.services} 
                      onCheckedChange={() => handlePermissionChange('services')} 
                    />
                    <Label htmlFor="services">Serviços</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="financial"
                      checked={formData.permissions.financial} 
                      onCheckedChange={() => handlePermissionChange('financial')} 
                    />
                    <Label htmlFor="financial">Financeiro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="reports"
                      checked={formData.permissions.reports} 
                      onCheckedChange={() => handlePermissionChange('reports')} 
                    />
                    <Label htmlFor="reports">Relatórios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="settings"
                      checked={formData.permissions.settings} 
                      onCheckedChange={() => handlePermissionChange('settings')} 
                    />
                    <Label htmlFor="settings">Configurações</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {currentUser ? 'Salvar Alterações' : 'Adicionar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
