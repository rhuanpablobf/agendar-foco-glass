
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold mt-4">Página não encontrada</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          A página "{location.pathname}" não existe ou foi movida para outro endereço.
        </p>
        <Button asChild>
          <Link to="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
