import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  gymId: mongoose.Types.ObjectId;
  managerId?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
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

export default mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);

