'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallbackPath?: string;
}

export default function AdminProtectedRoute({
  children,
  requiredPermission,
  fallbackPath = '/admin-login'
}: AdminProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading, adminSession } = useAdminAuth();
  const { canAccess } = usePermissions();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  console.log('🛡️ AdminProtectedRoute check:', {
    isLoading,
    isAuthenticated,
    isAdmin,
    hasSession: !!adminSession,
    sessionRole: adminSession?.user?.role,
    currentPath: typeof window !== 'undefined' ? window.location.pathname : 'ssr'
  });

  useEffect(() => {
    // Add a delay to ensure auth state is properly initialized
    const timeoutId = setTimeout(() => {
      // Wait for initial load to complete before checking authentication
      if (isLoading) {
        console.log('🛡️ Still loading, waiting...');
        return; // Still loading, don't redirect yet
      }

      console.log('🛡️ Auth check complete:', {
        isAuthenticated,
        isAdmin,
        hasSession: !!adminSession,
        willRedirect: !isAuthenticated || !isAdmin
      });

      // Check if user is authenticated as admin
      if (!isAuthenticated || !isAdmin) {
        // Only redirect if we're not already on the login page
        const currentPath = window.location.pathname;
        console.log('🛡️ Not authenticated, current path:', currentPath);
        
        if (!currentPath.includes('/admin-login')) {
          console.log('🛡️ Redirecting to admin login:', `/${locale}${fallbackPath}`);
          router.push(`/${locale}${fallbackPath}`);
        }
        return;
      }

      console.log('🛡️ Admin authenticated, checking permissions...');

      // Check specific permission if required
      if (requiredPermission) {
        const hasRequiredPermission = canAccess(
          requiredPermission.resource,
          requiredPermission.action
        );
        
        console.log('🛡️ Permission check:', {
          required: requiredPermission,
          hasPermission: hasRequiredPermission
        });
        
        if (!hasRequiredPermission) {
          router.push(`/${locale}/admin/unauthorized`);
          return;
        }
      }

      console.log('🛡️ All checks passed, rendering children');
    }, 100); // Small delay to let auth state settle

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isAdmin, isLoading, requiredPermission, router, locale, canAccess, fallbackPath, adminSession]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Don't render children until authentication is verified
  if (!isAuthenticated || !isAdmin) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Verifying admin access...
      </div>
    );
  }

  // Check permission before rendering
  if (requiredPermission) {
    const hasRequiredPermission = canAccess(
      requiredPermission.resource,
      requiredPermission.action
    );
    
    if (!hasRequiredPermission) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
            Access Denied
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
            You don't have permission to access this resource.
          </p>
          <p style={{ fontSize: '14px', color: '#888' }}>
            Required: {requiredPermission.action} access to {requiredPermission.resource}
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}

