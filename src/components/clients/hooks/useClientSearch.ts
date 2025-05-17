
import { useState, useEffect } from "react";
import { ClientOption } from "../types";

export function useClientSearch(clients: ClientOption[] = []) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredClients, setFilteredClients] = useState<ClientOption[]>([]);

  // Ensure clients is always an array
  const safeClients = Array.isArray(clients) ? clients : [];

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

  return {
    searchValue,
    setSearchValue,
    isLoading,
    filteredClients: Array.isArray(filteredClients) ? filteredClients : [],
    safeClients: Array.isArray(clients) ? clients : []
  };
}
