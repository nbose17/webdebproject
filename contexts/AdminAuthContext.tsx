'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apolloClient } from '@/lib/apollo-client';
import { UserRole, Permission, AdminSession } from '@/lib/types';
import { getRolePermissions, isAdmin, canAccessAdminPanel } from '@/lib/roles';
import { LOGIN_MUTATION, GET_ME } from '@/graphql/queries/admin';
import { graphQLRoleToDb, dbRoleToGraphQL } from '@/lib/role-mapper';

interface AdminAuthContextType {
  adminSession: AdminSession | null;
  loginAsAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canAccess: (resource: string, action: string) => boolean;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate and refresh session from API
  const validateSession = async () => {
    const token = localStorage.getItem('adminToken');
    const storedSession = localStorage.getItem('adminSession');

    console.log('🔐 validateSession called:', {
      hasToken: !!token,
      hasStoredSession: !!storedSession
    });

    if (!token || !storedSession) {
      console.log('🔐 No token or session, setting loading false');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Calling GET_ME query for admin validation...');
      // Verify session with API
      const result = await apolloClient.query<{ me: any }>({
        query: GET_ME,
        fetchPolicy: 'network-only', // Always fetch fresh data
        errorPolicy: 'all', // Return both data and errors
      });

      const { data } = result;
      const errors = 'errors' in result ? result.errors : undefined;

      console.log('🔐 GET_ME response:', {
        hasData: !!data?.me,
        hasErrors: !!(errors && Array.isArray(errors) && errors.length > 0),
        userData: data?.me ? {
          id: data.me.id,
          email: data.me.email,
          role: data.me.role
        } : null
      });

      if (errors && Array.isArray(errors) && errors.length > 0) {
        // GraphQL errors (likely authentication failure)
        console.error('🔐 Session validation errors:', errors);
        logoutAdmin();
        setIsLoading(false);
        return;
      }

      if (data?.me) {
        const user = data.me;
        // Convert GraphQL role (uppercase) to database format (lowercase) for role checking
        const dbRole = graphQLRoleToDb(user.role);

        console.log('🔐 Role validation:', {
          originalRole: user.role,
          dbRole,
          isAdminRole: dbRole === UserRole.FITCONNECT_ADMIN ||
            dbRole.toLowerCase() === 'fitconnect_admin' ||
            user.role?.toUpperCase() === 'FITCONNECT_ADMIN'
        });

        // Check if role is admin (handle both formats)
        const isAdminRole = dbRole === UserRole.FITCONNECT_ADMIN ||
          dbRole.toLowerCase() === 'fitconnect_admin' ||
          user.role?.toUpperCase() === 'FITCONNECT_ADMIN';

        if (isAdminRole) {
          console.log('🔐 Admin role validated, creating session');
          // Normalize to UserRole enum format
          const normalizedRole = UserRole.FITCONNECT_ADMIN;
          const permissions = user.permissions || getRolePermissions(normalizedRole);
          const session: AdminSession = {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: normalizedRole, // Store in database format
              permissions,
            },
            permissions,
            isAdmin: true,
          };

          console.log('🔐 Setting validated admin session');
          setAdminSession(session);
          localStorage.setItem('adminSession', JSON.stringify(session));
        } else {
          // Not an admin, clear session
          console.log('🔐 User is not an admin, clearing session. Role:', dbRole);
          logoutAdmin();
        }
      } else {
        // Invalid session, clear it
        console.log('🔐 No user data from GET_ME query, clearing session');
        logoutAdmin();
      }
    } catch (error: any) {
      console.error('🔐 Session validation error:', error);
      // Token might be expired or invalid, clear session
      // But don't call logoutAdmin if it's a network error - might be temporary
      if (error?.networkError) {
        console.log('🔐 Network error during validation, keeping cached session');
        // Keep existing session if it's just a network error
        const storedSession = localStorage.getItem('adminSession');
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession);
            // Ensure role is in database format for checking
            const dbRole = typeof session.user?.role === 'string'
              ? (session.user.role.includes('FITCONNECT') ? UserRole.FITCONNECT_ADMIN : session.user.role)
              : session.user?.role;
            if (session.user && canAccessAdminPanel(dbRole as UserRole)) {
              // Normalize role to database format
              session.user.role = dbRole;
              setAdminSession(session);
              console.log('🔐 Kept cached admin session due to network error');
            } else {
              console.log('🔐 Cached session invalid, logging out');
              logoutAdmin();
            }
          } catch {
            console.log('🔐 Failed to parse cached session, logging out');
            logoutAdmin();
          }
        }
      } else {
        console.log('🔐 Auth error (not network), logging out');
        logoutAdmin();
      }
    } finally {
      console.log('🔐 validateSession complete, setting loading false');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAdminAuth = async () => {
      console.log('🔐 AdminAuth initialization...');

      // Check if we have a stored session first (for faster initial render)
      const storedSession = localStorage.getItem('adminSession');
      const token = localStorage.getItem('adminToken');

      console.log('🔐 Stored data check:', {
        hasSession: !!storedSession,
        hasToken: !!token
      });

      if (storedSession && token) {
        try {
          const session = JSON.parse(storedSession);
          console.log('🔐 Parsed stored session:', {
            userId: session.user?.id,
            role: session.user?.role,
            isAdmin: session.isAdmin
          });

          // Ensure role is in correct format
          const role = session.user?.role || '';
          // Handle both GraphQL format (FITCONNECT_ADMIN) and DB format (fitconnect_admin)
          const dbRole = role.toLowerCase() === 'fitconnect_admin' || role === UserRole.FITCONNECT_ADMIN
            ? UserRole.FITCONNECT_ADMIN
            : role;

          if (session.user && canAccessAdminPanel(dbRole as UserRole)) {
            console.log('🔐 Valid cached session found, setting state');
            // Normalize session role
            session.user.role = dbRole;
            // Set session immediately for faster UI
            setAdminSession(session);
            // Add small delay before setting loading to false to prevent race conditions
            setTimeout(() => {
              setIsLoading(false);
            }, 50);

            // Then validate in background (but don't block)
            console.log('🔐 Starting background validation...');
            validateSession().catch(err => {
              console.error('Background session validation failed:', err);
              // Don't clear session on validation error - let it stay if token is valid
            });
            return;
          } else {
            console.log('🔐 Invalid cached session, role check failed');
          }
        } catch (e) {
          console.error('Error parsing stored session:', e);
        }
      }

      // No valid stored session, validate with API
      console.log('🔐 No valid cached session, validating with API...');
      await validateSession();
    };

    initializeAdminAuth();
  }, []);

  const loginAsAdmin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    console.log('🔐 Admin login attempt:', { email });
    try {
      const { data } = await apolloClient.mutate<{ login: { success: boolean; token?: string; user?: any; message?: string } }>({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
      });

      console.log('🔐 Login mutation response:', {
        success: data?.login?.success,
        hasUser: !!data?.login?.user,
        hasToken: !!data?.login?.token
      });

      if (data?.login?.success && data?.login?.user) {
        const { token, user } = data.login;

        console.log('🔐 Processing login success:', {
          userId: user.id,
          email: user.email,
          role: user.role,
          hasToken: !!token
        });

        // Store token
        if (token) {
          localStorage.setItem('adminToken', token);
          console.log('🔐 Admin token stored in localStorage:', {
            tokenLength: token.length,
            tokenPreview: token.substring(0, 20) + '...',
            storedSuccessfully: !!localStorage.getItem('adminToken')
          });
        }

        // Convert GraphQL role (uppercase) to database format (lowercase) for role checking
        const dbRole = graphQLRoleToDb(user.role);

        console.log('🔐 Role conversion:', {
          originalRole: user.role,
          dbRole,
          isAdmin: dbRole === 'fitconnect_admin' || dbRole.toLowerCase() === 'fitconnect_admin'
        });

        // Normalize to UserRole enum format
        const normalizedRole = dbRole === 'fitconnect_admin' || dbRole.toLowerCase() === 'fitconnect_admin'
          ? UserRole.FITCONNECT_ADMIN
          : dbRole as UserRole;

        const permissions = user.permissions || getRolePermissions(normalizedRole);
        const session: AdminSession = {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: normalizedRole, // Store in database format
            permissions,
          },
          permissions,
          isAdmin: true, // We know it's admin if login succeeded
        };

        console.log('🔐 Setting admin session:', {
          userId: session.user.id,
          role: session.user.role,
          isAdmin: session.isAdmin,
          permissionsCount: session.permissions.length
        });

        setAdminSession(session);
        localStorage.setItem('adminSession', JSON.stringify(session));

        console.log('🔐 Admin session stored, waiting for state update...');
        // Wait longer to ensure state is fully updated
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('🔐 Login successful, ready for redirect');
        return { success: true };
      }

      return {
        success: false,
        message: data?.login?.message || 'Invalid email or password'
      };
    } catch (error: any) {
      console.error('🔐 Login error:', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        'An error occurred during login. Please try again.';

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const refreshSession = async () => {
    await validateSession();
  };

  const logoutAdmin = () => {
    setAdminSession(null);
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminToken');
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
        refreshSession,
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

