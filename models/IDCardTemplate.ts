import mongoose, { Schema, Document } from 'mongoose';

export interface IIDCardElement {
  id: string;
  type: 'text' | 'image' | 'qr';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}

export interface IIDCardTemplate extends Document {
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: IIDCardElement[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IDCardElementSchema = new Schema<IIDCardElement>({
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

const IDCardTemplateSchema = new Schema<IIDCardTemplate>(
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

export default mongoose.models.IDCardTemplate || mongoose.model<IIDCardTemplate>('IDCardTemplate', IDCardTemplateSchema);

