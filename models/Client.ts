import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  gymId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  image?: string;
  subscriptionEndDate?: Date;
  contractStartDate?: Date;
  contractEndDate?: Date;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
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

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);


