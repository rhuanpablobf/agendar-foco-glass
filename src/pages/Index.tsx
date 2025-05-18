
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="container mx-auto py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">BeautySalon</h1>
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth/login')}
            className="mr-2"
          >
            Login
          </Button>
          <Button onClick={() => navigate('/auth/registrar')}>
            Registrar
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4">
        <div className="max-w-3xl text-center space-y-6">
          <h2 className="text-5xl font-bold">Gerencie seu salão de beleza com facilidade</h2>
          <p className="text-xl text-gray-300">
            Agendamentos, clientes, profissionais e muito mais em um só lugar.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth/registrar')}
            >
              Começar agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth/login')}
            >
              Fazer login
            </Button>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 text-center text-gray-400">
        <p>© 2023 BeautySalon. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
