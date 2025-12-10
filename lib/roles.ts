import { UserRole, Permission } from './types';

// Define permissions for different resources
export const PERMISSIONS = {
  GYMS: {
    resource: 'gyms',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  USERS: {
    resource: 'users',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  BRANCHES: {
    resource: 'branches',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  CLIENTS: {
    resource: 'clients',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  TEMPLATES: {
    resource: 'templates',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  SETTINGS: {
    resource: 'settings',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  PAYMENTS: {
    resource: 'payments',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  ORGANIZATION: {
    resource: 'organization',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  BRANDING: {
    resource: 'branding',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
  SUBSCRIPTIONS: {
    resource: 'subscriptions',
    actions: ['create', 'read', 'update', 'delete'] as const,
  },
} as const;

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.FITCONNECT_ADMIN]: [
    // Full access to everything
    PERMISSIONS.GYMS,
    PERMISSIONS.USERS,
    PERMISSIONS.BRANCHES,
    PERMISSIONS.CLIENTS,
    PERMISSIONS.TEMPLATES,
    PERMISSIONS.SETTINGS,
    PERMISSIONS.PAYMENTS,
    PERMISSIONS.ORGANIZATION,
    PERMISSIONS.BRANDING,
    PERMISSIONS.SUBSCRIPTIONS,
  ],
  
  [UserRole.GYM_OWNER]: [
    // Can manage their own gym, branches, and users
    { resource: 'gyms', actions: ['read', 'update'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'branches', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'clients', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'templates', actions: ['read'] },
    { resource: 'branding', actions: ['read', 'update'] },
    { resource: 'subscriptions', actions: ['read'] },
  ],
  
  [UserRole.GYM_MANAGER]: [
    // Can manage branch operations
    { resource: 'branches', actions: ['read', 'update'] },
    { resource: 'clients', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'update'] },
    { resource: 'templates', actions: ['read'] },
  ],
  
  [UserRole.GYM_TRAINER]: [
    // Limited access to clients and schedules
    { resource: 'clients', actions: ['read', 'update'] },
    { resource: 'templates', actions: ['read'] },
  ],
  
  [UserRole.GYM_RECEPTIONIST]: [
    // Client management and basic operations
    { resource: 'clients', actions: ['create', 'read', 'update'] },
    { resource: 'templates', actions: ['read'] },
  ],
};

// Helper functions
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(
  userPermissions: Permission[],
  resource: string,
  action: string
): boolean {
  return userPermissions.some(
    (permission) =>
      permission.resource === resource &&
      permission.actions.includes(action as any)
  );
}

export function isAdmin(role: UserRole): boolean {
  return role === UserRole.FITCONNECT_ADMIN;
}

export function canAccessAdminPanel(role: UserRole): boolean {
  return isAdmin(role);
}

// Resource access helpers
export function canManageGyms(role: UserRole): boolean {
  return hasPermission(getRolePermissions(role), 'gyms', 'update');
}

export function canManageUsers(role: UserRole): boolean {
  return hasPermission(getRolePermissions(role), 'users', 'create');
}

export function canAccessSettings(role: UserRole): boolean {
  return hasPermission(getRolePermissions(role), 'settings', 'read');
}

export function canManageTemplates(role: UserRole): boolean {
  return hasPermission(getRolePermissions(role), 'templates', 'create');
}