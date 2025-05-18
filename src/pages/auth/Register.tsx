
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Calendar } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-purple-950 py-10">
      <div className="w-full max-w-lg p-4">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-purple-500/20 p-2 rounded-md">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">BeautySalon</h1>
          </div>
        </div>
        
        <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-xl text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Preencha seus dados para criar uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-300">
              <span>Já possui uma conta? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-purple-300 hover:text-purple-200"
                onClick={() => navigate('/auth/login')}
              >
                Fazer login
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
