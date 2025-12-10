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
  const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
  const { canAccess } = usePermissions();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    // Wait for initial load to complete before checking authentication
    if (isLoading) {
      return; // Still loading, don't redirect yet
    }

    // Check if user is authenticated as admin
    if (!isAuthenticated || !isAdmin) {
      // Only redirect if we're not already on the login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin-login')) {
        router.push(`/${locale}${fallbackPath}`);
      }
      return;
    }

    // Check specific permission if required
    if (requiredPermission) {
      const hasRequiredPermission = canAccess(
        requiredPermission.resource,
        requiredPermission.action
      );
      
      if (!hasRequiredPermission) {
        router.push(`/${locale}/admin/unauthorized`);
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, requiredPermission, router, locale, canAccess, fallbackPath]);

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
