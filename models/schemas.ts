/**
 * Schema definitions that can be used with different database connections
 */

import mongoose, { Schema } from 'mongoose';
import { UserRole } from '@/lib/types';

// Permission Schema
export const PermissionSchema = new Schema({
  resource: { type: String, required: true },
  actions: [{ type: String, enum: ['create', 'read', 'update', 'delete'] }],
});

// User Schema
export const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    permissions: [PermissionSchema],
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym' },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ gymId: 1 });
UserSchema.index({ role: 1 });

// Gym Schema
export const GymSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, default: '/images/gym-placeholder.jpg' },
    featured: { type: Boolean, default: false },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'suspended', 'expired'],
      default: 'active',
    },
    paymentStatus: {
      type: String,
      enum: ['current', 'overdue'],
      default: 'current',
    },
    lastActive: { type: Date },
  },
  {
    timestamps: true,
  }
);

GymSchema.index({ ownerId: 1 });
GymSchema.index({ subscriptionStatus: 1 });
GymSchema.index({ paymentStatus: 1 });

// Branch Schema
export const BranchSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

BranchSchema.index({ gymId: 1 });
BranchSchema.index({ managerId: 1 });

// Client Schema
export const ClientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    membershipType: { type: String, required: true },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    image: { type: String },
    subscriptionEndDate: { type: Date },
    contractStartDate: { type: Date },
    contractEndDate: { type: Date },
    joinDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ClientSchema.index({ gymId: 1 });
ClientSchema.index({ branchId: 1 });
ClientSchema.index({ email: 1 });

// Subscription Schema
export const SubscriptionSchema = new Schema(
  {
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    planType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'suspended', 'expired', 'cancelled'],
      default: 'active',
    },
    amount: { type: Number, required: true },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.index({ gymId: 1 });
SubscriptionSchema.index({ status: 1 });

// Contract Template Schema
export const ContractTemplateSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    variables: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// ID Card Element Schema
const IDCardElementSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'qr'], required: true },
  content: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  fontSize: { type: Number },
  fontFamily: { type: String },
  color: { type: String },
  backgroundColor: { type: String },
  borderWidth: { type: Number },
  borderColor: { type: String },
  borderRadius: { type: Number },
});

// ID Card Template Schema
export const IDCardTemplateSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    width: { type: Number, default: 336 },
    height: { type: Number, default: 212 },
    backgroundColor: { type: String, default: '#FFFFFF' },
    elements: [IDCardElementSchema],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// CMS Schema - stores gym's public page content and branding
export const CMSSchema = new Schema(
  {
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, unique: true },
    // Hero Section
    heroSubHeading: { type: String, default: 'STAY HEALTHY, STAY FIT' },
    heroMainHeading: { type: String, default: 'GET IN SHAPE NOW' },
    heroDescription: { type: String, default: 'Train in the fitness gym and explore all benefits' },
    heroBackgroundImage: { type: String, default: '/images/gym-placeholder.jpg' },
    heroButton1Text: { type: String, default: 'See All Classes' },
    heroButton2Text: { type: String, default: 'View Plans' },
    // Feature Section
    featureHeading: { type: String, default: 'Feature Heading' },
    featureSubHeading: { type: String, default: 'Feature Content' },
    featureBannerContent: { type: String, default: 'Feature Banner Content' },
    // Section Headings
    classesHeading: { type: String, default: 'Class List Heading' },
    classesSubHeading: { type: String, default: 'Class List Sub Heading' },
    plansHeading: { type: String, default: 'Plan List Heading' },
    plansSubHeading: { type: String, default: 'Plan List Sub Heading' },
    trainersHeading: { type: String, default: 'Trainer List Heading' },
    trainersSubHeading: { type: String, default: 'Trainer List Sub Heading' },
    // Newsletter Section
    newsletterHeading: { type: String, default: 'GET CONNECTED WITH US' },
    newsletterSubHeading: { type: String, default: 'Join our community for motivation' },
    newsletterButtonText: { type: String, default: 'Join Now' },
    // Branding & Contact
    gymLogo: { type: String, default: '/images/logo.png' },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
    businessHours: { type: String },
    facebookUrl: { type: String },
    twitterUrl: { type: String },
    instagramUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

CMSSchema.index({ gymId: 1 }, { unique: true });

// Plan Schema - stored in gym's database
export const PlanSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

PlanSchema.index({ gymId: 1 });

// Class Schema - stored in gym's database
export const ClassSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    numberOfClasses: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
  },
  {
    timestamps: true,
  }
);

ClassSchema.index({ gymId: 1 });

// Trainer Schema - stored in gym's database
export const TrainerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    image: { type: String, default: '/images/trainer-placeholder.jpg' },
    bio: { type: String },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
  },
  {
    timestamps: true,
  }
);

TrainerSchema.index({ gymId: 1 });


