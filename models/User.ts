import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/lib/types';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  permissions?: Array<{
    resource: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
  }>;
  gymId?: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema({
  resource: { type: String, required: true },
  actions: [{ type: String, enum: ['create', 'read', 'update', 'delete'] }],
});

const UserSchema = new Schema<IUser>(
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

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

