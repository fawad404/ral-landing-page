import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartnerDocument = Partner & Document;

export enum PartnerStatus {
  PENDING   = 'pending',
  APPROVED  = 'approved',
  REJECTED  = 'rejected',
}

@Schema({ _id: false })
class ContactInfo {
  @Prop({ trim: true, lowercase: true }) email: string;
  @Prop({ trim: true })                  phone: string;
  @Prop({ trim: true })                  website: string;
  @Prop({ trim: true })                  address: string;
}

@Schema({ timestamps: true })
export class Partner {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  category: string;

  @Prop({ required: true, enum: PartnerStatus, default: PartnerStatus.PENDING })
  status: PartnerStatus;

  @Prop({ default: false })
  isVisible: boolean;

  @Prop({ default: 0 })
  orderWeight: number;

  @Prop({ type: ContactInfo })
  contactInfo: ContactInfo;

  @Prop()
  description: string;

  @Prop()
  logoUrl: string;

  @Prop()
  logoPublicId: string;

  @Prop({ trim: true })
  rejectionReason: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
