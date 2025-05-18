import { supabase } from "@/integrations/supabase/client";
import { Client, ClientFormData } from "@/types/client";
import { toast } from "sonner";

// Get the current user's company ID
export const getUserCompanyId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single();
    
  return profile?.company_id || null;
};

// Fetch all clients for the user's company
export const fetchClients = async () => {
  try {
    const companyId = await getUserCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found");
    }
    
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        client_loyalty(*)
      `)
      .eq('company_id', companyId);
      
    if (error) throw error;
    
    return data as Client[];
  } catch (error) {
    console.error("Error fetching clients:", error);
    toast.error("Erro ao carregar clientes");
    return [];
  }
};

// Get a single client by ID
export const getClientById = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        client_loyalty(*)
      `)
      .eq('id', clientId)
      .single();
      
    if (error) throw error;
    
    return data as Client;
  } catch (error) {
    console.error("Error fetching client:", error);
    toast.error("Erro ao carregar cliente");
    return null;
  }
};

// Create a new client
export const createClient = async (clientData: ClientFormData): Promise<Client | null> => {
  try {
    const companyId = await getUserCompanyId();
    if (!companyId) {
      throw new Error("Company ID not found");
    }
    
    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          company_id: companyId,
          name: clientData.name,
          email: clientData.email || null,
          phone: clientData.phone,
          notes: clientData.notes || null,
          communication_preference: clientData.preferences?.communicationPreference || null
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("Cliente criado com sucesso!");
    return data as Client;
  } catch (error: any) {
    console.error("Error creating client:", error);
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      if (error.message.includes('email')) {
        toast.error("Um cliente com este e-mail já existe");
      } else if (error.message.includes('phone')) {
        toast.error("Um cliente com este telefone já existe");
      } else {
        toast.error("Este cliente já existe");
      }
    } else {
      toast.error("Erro ao criar cliente");
    }
    
    return null;
  }
};

// Update an existing client
export const updateClient = async (clientId: string, clientData: Partial<ClientFormData>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: clientData.name,
        email: clientData.email || null,
        phone: clientData.phone,
        notes: clientData.notes || null,
        communication_preference: clientData.preferences?.communicationPreference || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("Cliente atualizado com sucesso!");
    return data as Client;
  } catch (error) {
    console.error("Error updating client:", error);
    toast.error("Erro ao atualizar cliente");
    return null;
  }
};

// Update client notes only
export const updateClientNotes = async (clientId: string, notes: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .update({ 
        notes, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', clientId);
      
    if (error) throw error;
    
    toast.success("Anotações atualizadas com sucesso!");
    return true;
  } catch (error) {
    console.error("Error updating client notes:", error);
    toast.error("Erro ao atualizar anotações do cliente");
    return false;
  }
};

// Delete client
export const deleteClient = async (clientId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
      
    if (error) throw error;
    
    toast.success("Cliente excluído com sucesso!");
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    toast.error("Erro ao excluir cliente");
    return false;
  }
};

// Fetch service history for a client
export const fetchClientServiceHistory = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('service_history')
      .select(`
        *,
        services:service_id(name),
        professionals:professional_id(name)
      `)
      .eq('client_id', clientId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      serviceId: item.service_id,
      serviceName: item.services?.name || 'Serviço não encontrado',
      professionalId: item.professional_id,
      professionalName: item.professionals?.name || 'Profissional não encontrado',
      date: new Date(item.date),
      price: item.price,
      status: item.status,
      rating: item.rating,
      feedback: item.feedback,
      pointsEarned: item.points_earned,
      stampsEarned: item.stamps_earned
    }));
  } catch (error) {
    console.error("Error fetching client service history:", error);
    toast.error("Erro ao carregar histórico de serviços");
    return [];
  }
};

// Update loyalty points
export const addLoyaltyPoints = async (clientId: string, points: number): Promise<boolean> => {
  try {
    // Check if client has loyalty record
    const { data: loyaltyData, error: loyaltyError } = await supabase
      .from('client_loyalty')
      .select('*')
      .eq('client_id', clientId)
      .single();
      
    if (loyaltyError && loyaltyError.code !== 'PGRST116') { // PGRST116 is "no rows found"
      throw loyaltyError;
    }
    
    if (loyaltyData) {
      // Update existing loyalty record
      const { error } = await supabase
        .from('client_loyalty')
        .update({ 
          points: loyaltyData.points + points,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', clientId);
        
      if (error) throw error;
    } else {
      // Create new loyalty record
      const { error } = await supabase
        .from('client_loyalty')
        .insert([
          {
            client_id: clientId,
            points: points,
            total_spent: 0,
            visits: 0,
            stamps: 0
          }
        ]);
        
      if (error) throw error;
    }
    
    toast.success(`${points} pontos adicionados com sucesso!`);
    return true;
  } catch (error) {
    console.error("Error adding loyalty points:", error);
    toast.error("Erro ao adicionar pontos de fidelidade");
    return false;
  }
};

// Add loyalty stamp
export const addLoyaltyStamp = async (clientId: string): Promise<boolean> => {
  try {
    // Check if client has loyalty record
    const { data: loyaltyData, error: loyaltyError } = await supabase
      .from('client_loyalty')
      .select('*')
      .eq('client_id', clientId)
      .single();
      
    if (loyaltyError && loyaltyError.code !== 'PGRST116') { // PGRST116 is "no rows found"
      throw loyaltyError;
    }
    
    if (loyaltyData) {
      // Update existing loyalty record
      const { error } = await supabase
        .from('client_loyalty')
        .update({ 
          stamps: loyaltyData.stamps + 1,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', clientId);
        
      if (error) throw error;
    } else {
      // Create new loyalty record
      const { error } = await supabase
        .from('client_loyalty')
        .insert([
          {
            client_id: clientId,
            points: 0,
            total_spent: 0,
            visits: 0,
            stamps: 1
          }
        ]);
        
      if (error) throw error;
    }
    
    toast.success("Selo adicionado com sucesso!");
    return true;
  } catch (error) {
    console.error("Error adding loyalty stamp:", error);
    toast.error("Erro ao adicionar selo de fidelidade");
    return false;
  }
};
