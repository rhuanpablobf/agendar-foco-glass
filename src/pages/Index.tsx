
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Scissors, BarChart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white flex flex-col">
      <header className="container mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-purple-500/20 p-2 rounded-md">
            <Calendar className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold">BeautySalon</h1>
        </div>
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth/login')}
            className="mr-2 border-white/20 hover:bg-white/10 text-white"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/auth/registrar')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Registrar
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-purple-500">
            Gerencie seu salão de beleza com facilidade
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Agendamentos, clientes, profissionais e muito mais em um só lugar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <Calendar className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Agendamentos</h3>
              <p className="text-gray-400">Gerencie sua agenda com facilidade e nunca perca um compromisso</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <Users className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Clientes</h3>
              <p className="text-gray-400">Organize informações de clientes e histórico de atendimentos</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <Scissors className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Serviços</h3>
              <p className="text-gray-400">Cadastre seus serviços e defina preços e duração</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <BarChart className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Relatórios</h3>
              <p className="text-gray-400">Acompanhe o desempenho do seu negócio com relatórios detalhados</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button
              size="lg"
              onClick={() => navigate('/auth/registrar')}
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
            >
              Começar agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth/login')}
              className="border-white/20 hover:bg-white/10 text-white text-lg px-8"
            >
              Fazer login
            </Button>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-8 text-center border-t border-white/10 mt-12">
        <p className="text-gray-400">© {new Date().getFullYear()} BeautySalon. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
