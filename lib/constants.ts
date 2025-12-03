import { Gym, Plan, Class, Trainer, CMSItem, PaymentMethod } from './types';

// Mock Gyms Data
export const mockGyms: Gym[] = [
  {
    id: '1',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: true,
    description: 'Modern fitness facility with state-of-the-art equipment',
  },
  {
    id: '2',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: true,
  },
  {
    id: '3',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: true,
  },
  {
    id: '4',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: true,
  },
  {
    id: '5',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: true,
  },
  {
    id: '6',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: true,
  },
  {
    id: '7',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: false,
  },
  {
    id: '8',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: false,
  },
  {
    id: '9',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: false,
  },
  {
    id: '10',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: false,
  },
  {
    id: '11',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: false,
  },
  {
    id: '12',
    name: 'FITNESS GYM',
    location: 'Uralskaya, EKB',
    image: '/images/gym-placeholder.jpg',
    featured: false,
  },
];

// Mock Plans Data
export const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Bronze',
    duration: '3 Months',
    price: 300,
  },
  {
    id: '2',
    name: 'Silver',
    duration: '6 Months',
    price: 500,
  },
  {
    id: '3',
    name: 'Gold',
    duration: '9 Months',
    price: 750,
  },
  {
    id: '4',
    name: 'Diamond',
    duration: '1 Year',
    price: 999,
  },
  {
    id: '5',
    name: 'Life Membership',
    duration: 'Unlimited',
    price: 3000,
  },
];

// Mock Classes Data
export const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Cardio',
    duration: '1 Hour',
    numberOfClasses: 10,
    price: 300,
    description: 'Cardio training description',
  },
  {
    id: '2',
    name: 'Strength Training',
    duration: '1.5 Hours',
    numberOfClasses: 10,
    price: 300,
    description: 'Strength training description',
  },
  {
    id: '3',
    name: 'Kalesthenics',
    duration: '45 Minutes',
    numberOfClasses: 10,
    price: 300,
    description: 'Kalesthenics training description',
  },
  {
    id: '4',
    name: 'Muscle Building',
    duration: '1 Hour',
    numberOfClasses: 10,
    price: 300,
    description: 'Muscle building description',
  },
  {
    id: '5',
    name: 'Powerlifting',
    duration: '1 Hour',
    numberOfClasses: 10,
    price: 300,
    description: 'Powerlifting description',
  },
];

// Mock Trainers Data
export const mockTrainers: Trainer[] = [
  {
    id: '1',
    name: 'Jack',
    experience: '3+ Years',
    image: '/images/trainer-placeholder.jpg',
    bio: 'Certified personal trainer',
  },
  {
    id: '2',
    name: 'John',
    experience: '6+ Years',
    image: '/images/trainer-placeholder.jpg',
    bio: 'Expert in strength training',
  },
  {
    id: '3',
    name: 'Jim',
    experience: '9+ Years',
    image: '/images/trainer-placeholder.jpg',
    bio: 'Specialized in cardio fitness',
  },
  {
    id: '4',
    name: 'Dori',
    experience: '5+ Years',
    image: '/images/trainer-placeholder.jpg',
    bio: 'Yoga and flexibility expert',
  },
  {
    id: '5',
    name: 'Alex',
    experience: '8+ Years',
    image: '/images/trainer-placeholder.jpg',
    bio: 'Nutrition and fitness coach',
  },
];

// Mock CMS Items Data
export const mockCMSItems: CMSItem[] = [
  {
    id: '1',
    name: 'Hero Section Main',
    content: 'STAY HEALTHY, STAY FIT',
    type: 'text',
  },
  {
    id: '2',
    name: 'Hero Section Sub',
    content: 'GET IN SHAPE NOW',
    type: 'text',
  },
  {
    id: '3',
    name: 'Feature Banner',
    content: 'Feature Banner',
    type: 'banner',
  },
  {
    id: '4',
    name: 'Business Logo',
    content: '/images/logo.png',
    type: 'image',
  },
  {
    id: '5',
    name: 'Business Timing',
    content: 'Monday - Saturday\n6:00 - 22:00',
    type: 'text',
  },
  {
    id: '6',
    name: 'Business Email',
    content: 'contact@fitness.com',
    type: 'text',
  },
  {
    id: '7',
    name: 'Business Contact',
    content: '9999999999',
    type: 'text',
  },
];

// Mock Payment Methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'PayPal',
    type: 'paypal',
  },
  {
    id: '2',
    name: 'VISA',
    type: 'visa',
  },
];

// Mock User Data
export const mockUser: User = {
  id: '1',
  email: 'owner@fitness.com',
  name: 'Gym Owner',
  role: 'gym_owner',
};

// Advertisement Subscription Info
export const advertisementSubscription = {
  rate: 5,
  duration: 30,
  paymentLink: 'https://fitnessclub.com',
  qrCode: 'https://fitnessclub.com',
};

