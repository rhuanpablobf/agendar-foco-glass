import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { newClientFormSchema, NewClientFormValues } from '../types/schedule';

interface NewClientFormProps {
  onCreateClient: (data: NewClientFormValues) => void;
  onCancel: () => void;
}

export function NewClientForm({ onCreateClient, onCancel }: NewClientFormProps) {
  const newClientForm = useForm<NewClientFormValues>({
    resolver: zodResolver(newClientFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const handleCreateClient = (data: NewClientFormValues) => {
    onCreateClient(data);
    newClientForm.reset();
  };

  return (
    <Form {...newClientForm}>
      <form onSubmit={newClientForm.handleSubmit(handleCreateClient)} className="space-y-4">
        <FormField
          control={newClientForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={newClientForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={newClientForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Cadastrar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
