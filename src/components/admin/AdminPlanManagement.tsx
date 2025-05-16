
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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, CalendarDays, PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

type PlanType = {
  id: string;
  name: string;
  price: number;
  maxAppointments: number | 'unlimited';
  maxProfessionals: number | 'unlimited';
  isActive: boolean;
  isDefault: boolean;
};

export const AdminPlanManagement = () => {
  const [plans, setPlans] = useState<PlanType[]>([
    {
      id: '1',
      name: 'Gratuito',
      price: 0,
      maxAppointments: 5,
      maxProfessionals: 1,
      isActive: true,
      isDefault: true,
    },
    {
      id: '2',
      name: 'Profissional',
      price: 49.90,
      maxAppointments: 'unlimited',
      maxProfessionals: 'unlimited',
      isActive: true,
      isDefault: false,
    },
    {
      id: '3',
      name: 'Intermediário',
      price: 29.90,
      maxAppointments: 50,
      maxProfessionals: 3,
      isActive: false,
      isDefault: false,
    }
  ]);

  const [newPlan, setNewPlan] = useState<Omit<PlanType, 'id'>>(
    {
      name: '',
      price: 0,
      maxAppointments: 10,
      maxProfessionals: 1,
      isActive: true,
      isDefault: false,
    }
  );

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);

  const handleAddPlan = () => {
    if (!newPlan.name || newPlan.price < 0) {
      toast.error('Por favor, preencha todos os campos corretamente');
      return;
    }

    const id = Date.now().toString();
    setPlans([...plans, { ...newPlan, id }]);
    setNewPlan({
      name: '',
      price: 0,
      maxAppointments: 10,
      maxProfessionals: 1,
      isActive: true,
      isDefault: false,
    });
    setIsAddDialogOpen(false);
    toast.success('Plano adicionado com sucesso');
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;
    
    const updatedPlans = plans.map(plan => 
      plan.id === editingPlan.id ? editingPlan : plan
    );
    
    setPlans(updatedPlans);
    setEditingPlan(null);
    toast.success('Plano atualizado com sucesso');
  };

  const handleDeletePlan = (id: string) => {
    const planToDelete = plans.find(plan => plan.id === id);
    if (planToDelete?.isDefault) {
      toast.error('Não é possível excluir o plano padrão');
      return;
    }
    
    setPlans(plans.filter(plan => plan.id !== id));
    toast.success('Plano removido com sucesso');
  };

  const handleToggleDefault = (id: string) => {
    const updatedPlans = plans.map(plan => ({
      ...plan,
      isDefault: plan.id === id,
    }));
    
    setPlans(updatedPlans);
    toast.success('Plano padrão atualizado');
  };

  const handleToggleActive = (id: string) => {
    const planToUpdate = plans.find(plan => plan.id === id);
    if (planToUpdate?.isDefault) {
      toast.error('Não é possível desativar o plano padrão');
      return;
    }
    
    const updatedPlans = plans.map(plan => 
      plan.id === id ? { ...plan, isActive: !plan.isActive } : plan
    );
    
    setPlans(updatedPlans);
    const plan = updatedPlans.find(p => p.id === id);
    toast.success(`Plano ${plan?.isActive ? 'ativado' : 'desativado'} com sucesso`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Planos Disponíveis</CardTitle>
            <CardDescription>
              Gerencie os planos de assinatura disponíveis para as empresas
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Plano</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Plano</DialogTitle>
                <DialogDescription>
                  Configure os detalhes do novo plano de assinatura.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Nome do Plano</Label>
                  <Input 
                    id="plan-name" 
                    value={newPlan.name} 
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan-price">Preço Mensal (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="plan-price" 
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-8"
                      value={newPlan.price} 
                      onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Máximo de Agendamentos</Label>
                    <div className="flex items-center">
                      <Label htmlFor="unlimited-appointments" className="mr-2 text-sm">Ilimitado</Label>
                      <Switch 
                        id="unlimited-appointments" 
                        checked={newPlan.maxAppointments === 'unlimited'}
                        onCheckedChange={(checked) => 
                          setNewPlan({...newPlan, maxAppointments: checked ? 'unlimited' : 10})
                        }
                      />
                    </div>
                  </div>
                  
                  {newPlan.maxAppointments !== 'unlimited' && (
                    <div className="pt-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">1</span>
                        <span className="text-sm">100</span>
                      </div>
                      <Slider 
                        value={[(newPlan.maxAppointments as number)]} 
                        min={1} 
                        max={100}
                        step={1}
                        onValueChange={([value]) => setNewPlan({...newPlan, maxAppointments: value})}
                      />
                      <div className="mt-1 text-center text-sm font-medium">
                        {newPlan.maxAppointments} agendamentos
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Máximo de Profissionais</Label>
                    <div className="flex items-center">
                      <Label htmlFor="unlimited-professionals" className="mr-2 text-sm">Ilimitado</Label>
                      <Switch 
                        id="unlimited-professionals" 
                        checked={newPlan.maxProfessionals === 'unlimited'}
                        onCheckedChange={(checked) => 
                          setNewPlan({...newPlan, maxProfessionals: checked ? 'unlimited' : 1})
                        }
                      />
                    </div>
                  </div>
                  
                  {newPlan.maxProfessionals !== 'unlimited' && (
                    <div className="pt-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">1</span>
                        <span className="text-sm">10</span>
                      </div>
                      <Slider 
                        value={[(newPlan.maxProfessionals as number)]} 
                        min={1} 
                        max={10}
                        step={1}
                        onValueChange={([value]) => setNewPlan({...newPlan, maxProfessionals: value})}
                      />
                      <div className="mt-1 text-center text-sm font-medium">
                        {newPlan.maxProfessionals} profissionais
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="plan-active" 
                    checked={newPlan.isActive}
                    onCheckedChange={(checked) => setNewPlan({...newPlan, isActive: checked})}
                  />
                  <Label htmlFor="plan-active">Plano ativo</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddPlan}>Criar Plano</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Plan Dialog */}
          <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Plano</DialogTitle>
                <DialogDescription>
                  Atualize os detalhes do plano de assinatura.
                </DialogDescription>
              </DialogHeader>
              
              {editingPlan && (
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-plan-name">Nome do Plano</Label>
                    <Input 
                      id="edit-plan-name" 
                      value={editingPlan.name} 
                      onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-plan-price">Preço Mensal (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="edit-plan-price" 
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        value={editingPlan.price} 
                        onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Máximo de Agendamentos</Label>
                      <div className="flex items-center">
                        <Label htmlFor="edit-unlimited-appointments" className="mr-2 text-sm">Ilimitado</Label>
                        <Switch 
                          id="edit-unlimited-appointments" 
                          checked={editingPlan.maxAppointments === 'unlimited'}
                          onCheckedChange={(checked) => 
                            setEditingPlan({...editingPlan, maxAppointments: checked ? 'unlimited' : 10})
                          }
                        />
                      </div>
                    </div>
                    
                    {editingPlan.maxAppointments !== 'unlimited' && (
                      <div className="pt-2">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">1</span>
                          <span className="text-sm">100</span>
                        </div>
                        <Slider 
                          value={[(editingPlan.maxAppointments as number)]} 
                          min={1} 
                          max={100}
                          step={1}
                          onValueChange={([value]) => setEditingPlan({...editingPlan, maxAppointments: value})}
                        />
                        <div className="mt-1 text-center text-sm font-medium">
                          {editingPlan.maxAppointments} agendamentos
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Máximo de Profissionais</Label>
                      <div className="flex items-center">
                        <Label htmlFor="edit-unlimited-professionals" className="mr-2 text-sm">Ilimitado</Label>
                        <Switch 
                          id="edit-unlimited-professionals" 
                          checked={editingPlan.maxProfessionals === 'unlimited'}
                          onCheckedChange={(checked) => 
                            setEditingPlan({...editingPlan, maxProfessionals: checked ? 'unlimited' : 1})
                          }
                        />
                      </div>
                    </div>
                    
                    {editingPlan.maxProfessionals !== 'unlimited' && (
                      <div className="pt-2">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">1</span>
                          <span className="text-sm">10</span>
                        </div>
                        <Slider 
                          value={[(editingPlan.maxProfessionals as number)]} 
                          min={1} 
                          max={10}
                          step={1}
                          onValueChange={([value]) => setEditingPlan({...editingPlan, maxProfessionals: value})}
                        />
                        <div className="mt-1 text-center text-sm font-medium">
                          {editingPlan.maxProfessionals} profissionais
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="edit-plan-active" 
                      checked={editingPlan.isActive}
                      disabled={editingPlan.isDefault}
                      onCheckedChange={(checked) => setEditingPlan({...editingPlan, isActive: checked})}
                    />
                    <Label htmlFor="edit-plan-active">
                      Plano ativo
                      {editingPlan.isDefault && (
                        <span className="ml-2 text-xs text-muted-foreground">(Plano padrão sempre está ativo)</span>
                      )}
                    </Label>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancelar</Button>
                <Button onClick={handleUpdatePlan}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Agendamentos</TableHead>
                <TableHead>Profissionais</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      {plan.maxAppointments === 'unlimited' ? 'Ilimitado' : plan.maxAppointments}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      {plan.maxProfessionals === 'unlimited' ? 'Ilimitado' : plan.maxProfessionals}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.isActive}
                      disabled={plan.isDefault}
                      onCheckedChange={() => handleToggleActive(plan.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.isDefault}
                      onCheckedChange={() => handleToggleDefault(plan.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPlan(plan)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={plan.isDefault}
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integração de Pagamentos</CardTitle>
          <CardDescription>
            Configure a integração com plataformas de pagamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-key">Chave API Stripe</Label>
            <Input id="stripe-key" type="password" placeholder="sk_test_..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL de Webhook</Label>
            <Input id="webhook-url" value="https://beautysalon.com/api/webhooks/stripe" readOnly />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="test-mode" defaultChecked />
            <Label htmlFor="test-mode">Modo de teste ativo</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Salvar Configurações</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
