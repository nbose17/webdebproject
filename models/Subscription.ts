import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  gymId: mongoose.Types.ObjectId;
  planType: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'suspended' | 'expired' | 'cancelled';
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
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

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

