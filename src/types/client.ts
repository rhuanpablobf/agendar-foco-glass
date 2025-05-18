
export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  notes?: string | null;
  preferences?: {
    communicationPreference?: 'email' | 'phone' | 'whatsapp';
    preferredProfessionals?: string[];
    preferredServices?: string[];
  };
  loyalty?: LoyaltyData;
  client_loyalty?: LoyaltyData; // For Supabase join responses
  created_at?: string;
  updated_at?: string;
  company_id?: string;
  profile_id?: string | null;
  communication_preference?: string | null;
}

export interface LoyaltyData {
  client_id?: string;
  points: number;
  total_spent: number;  // Consistent with DB column name
  visits: number;
  stamps: number;
  last_visit?: string | null;  // Consistent with DB column name
  created_at?: string;
  updated_at?: string;
}

export interface ClientFormData {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  preferences?: {
    communicationPreference?: 'email' | 'phone' | 'whatsapp';
  };
}

export interface ServiceHistoryItem {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: Date;
  price: number;
  status: string;
  rating?: number;
  feedback?: string;
  pointsEarned?: number;
  stampsEarned?: number;
}
