'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission, AdminSession } from '@/lib/types';
import { getRolePermissions, isAdmin, canAccessAdminPanel } from '@/lib/roles';

interface AdminAuthContextType {
  adminSession: AdminSession | null;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canAccess: (resource: string, action: string) => boolean;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Mock admin users for development
const mockAdminUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@fitconnect.com',
    name: 'FitConnect Admin',
    role: UserRole.FITCONNECT_ADMIN,
  },
  {
    id: 'admin-2', 
    email: 'superadmin@fitconnect.com',
    name: 'Super Admin',
    role: UserRole.FITCONNECT_ADMIN,
  }
];

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin session
    const storedSession = localStorage.getItem('adminSession');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        // Validate session and ensure user is admin
        if (session.user && canAccessAdminPanel(session.user.role)) {
          setAdminSession(session);
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (e) {
        localStorage.removeItem('adminSession');
      }
    }
    setIsLoading(false);
  }, []);

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    // Mock admin authentication
    const adminUser = mockAdminUsers.find(user => user.email === email);
    
    if (adminUser && password) {
      const permissions = getRolePermissions(adminUser.role);
      const session: AdminSession = {
        user: adminUser,
        permissions,
        isAdmin: isAdmin(adminUser.role),
      };
      
      setAdminSession(session);
      localStorage.setItem('adminSession', JSON.stringify(session));
      return true;
    }
    
    return false;
  };

  const logoutAdmin = () => {
    setAdminSession(null);
    localStorage.removeItem('adminSession');
  };

  const canAccess = (resource: string, action: string): boolean => {
    if (!adminSession) return false;
    
    return adminSession.permissions.some(
      permission =>
        permission.resource === resource &&
        permission.actions.includes(action as any)
    );
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminSession,
        loginAsAdmin,
        logoutAdmin,
        isAuthenticated: !!adminSession,
        isAdmin: adminSession?.isAdmin || false,
        canAccess,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}