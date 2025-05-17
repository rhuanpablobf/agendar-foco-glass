
import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission, UserPermissions } from '@/hooks/usePermission';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof UserPermissions;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { hasPermission } = usePermission();
  
  // If no specific permission is required, just render the children
  if (!requiredPermission) {
    return <>{children}</>;
  }
  
  // Check if user has the required permission
  if (!hasPermission(requiredPermission)) {
    // Redirect to dashboard if permission is denied
    return <Navigate to="/dashboard" replace />;
  }
  
  // User has permission, render the protected content
  return <>{children}</>;
};
