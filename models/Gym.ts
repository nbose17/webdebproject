import mongoose, { Schema, Document } from 'mongoose';

export interface IGym extends Document {
  name: string;
  location: string;
  image: string;
  featured: boolean;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  subscriptionStatus: 'active' | 'suspended' | 'expired';
  paymentStatus: 'current' | 'overdue';
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GymSchema = new Schema<IGym>(
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

export default mongoose.models.Gym || mongoose.model<IGym>('Gym', GymSchema);


