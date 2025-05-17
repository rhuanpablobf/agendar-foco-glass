
import React, { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ClientOption } from "./types";
import { ClientComboboxList } from "./combobox/ClientComboboxList";
import { ClientComboboxEmpty } from "./combobox/ClientComboboxEmpty";
import { ClientComboboxLoading } from "./combobox/ClientComboboxLoading";
import { ClientComboboxFooter } from "./combobox/ClientComboboxFooter";
import { useClientSearch } from "./hooks/useClientSearch";

interface ClientComboboxProps {
  clients: ClientOption[];
  selectedClientId?: string | number | null;
  onClientSelect: (clientId: string) => void;
  onAddNewClient?: () => void;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ClientCombobox({
  clients = [],
  selectedClientId,
  onClientSelect,
  onAddNewClient,
  className,
  error = false,
  disabled = false,
  placeholder = "Selecione um cliente...",
}: ClientComboboxProps) {
  const [open, setOpen] = useState(false);
  const { 
    searchValue, 
    setSearchValue, 
    isLoading, 
    filteredClients, 
    safeClients 
  } = useClientSearch(clients);

  // Get the currently selected client
  const selectedClient = safeClients.find(
    (client) => client.id?.toString() === selectedClientId?.toString()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            error ? "border-red-500" : "",
            className
          )}
          onClick={(e) => {
            // Prevent the event from propagating upwards
            e.stopPropagation();
          }}
        >
          {selectedClient?.name || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar cliente..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          
          {isLoading ? (
            <ClientComboboxLoading />
          ) : (
            <>
              <ClientComboboxEmpty 
                onAddNewClient={onAddNewClient} 
                onClose={() => setOpen(false)} 
              />
              
              <ClientComboboxList
                filteredClients={filteredClients}
                selectedClientId={selectedClientId}
                onClientSelect={onClientSelect}
                onClose={() => setOpen(false)}
                onClearSearch={() => setSearchValue("")}
              />
            </>
          )}

          {onAddNewClient && (
            <ClientComboboxFooter 
              onAddNewClient={onAddNewClient}
              onClose={() => setOpen(false)}
            />
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
