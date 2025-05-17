
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function PlanLimitAlert() {
  return (
    <Card className="bg-red-500/20 border border-red-300/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="text-red-300">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-red-200">Limite de agendamentos atingido</p>
            <p className="text-sm text-red-300/80">
              Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar usando o sistema.
            </p>
          </div>
          <div className="ml-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Atualizar plano</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border border-white/20 bg-white/10 backdrop-blur-sm shadow-glass">
                <DialogHeader>
                  <DialogTitle>Atualize para o Plano Profissional</DialogTitle>
                  <DialogDescription>
                    Desbloqueie recursos ilimitados e aproveite ao máximo o BeautySalon
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/5 border border-white/10 p-4">
                      <DialogTitle className="text-lg mb-2">Plano Gratuito</DialogTitle>
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
                      <DialogTitle className="text-lg mb-2">Plano Profissional</DialogTitle>
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
                      </ul>
                      <div className="mt-4 text-lg font-bold">R$49,90<span className="text-xs font-normal">/mês</span></div>
                    </Card>
                  </div>
                </div>
                <DialogFooter className="sm:justify-end">
                  <Button type="button">
                    Assinar plano profissional
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
