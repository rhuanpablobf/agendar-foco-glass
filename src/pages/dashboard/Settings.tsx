
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Clock, DollarSign, PieChart, User } from 'lucide-react';

const Settings = () => {
  // Dados mockados para o plano atual
  const planData = {
    name: "Gratuito",
    usedAppointments: 3,
    maxAppointments: 5,
    percentUsed: 60,
  };

  return (
    <MainLayout userType="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua empresa
          </p>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company" className="space-y-4 mt-4">
            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>
                  Edite os dados da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input id="companyName" placeholder="BeautySalon" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Telefone</Label>
                    <Input id="companyPhone" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">E-mail</Label>
                    <Input id="companyEmail" placeholder="contato@exemplo.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyCNPJ">CNPJ</Label>
                    <Input id="companyCNPJ" placeholder="00.000.000/0001-00" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Endereço</Label>
                  <Input id="companyAddress" placeholder="Rua Exemplo, 123" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyCity">Cidade</Label>
                    <Input id="companyCity" placeholder="São Paulo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyState">Estado</Label>
                    <Input id="companyState" placeholder="SP" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyZipCode">CEP</Label>
                    <Input id="companyZipCode" placeholder="00000-000" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>Personalização</CardTitle>
                <CardDescription>
                  Personalize a aparência da sua plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">
                  Implementação completa das configurações de aparência em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4 mt-4">
            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>Plano Atual: {planData.name}</CardTitle>
                <CardDescription>
                  Você utilizou {planData.usedAppointments} de {planData.maxAppointments} agendamentos este mês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Progress value={planData.percentUsed} className="h-2" />
                  <div className="flex justify-between mt-1">
                    <p className="text-sm">{planData.usedAppointments}/{planData.maxAppointments} agendamentos</p>
                    <p className="text-sm text-primary font-medium">{planData.percentUsed}% usado</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white/5 border border-white/10 p-4">
                    <CardTitle className="text-lg mb-2">Plano Gratuito</CardTitle>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="mr-2 bg-white/20 rounded-full p-0.5">
                          <Clock className="h-3 w-3" />
                        </span>
                        5 agendamentos/mês
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 bg-white/20 rounded-full p-0.5">
                          <User className="h-3 w-3" />
                        </span>
                        1 profissional
                      </li>
                    </ul>
                    <div className="mt-4 text-lg font-bold">Grátis</div>
                    <div className="text-xs text-muted-foreground">Seu plano atual</div>
                  </Card>
                  
                  <Card className="bg-primary/10 border border-primary/30 p-4">
                    <CardTitle className="text-lg mb-2">Plano Profissional</CardTitle>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                          <Clock className="h-3 w-3" />
                        </span>
                        Agendamentos ilimitados
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                          <User className="h-3 w-3" />
                        </span>
                        Múltiplos profissionais
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                          <PieChart className="h-3 w-3" />
                        </span>
                        Relatórios avançados
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 bg-primary/20 rounded-full p-0.5">
                          <DollarSign className="h-3 w-3" />
                        </span>
                        Gestão financeira
                      </li>
                    </ul>
                    <div className="mt-4 text-lg font-bold">R$49,90<span className="text-xs font-normal">/mês</span></div>
                    <div className="mt-2">
                      <Button className="w-full">Assinar plano</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
