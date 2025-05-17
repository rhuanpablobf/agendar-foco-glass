
import React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientComboboxFooterProps {
  onAddNewClient: () => void;
  onClose: () => void;
}

export function ClientComboboxFooter({ onAddNewClient, onClose }: ClientComboboxFooterProps) {
  return (
    <div className="p-2 border-t border-white/10">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onClose();
          onAddNewClient();
        }}
        className="w-full"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Cadastrar novo cliente
      </Button>
    </div>
  );
}
