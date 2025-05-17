
import React from "react";
import { CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface ClientComboboxEmptyProps {
  onAddNewClient?: () => void;
  onClose: () => void;
  show?: boolean;
}

export function ClientComboboxEmpty({ 
  onAddNewClient, 
  onClose,
  show = false 
}: ClientComboboxEmptyProps) {
  if (!show) {
    return null;
  }

  const handleAddNewClient = () => {
    if (onAddNewClient) {
      onAddNewClient();
      onClose();
    }
  };

  return (
    <CommandEmpty className="p-4 text-center">
      <p className="mb-2">Nenhum cliente encontrado</p>
      {onAddNewClient && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAddNewClient}
          className="flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          <span>Adicionar novo cliente</span>
        </Button>
      )}
    </CommandEmpty>
  );
}
