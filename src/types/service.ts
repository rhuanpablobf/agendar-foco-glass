
export type ServiceCategory = 'hair' | 'nails' | 'skincare' | 'makeup' | 'other';

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  category: ServiceCategory;
  isActive: boolean;
  isCombo: boolean;
  comboServices?: string[]; // IDs of services included in the combo
  comboDiscount?: number; // percentage discount for combo
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: ServiceCategory;
  isCombo: boolean;
  comboServices?: string[];
  comboDiscount?: number;
}
