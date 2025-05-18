
import React from 'react';
import { ClientFormData } from '@/types/client';
import { ClientForm } from './ClientForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ClientFormData) => void;
}

export const ClientFormModal = ({ isOpen, onClose, onSubmit }: ClientFormModalProps) => {
  const handleSubmit = (data: ClientFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    onClose(); // Fechar o modal após o envio bem-sucedido
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <ClientForm onSubmit={handleSubmit} buttonText="Cadastrar Cliente" />
        
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
