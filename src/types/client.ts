
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: Date;
  notes?: string;
  preferences?: {
    communicationPreference?: 'email' | 'phone' | 'whatsapp';
    preferredProfessionals?: string[];
    preferredServices?: string[];
  };
  loyalty?: LoyaltyData;
}

export interface LoyaltyData {
  points: number;
  totalSpent: number;
  visits: number;
  stamps: number; // For virtual stamp card
  lastVisit?: Date;
}

export interface ServiceHistoryItem {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: Date;
  price: number;
  status: 'completed' | 'cancelled' | 'no-show';
  rating?: number; // 1-5 stars
  feedback?: string;
  pointsEarned?: number;
  stampsEarned?: number;
}

export interface ClientFormData {
  name: string;
  email?: string;
  phone: string;
  notes?: string;
  preferences?: {
    communicationPreference?: 'email' | 'phone' | 'whatsapp';
    preferredProfessionals?: string[];
    preferredServices?: string[];
  };
}
