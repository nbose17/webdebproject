import mongoose, { Schema, Document } from 'mongoose';

export interface IContractTemplate extends Document {
  name: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContractTemplateSchema = new Schema<IContractTemplate>(
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

export default mongoose.models.ContractTemplate || mongoose.model<IContractTemplate>('ContractTemplate', ContractTemplateSchema);

