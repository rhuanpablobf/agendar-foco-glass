
import React from "react";
import { CommandGroup } from "@/components/ui/command";
import { ClientOption } from "../types";
import { ClientComboboxItem } from "./ClientComboboxItem";

interface ClientComboboxListProps {
  filteredClients: ClientOption[];
  selectedClientId?: string | number | null;
  onClientSelect: (clientId: string) => void;
  onClose: () => void;
  onClearSearch: () => void;
}

export function ClientComboboxList({
  filteredClients,
  selectedClientId,
  onClientSelect,
  onClose,
  onClearSearch,
}: ClientComboboxListProps) {
  // Ensure we're working with an array
  const safeClients = Array.isArray(filteredClients) ? filteredClients : [];

  if (safeClients.length === 0) {
    return null;
  }

  return (
    <CommandGroup className="max-h-[300px] overflow-y-auto">
      {safeClients.map((client) => (
        <ClientComboboxItem
          key={client.id?.toString() || ''}
          client={client}
          selectedClientId={selectedClientId}
          onSelect={onClientSelect}
          onClose={onClose}
          onClearSearch={onClearSearch}
        />
      ))}
    </CommandGroup>
  );
}
