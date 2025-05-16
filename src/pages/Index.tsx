
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 container mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-accent rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">BS</span>
          </div>
          <h1 className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-accent-gradient">
            BeautySalon
          </h1>
        </div>
        <div className="space-x-4">
          <Button asChild variant="ghost">
            <Link to="/auth/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/registrar">Criar Conta</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 relative z-10 container mx-auto flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Gerencie seu salão com <span className="bg-clip-text text-transparent bg-accent-gradient">simplicidade</span>
        </h1>
        <p className="text-xl mb-8 max-w-2xl text-muted-foreground">
          Agendamentos, clientes, serviços e finanças em um só lugar. 
          A solução completa para profissionais de beleza.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="px-8">
            <Link to="/auth/registrar">Começar Agora</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#recursos">Conheça os Recursos</a>
          </Button>
        </div>

        <div className="mt-16 p-6 glass-card rounded-xl shadow-glass w-full max-w-5xl">
          <div className="h-[300px] flex items-center justify-center border border-dashed border-white/20 rounded-lg">
            <p className="text-muted-foreground">
              Interface de demonstração do sistema
            </p>
          </div>
        </div>
      </main>

      <section id="recursos" className="relative z-10 py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-lg">
            <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Agenda Intuitiva</h3>
            <p className="text-muted-foreground">Gerencie agendamentos de forma visual e simples, evitando conflitos de horários.</p>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Gestão de Clientes</h3>
            <p className="text-muted-foreground">Cadastre, segmente e acompanhe o histórico completo de cada cliente.</p>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Controle Financeiro</h3>
            <p className="text-muted-foreground">Acompanhe receitas, despesas e comissões com relatórios detalhados.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-gradient-to-b from-background to-muted py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar seu negócio?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece a usar hoje mesmo com o plano gratuito e descubra como podemos ajudar seu salão a crescer.
          </p>
          <Button asChild size="lg" className="px-10">
            <Link to="/auth/registrar">Criar Conta Grátis</Link>
          </Button>
        </div>
      </section>

      <footer className="relative z-10 bg-muted py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-accent rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">BS</span>
                </div>
                <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-accent-gradient">
                  BeautySalon
                </h1>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                © 2025 BeautySalon. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">Termos</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacidade</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Suporte</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
