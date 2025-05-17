
import React from "react";
import { Check } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { ClientOption } from "../types";

interface ClientComboboxItemProps {
  client: ClientOption;
  selectedClientId?: string | number | null;
  onSelect: (value: string) => void;
  onClose: () => void;
  onClearSearch: () => void;
}

export function ClientComboboxItem({
  client,
  selectedClientId,
  onSelect,
  onClose,
  onClearSearch,
}: ClientComboboxItemProps) {
  const handleSelect = (value: string) => {
    onSelect(value);
    onClearSearch();
    onClose();
  };

  return (
    <CommandItem
      key={client.id}
      value={client.id?.toString() ?? ""}
      onSelect={handleSelect}
      className="flex items-center justify-between"
    >
      <div>
        <span>{client.name}</span>
        {client.phone && (
          <span className="ml-2 text-xs text-muted-foreground">
            {client.phone}
          </span>
        )}
      </div>
      {selectedClientId?.toString() === client.id?.toString() && (
        <Check className="h-4 w-4 text-emerald-500" />
      )}
    </CommandItem>
  );
}
