import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Clock, DollarSign, ExternalLink, Globe, PieChart, User } from 'lucide-react';
import ColorPicker from '@/components/settings/ColorPicker';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeButton } from '@/components/subscription/UpgradeButton';
import { Progress } from '@/components/ui/progress';

const Settings = () => {
  // Subscription data
  const { subscriptionStatus, planDetails, isLoading } = useSubscription();

  // Company data state
  const [companyData, setCompanyData] = useState({
    name: "BeautySalon",
    phone: "(11) 99999-9999",
    email: "contato@beautysalon.com",
    cnpj: "12.345.678/0001-00",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01000-000",
    logo: "/placeholder.svg"
  });

  // Public booking link state
  const [bookingLink, setBookingLink] = useState({
    enabled: true,
    slug: "beautysalon",
    fullUrl: "https://agenda.beautysalon.com/beautysalon"
  });

  // Theme customization state
  const [themeColors, setThemeColors] = useState({
    primary: "#8B5CF6",
    secondary: "#D946EF",
    accent: "#F97316"
  });

  const handleCompanyDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [id.replace('company', '').toLowerCase()]: value
    }));
  };

  const handleBookingLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBookingLink(prev => ({
      ...prev,
      slug: value,
      fullUrl: `https://agenda.beautysalon.com/${value}`
    }));
  };

  const handleToggleBookingLink = (checked: boolean) => {
    setBookingLink(prev => ({
      ...prev,
      enabled: checked
    }));
  };

  const handleColorChange = (color: string, type: 'primary' | 'secondary' | 'accent') => {
    setThemeColors(prev => ({
      ...prev,
      [type]: color
    }));
  };

  const handleSaveCompanyData = () => {
    toast.success("Dados da empresa salvos com sucesso!");
  };

  const handleSaveAppearance = () => {
    toast.success("Aparência personalizada salva com sucesso!");
  };

  const handleCopyBookingLink = () => {
    navigator.clipboard.writeText(bookingLink.fullUrl);
    toast.success("Link copiado para a área de transferência!");
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
                    <Input 
                      id="companyName" 
                      value={companyData.name} 
                      onChange={handleCompanyDataChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Telefone</Label>
                    <Input 
                      id="companyPhone" 
                      value={companyData.phone} 
                      onChange={handleCompanyDataChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">E-mail</Label>
                    <Input 
                      id="companyEmail" 
                      value={companyData.email} 
                      onChange={handleCompanyDataChange} 
                      type="email" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyCNPJ">CNPJ</Label>
                    <Input 
                      id="companyCNPJ" 
                      value={companyData.cnpj} 
                      onChange={handleCompanyDataChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Endereço</Label>
                  <Input 
                    id="companyAddress" 
                    value={companyData.address} 
                    onChange={handleCompanyDataChange} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyCity">Cidade</Label>
                    <Input 
                      id="companyCity" 
                      value={companyData.city} 
                      onChange={handleCompanyDataChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyState">Estado</Label>
                    <Input 
                      id="companyState" 
                      value={companyData.state} 
                      onChange={handleCompanyDataChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyZipCode">CEP</Label>
                    <Input 
                      id="companyZipCode" 
                      value={companyData.zipCode} 
                      onChange={handleCompanyDataChange} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveCompanyData}>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>Link para Agendamentos</CardTitle>
                <CardDescription>
                  Configure o link público para seus clientes agendarem serviços online
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="booking-link-active" 
                    checked={bookingLink.enabled} 
                    onCheckedChange={handleToggleBookingLink}
                  />
                  <Label htmlFor="booking-link-active">
                    {bookingLink.enabled ? "Link de agendamento ativo" : "Link de agendamento inativo"}
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-slug">Nome personalizado</Label>
                  <div className="flex space-x-2">
                    <div className="flex-grow flex items-center rounded-md border border-input bg-background px-3 text-muted-foreground">
                      <span className="hidden sm:inline">https://agenda.beautysalon.com/</span>
                      <span className="sm:hidden">agenda.../</span>
                    </div>
                    <Input 
                      id="booking-slug" 
                      value={bookingLink.slug} 
                      onChange={handleBookingLinkChange} 
                      className="max-w-[200px]" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Link completo</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-grow rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {bookingLink.fullUrl}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleCopyBookingLink}
                      title="Copiar link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center pt-2">
                  <Globe className="text-muted-foreground mr-2 h-4 w-4" />
                  <p className="text-xs text-muted-foreground">
                    Seus clientes podem acessar este link para agendar serviços online
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>Personalização</CardTitle>
                <CardDescription>
                  Personalize as cores e a aparência da sua plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <ColorPicker 
                    label="Cor Primária" 
                    value={themeColors.primary}
                    onChange={(color) => handleColorChange(color, 'primary')}
                  />
                  
                  <ColorPicker 
                    label="Cor Secundária" 
                    value={themeColors.secondary}
                    onChange={(color) => handleColorChange(color, 'secondary')}
                  />
                  
                  <ColorPicker 
                    label="Cor de Destaque" 
                    value={themeColors.accent}
                    onChange={(color) => handleColorChange(color, 'accent')}
                  />
                </div>
                
                <div className="pt-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Visualização</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className="p-4 rounded-lg h-20 flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        Primária
                      </div>
                      <div 
                        className="p-4 rounded-lg h-20 flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: themeColors.secondary }}
                      >
                        Secundária
                      </div>
                      <div 
                        className="p-4 rounded-lg h-20 flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: themeColors.accent }}
                      >
                        Destaque
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveAppearance}>Salvar Aparência</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4 mt-4">
            <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
              <CardHeader>
                <CardTitle>
                  Plano Atual: {isLoading ? 'Carregando...' : subscriptionStatus?.plan}
                </CardTitle>
                <CardDescription>
                  {isLoading ? 'Carregando informações do seu plano...' : (
                    subscriptionStatus?.plan === 'Gratuito' 
                      ? `Você utilizou ${subscriptionStatus.usedAppointments} de ${subscriptionStatus.maxAppointments} agendamentos este mês` 
                      : 'Seu plano inclui agendamentos ilimitados'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isLoading && subscriptionStatus?.plan === 'Gratuito' && (
                  <div>
                    <Progress value={subscriptionStatus.percentUsed} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <p className="text-sm">{subscriptionStatus.usedAppointments}/{subscriptionStatus.maxAppointments} agendamentos</p>
                      <p className="text-sm text-primary font-medium">{subscriptionStatus.percentUsed}% usado</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={`${subscriptionStatus?.plan === 'Gratuito' ? 'bg-white/5 border border-white/10' : 'bg-primary/10 border border-primary/30'} p-4`}>
                    <CardTitle className="text-lg mb-2">Plano Gratuito</CardTitle>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="mr-2 bg-white/20 rounded-full p-0.5">
                          <Clock className="h-3 w-3" />
                        </span>
                        {planDetails?.Gratuito.maxAppointments} agendamentos/mês
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 bg-white/20 rounded-full p-0.5">
                          <User className="h-3 w-3" />
                        </span>
                        {planDetails?.Gratuito.maxProfessionals} profissional
                      </li>
                    </ul>
                    <div className="mt-4 text-lg font-bold">Grátis</div>
                    {subscriptionStatus?.plan === 'Gratuito' && (
                      <div className="text-xs text-muted-foreground">Seu plano atual</div>
                    )}
                  </Card>
                  
                  <Card className={`${subscriptionStatus?.plan === 'Profissional' ? 'bg-primary/10 border border-primary/30' : 'bg-white/5 border border-white/10'} p-4`}>
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
                    {subscriptionStatus?.plan === 'Profissional' && (
                      <div className="text-xs text-muted-foreground">Seu plano atual</div>
                    )}
                  </Card>
                </div>

                {subscriptionStatus?.plan === 'Gratuito' && (
                  <div className="flex justify-end">
                    <UpgradeButton label="Assinar plano" />
                  </div>
                )}

                {subscriptionStatus?.plan === 'Profissional' && (
                  <div className="flex justify-end">
                    <Button variant="outline">
                      Gerenciar assinatura
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {subscriptionStatus?.plan === 'Profissional' && (
              <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>
                    Últimas faturas e cobranças do seu plano
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Data</th>
                          <th className="py-2 px-4 text-left">Valor</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Recibo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">16/05/2023</td>
                          <td className="py-2 px-4">R$ 49,90</td>
                          <td className="py-2 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-200">
                              Pago
                            </span>
                          </td>
                          <td className="py-2 px-4">
                            <Button variant="link" className="p-0 h-auto">Ver recibo</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">16/04/2023</td>
                          <td className="py-2 px-4">R$ 49,90</td>
                          <td className="py-2 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-200">
                              Pago
                            </span>
                          </td>
                          <td className="py-2 px-4">
                            <Button variant="link" className="p-0 h-auto">Ver recibo</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
