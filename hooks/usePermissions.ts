'use client';

import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { UserRole } from '@/lib/types';
import { 
  canManageGyms, 
  canManageUsers, 
  canAccessSettings, 
  canManageTemplates,
  hasPermission,
  getRolePermissions
} from '@/lib/roles';

export function usePermissions() {
  const { adminSession, canAccess } = useAdminAuth();

  const userRole = adminSession?.user.role;
  const permissions = adminSession?.permissions || [];

  return {
    // Direct access functions
    canAccess,
    
    // Resource-specific permissions
    canCreateGym: canAccess('gyms', 'create'),
    canReadGyms: canAccess('gyms', 'read'), 
    canUpdateGym: canAccess('gyms', 'update'),
    canDeleteGym: canAccess('gyms', 'delete'),

    canCreateUser: canAccess('users', 'create'),
    canReadUsers: canAccess('users', 'read'),
    canUpdateUser: canAccess('users', 'update'), 
    canDeleteUser: canAccess('users', 'delete'),

    canCreateBranch: canAccess('branches', 'create'),
    canReadBranches: canAccess('branches', 'read'),
    canUpdateBranch: canAccess('branches', 'update'),
    canDeleteBranch: canAccess('branches', 'delete'),

    canCreateTemplate: canAccess('templates', 'create'),
    canReadTemplates: canAccess('templates', 'read'),
    canUpdateTemplate: canAccess('templates', 'update'),
    canDeleteTemplate: canAccess('templates', 'delete'),

    canReadSettings: canAccess('settings', 'read'),
    canUpdateSettings: canAccess('settings', 'update'),

    canManagePayments: canAccess('payments', 'read'),
    canManageOrganization: canAccess('organization', 'read'),
    canManageBranding: canAccess('branding', 'update'),
    canManageSubscriptions: canAccess('subscriptions', 'read'),

    // Role-based helpers
    isAdmin: userRole === UserRole.FITCONNECT_ADMIN,
    isGymOwner: userRole === UserRole.GYM_OWNER,
    isGymManager: userRole === UserRole.GYM_MANAGER,
    isTrainer: userRole === UserRole.GYM_TRAINER,
    isReceptionist: userRole === UserRole.GYM_RECEPTIONIST,

    // Aggregate permission checks
    canManageGyms: userRole ? canManageGyms(userRole) : false,
    canManageUsers: userRole ? canManageUsers(userRole) : false,
    canAccessSettings: userRole ? canAccessSettings(userRole) : false,
    canManageTemplates: userRole ? canManageTemplates(userRole) : false,

    // Current user info
    currentUser: adminSession?.user,
    userRole,
    permissions,
  };
}
