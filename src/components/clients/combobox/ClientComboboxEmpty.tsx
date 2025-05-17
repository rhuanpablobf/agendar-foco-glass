
import React from "react";
import { UserPlus } from "lucide-react";
import { CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface ClientComboboxEmptyProps {
  onAddNewClient?: () => void;
  onClose: () => void;
}

export function ClientComboboxEmpty({ onAddNewClient, onClose }: ClientComboboxEmptyProps) {
  if (!onAddNewClient) {
    return (
      <CommandEmpty className="py-3 text-center text-sm">
        <div className="py-2">Nenhum cliente encontrado</div>
      </CommandEmpty>
    );
  }

  return (
    <CommandEmpty className="py-3 text-center text-sm">
      <div className="py-2">Nenhum cliente encontrado</div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onClose();
          onAddNewClient();
        }}
        className="mt-1"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Cadastrar novo cliente
      </Button>
    </CommandEmpty>
  );
}
