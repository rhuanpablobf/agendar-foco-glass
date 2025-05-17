
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the permissions interface
export interface UserPermissions {
  agenda: boolean;
  clients: boolean;
  professionals: boolean;
  services: boolean;
  financial: boolean;
  reports: boolean;
  settings: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: UserPermissions;
}

interface PermissionContextProps {
  currentUser: User | null;
  hasPermission: (module: keyof UserPermissions) => boolean;
  setCurrentUser: (user: User | null) => void;
}

// Create the context
const PermissionContext = createContext<PermissionContextProps | undefined>(undefined);

// Default admin user with full permissions
const adminUser: User = {
  id: 'owner',
  name: 'Administrador',
  email: 'admin@empresa.com',
  role: 'Proprietário',
  permissions: {
    agenda: true,
    clients: true,
    professionals: true,
    services: true,
    financial: true,
    reports: true,
    settings: true,
  },
};

// Provider component
export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(adminUser);

  // Check if user has permission for a specific module
  const hasPermission = (module: keyof UserPermissions): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions[module];
  };

  return (
    <PermissionContext.Provider value={{ currentUser, hasPermission, setCurrentUser }}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook to use the permission context
export const usePermission = (): PermissionContextProps => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
