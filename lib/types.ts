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
  duration: string;
  price: number;
}

export interface Class {
  id: string;
  name: string;
  duration: string;
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'gym_owner' | 'admin';
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





