
import React, { useState } from 'react';
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

interface ClientComboboxProps {
  clients: Client[];
  value: string;
  onChange: (value: string) => void;
}

export function ClientCombobox({ clients, value, onChange }: ClientComboboxProps) {
  const [open, setOpen] = useState(false);
  
  const selectedClient = clients.find(client => client.id.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white/5 border-white/20 h-10",
            !value && "text-muted-foreground"
          )}
        >
          {value && selectedClient ? selectedClient.name : "Selecione um cliente"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-background/95 backdrop-blur-md border border-white/20">
        <Command className="bg-transparent">
          <CommandInput placeholder="Buscar cliente..." className="h-9" />
          <CommandEmpty className="py-6 text-center">
            <div className="space-y-1">
              <p>Cliente não encontrado</p>
              <p className="text-xs text-muted-foreground">
                Tente outro nome ou crie um novo cliente
              </p>
            </div>
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.name}
                onSelect={() => {
                  onChange(client.id.toString());
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <div className="flex items-start flex-1 gap-x-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  </div>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    client.id.toString() === value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
