
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, PieChart, DollarSign, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export const SubscriptionManagement = () => {
  const { subscriptionStatus, planDetails, manageSubscription, upgradeToProfessional, downgradeToFree, isProcessingPayment } = useSubscription();
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);

  if (!subscriptionStatus) return null;

  const isProfessional = subscriptionStatus.plan === 'Profissional';
  const formattedNextReset = subscriptionStatus.nextResetDate ? 
    format(new Date(subscriptionStatus.nextResetDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Minha Assinatura</h2>
        <p className="text-muted-foreground">
          Gerencie sua assinatura e visualize os detalhes do seu plano atual
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`border ${isProfessional ? 'border-primary/30' : 'border-white/20'} bg-white/10 backdrop-blur-sm shadow-glass`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Seu plano atual</span>
              {isProfessional && (
                <span className="text-xs bg-primary/20 text-primary-foreground px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 inline mr-1" /> Ativo
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Plano {subscriptionStatus.plan}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">
              {isProfessional ? 
                `R$${planDetails.Profissional.price.toFixed(2)}/mês` : 
                'Grátis'}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Inclui:</p>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {isProfessional ? 'Agendamentos ilimitados' : `${planDetails.Gratuito.maxAppointments} agendamentos/mês`}
                </li>
                <li className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  {isProfessional ? 'Profissionais ilimitados' : `${planDetails.Gratuito.maxProfessionals} profissional`}
                </li>
                {isProfessional && (
                  <>
                    <li className="flex items-center text-sm">
                      <PieChart className="mr-2 h-4 w-4 text-muted-foreground" />
                      Relatórios avançados
                    </li>
                    <li className="flex items-center text-sm">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      Gestão financeira completa
                    </li>
                  </>
                )}
              </ul>
            </div>

            {!isProfessional && (
              <div className="flex flex-col space-y-2">
                <p className="text-sm">
                  <span className="font-medium">{subscriptionStatus.usedAppointments}</span> de {subscriptionStatus.maxAppointments} agendamentos usados neste mês
                </p>
                <p className="text-xs text-muted-foreground">
                  Renova automaticamente em {formattedNextReset}
                </p>
              </div>
            )}

            <div className="pt-2">
              {isProfessional ? (
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={manageSubscription}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Gerenciar método de pagamento'
                    )}
                  </Button>
                  
                  <Dialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full text-red-400 hover:text-red-300">
                        Cancelar assinatura
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancelar assinatura</DialogTitle>
                        <DialogDescription>
                          Tem certeza que deseja cancelar sua assinatura do plano Profissional? Você perderá acesso a todos os recursos premium.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Ao cancelar sua assinatura:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Você será rebaixado para o plano Gratuito</li>
                          <li>Perderá acesso a relatórios avançados</li>
                          <li>Será limitado a 5 agendamentos por mês</li>
                          <li>Poderá gerenciar apenas 1 profissional</li>
                          <li>Perderá acesso à gestão financeira</li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDowngradeDialog(false)}>
                          Cancelar
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            downgradeToFree();
                            setShowDowngradeDialog(false);
                          }}
                        >
                          Confirmar cancelamento
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={upgradeToProfessional}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Atualizar para o plano Profissional
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
          <CardHeader>
            <CardTitle>Histórico de pagamentos</CardTitle>
            <CardDescription>
              Visualize suas faturas e histórico de pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProfessional ? (
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium">Data</th>
                      <th className="px-4 py-2 text-left text-xs font-medium">Valor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium">Fatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 text-sm">{format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</td>
                      <td className="px-4 py-2 text-sm">R$ 49,90</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                          Pago
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Ver
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-muted/30 p-3 rounded-full mb-3">
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Nenhum pagamento</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Você está usando o plano gratuito. Atualize para o plano Profissional para acessar todos os recursos.
                </p>
                <Button className="mt-4" variant="outline" onClick={upgradeToProfessional}>
                  Atualizar agora
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/20 bg-white/5 backdrop-blur-sm shadow-glass">
        <CardHeader>
          <CardTitle>Comparação de planos</CardTitle>
          <CardDescription>
            Veja todas as diferenças entre os planos disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-2">Recurso</th>
                  <th className="text-center p-2">Plano Gratuito</th>
                  <th className="text-center p-2 bg-primary/5">Plano Profissional</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-medium">Agendamentos</td>
                  <td className="text-center p-2">5 / mês</td>
                  <td className="text-center p-2 bg-primary/5">Ilimitados</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-medium">Profissionais</td>
                  <td className="text-center p-2">1</td>
                  <td className="text-center p-2 bg-primary/5">Ilimitados</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-medium">Gestão financeira</td>
                  <td className="text-center p-2">❌</td>
                  <td className="text-center p-2 bg-primary/5">✅</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-medium">Relatórios avançados</td>
                  <td className="text-center p-2">❌</td>
                  <td className="text-center p-2 bg-primary/5">✅</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-medium">Suporte ao cliente</td>
                  <td className="text-center p-2">Básico</td>
                  <td className="text-center p-2 bg-primary/5">Prioritário</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-medium">Preço</td>
                  <td className="text-center p-2">Grátis</td>
                  <td className="text-center p-2 bg-primary/5">R$49,90/mês</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
