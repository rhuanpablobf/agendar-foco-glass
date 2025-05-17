
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ClientOption {
  id: number | string;
  name: string;
  phone?: string;
  email?: string;
}

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
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredClients, setFilteredClients] = useState<ClientOption[]>([]);

  // Ensure clients is always an array
  const safeClients = Array.isArray(clients) ? clients : [];

  // Get the currently selected client
  const selectedClient = safeClients.find(
    (client) => client.id?.toString() === selectedClientId?.toString()
  );

  // Filter clients based on search query
  useEffect(() => {
    // Ensure we're working with an array
    if (!Array.isArray(safeClients)) {
      setFilteredClients([]);
      return;
    }

    // Simulate loading state for better UX
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      if (!searchValue.trim()) {
        setFilteredClients(safeClients);
      } else {
        const query = searchValue.toLowerCase().trim();
        const filtered = safeClients.filter(
          (client) => 
            (client?.name?.toLowerCase().includes(query)) ||
            (client?.phone && client.phone.includes(query)) ||
            (client?.email && client.email.toLowerCase().includes(query))
        );
        // Always ensure filteredClients is an array
        setFilteredClients(Array.isArray(filtered) ? filtered : []);
      }
      setIsLoading(false);
    }, 150); // Small delay for better UX
    
    return () => clearTimeout(timeoutId);
  }, [searchValue, safeClients]);

  // Initialize filtered clients with safe clients when component mounts
  useEffect(() => {
    setFilteredClients(Array.isArray(safeClients) ? safeClients : []);
  }, [safeClients]);

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
            <div className="py-6 text-center text-sm flex items-center justify-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Buscando...
            </div>
          ) : (
            <>
              <CommandEmpty className="py-3 text-center text-sm">
                <div className="py-2">Nenhum cliente encontrado</div>
                {onAddNewClient && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      onAddNewClient();
                    }}
                    className="mt-1"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Cadastrar novo cliente
                  </Button>
                )}
              </CommandEmpty>
              
              {Array.isArray(filteredClients) && filteredClients.length > 0 ? (
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {filteredClients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={client.id?.toString() ?? ""}
                      onSelect={(currentValue) => {
                        onClientSelect(currentValue);
                        setSearchValue("");
                        setOpen(false);
                      }}
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
                  ))}
                </CommandGroup>
              ) : null}
            </>
          )}

          {onAddNewClient && (
            <div className="p-2 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onAddNewClient();
                }}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar novo cliente
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
