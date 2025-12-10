'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apolloClient } from '@/lib/apollo-client';
import { User, UserRole } from '@/lib/types';
import { isAdmin, canAccessAdminPanel } from '@/lib/roles';
import { LOGIN_MUTATION, GET_ME } from '@/graphql/queries/admin';
import { graphQLRoleToDb, dbRoleToGraphQL } from '@/lib/role-mapper';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canAccessAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate and refresh session from API
  const validateSession = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('🔍 validateSession called:', { 
      hasToken: !!token, 
      hasStoredUser: !!storedUser,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null
    });
    
    if (!token) {
      console.log('❌ No token found, logging out');
      logout();
      setIsLoading(false);
      return;
    }
    
    if (!storedUser) {
      console.log('⚠️ No stored user but token exists, continuing with validation');
    }

    try {
      console.log('🔄 Validating session with GET_ME query...');
      
      // Clear Apollo cache for GET_ME to ensure fresh data
      apolloClient.cache.evict({ fieldName: 'me' });
      apolloClient.cache.gc();
      
      // Verify session with API
      const { data, errors } = await apolloClient.query({
        query: GET_ME,
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      console.log('📥 GET_ME response:', { 
        data: data ? { me: data.me ? { ...data.me, gymId: data.me.gymId } : null } : null, 
        errors 
      });

      if (errors && errors.length > 0) {
        // GraphQL errors (likely authentication failure)
        console.error('❌ Session validation errors:', errors);
        logout();
        setIsLoading(false);
        return;
      }

      if (data?.me) {
        const apiUser = data.me;
        const dbRole = graphQLRoleToDb(apiUser.role);
        const normalizedRole = dbRole as UserRole;
        
        console.log('👤 User data from API (raw):', {
          id: apiUser.id,
          email: apiUser.email,
          role: apiUser.role,
          normalizedRole: normalizedRole,
          gymId: apiUser.gymId,
          branchId: apiUser.branchId,
          hasGymId: !!apiUser.gymId,
          gymIdType: typeof apiUser.gymId,
        });
        
        const userData: User = {
          id: apiUser.id,
          email: apiUser.email,
          name: apiUser.name,
          role: normalizedRole,
          permissions: apiUser.permissions,
          gymId: apiUser.gymId || null,
          branchId: apiUser.branchId || null,
        };
        
        console.log('👤 User data after processing:', {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          gymId: userData.gymId,
          branchId: userData.branchId,
        });
        
        // Debug log to help diagnose gymId issues
        if (!userData.gymId && normalizedRole === UserRole.GYM_OWNER) {
          console.warn('⚠️ Gym owner without gymId:', {
            userId: userData.id,
            email: userData.email,
            role: userData.role,
            gymId: userData.gymId,
            rawGymId: apiUser.gymId,
          });
        } else if (userData.gymId) {
          console.log('✅ User has gymId - setting state:', userData.gymId);
        }
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('💾 User data saved to localStorage and state');
      } else {
        console.log('❌ No user data in GET_ME response, logging out');
        logout();
      }
    } catch (error: any) {
      console.error('❌ Session validation error:', error);
      // Check if it's an authentication error
      if (error?.graphQLErrors?.some((e: any) => e.message.includes('Not authenticated'))) {
        console.log('🔒 Authentication error - logging out');
        logout();
      } else if (error?.networkError) {
        console.log('🌐 Network error - keeping existing session');
        // Keep existing session if it's just a network error
        setIsLoading(false);
      } else {
        console.log('❌ Unknown error - logging out');
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a stored session first
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('🔍 AuthContext useEffect - checking stored session:', {
        hasStoredUser: !!storedUser,
        hasToken: !!token,
        storedUser: storedUser ? JSON.parse(storedUser) : null,
      });
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('📦 Using cached user from localStorage:', {
            id: parsedUser.id,
            email: parsedUser.email,
            role: parsedUser.role,
            gymId: parsedUser.gymId,
          });
          
          // For gym owners without gymId, always wait for validation
          // For others, use cached data and validate in background
          if (parsedUser.role === 'gym_owner' && !parsedUser.gymId) {
            console.log('⚠️ Gym owner in cache without gymId, validating first...');
            setIsLoading(true);
            await validateSession();
          } else {
            setUser(parsedUser);
            setIsLoading(false);
            // Validate in background to get fresh data
            console.log('🔄 Validating session in background...');
            validateSession().catch(err => {
              console.error('Background session validation failed:', err);
            });
          }
          return;
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
      
      // No valid stored session
      console.log('🚫 No cached session found, validating...');
      await validateSession();
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
      });

      if (data?.login?.success && data?.login?.user) {
        const { token, user: apiUser } = data.login;
        
        console.log('✅ Login successful, storing token and user data:', {
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : null,
          userId: apiUser.id,
          email: apiUser.email,
          role: apiUser.role,
          gymId: apiUser.gymId,
        });
        
        // Store token
        if (token) {
          localStorage.setItem('token', token);
          console.log('💾 Token stored in localStorage');
        } else {
          console.warn('⚠️ No token received from login response');
        }

        const dbRole = graphQLRoleToDb(apiUser.role);
        const normalizedRole = dbRole as UserRole;
        
        const userData: User = {
          id: apiUser.id,
          email: apiUser.email,
          name: apiUser.name,
          role: normalizedRole,
          permissions: apiUser.permissions,
          gymId: apiUser.gymId,
          branchId: apiUser.branchId,
        };
        
        console.log('👤 Setting user data:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('💾 User data stored in localStorage');
        
        return { success: true };
      }
      
      return { 
        success: false, 
        message: data?.login?.message || 'Invalid email or password' 
      };
    } catch (error: any) {
      console.error('Login error:', error);
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

  const logout = () => {
    console.log('🚪 Logging out...');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');  // Also remove admin token if exists
    setIsLoading(false);
  };

  const isAuthenticated = !!user;
  const userIsAdmin = user ? isAdmin(user.role) : false;
  const canAccessAdmin = user ? canAccessAdminPanel(user.role) : false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated,
      isAdmin: userIsAdmin,
      canAccessAdmin,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}






