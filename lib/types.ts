// TypeScript interfaces for FitConnect Ads

export interface Gym {
  id: string;
  name: string;
  location: string;
  image: string;
  featured: boolean;
  description?: string;
}

export interface Plan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  includedClasses?: Class[];
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  durationMinutes: number;
  numberOfClasses: number;
  price: number;
  description?: string;
}

export interface Trainer {
  id: string;
  name: string;
  experience: string;
  image: string;
  bio?: string;
}

// User Roles and Permissions System
export enum UserRole {
  FITCONNECT_ADMIN = 'fitconnect_admin',
  GYM_OWNER = 'gym_owner',
  GYM_MANAGER = 'gym_manager',
  GYM_TRAINER = 'gym_trainer',
  GYM_RECEPTIONIST = 'gym_receptionist'
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: Permission[];
  gymId?: string; // For gym-specific users
  gym?: Gym;
  preferences?: {
    dashboardViewMode: 'table' | 'card';
  };
}

// Admin-specific interfaces
export interface AdminGym extends Gym {
  ownerId: string;
  branches: Branch[];
  subscriptionStatus: 'active' | 'suspended' | 'expired';
  paymentStatus: 'current' | 'overdue';
  createdAt: string;
  lastActive?: string;
}

export interface GymUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gymId: string;
  branchId?: string;
  isActive: boolean;
  joinDate: string;
}

export interface AdminSession {
  user: User;
  permissions: Permission[];
  isAdmin: boolean;
}

export interface CMSItem {
  id: string;
  name: string;
  content: string;
  type: 'text' | 'image' | 'banner';
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'paypal' | 'visa' | 'mastercard';
  logo?: string;
}

export interface PaymentInfo {
  paymentMethod: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  fullName: string;
  country: string;
  billingAddress: string;
  state: string;
  phoneNumber: string;
  zipCode: string;
  rememberMe: boolean;
}

export interface AdvertisementSubscription {
  rate: number;
  duration: number; // in days
  paymentLink: string;
  qrCode: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId?: string;
  manager?: string;
  status: 'active' | 'inactive';
  staff: GymUser[];
  clients: Client[];
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  joinDate: string;
  status: 'active' | 'inactive';
  image?: string;
  subscriptionEndDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  gymId?: string;
  branchId?: string;
}





