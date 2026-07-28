import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

export enum LeadType {
  FACILITY = 'facility',
  PARTNER = 'partner',
}

export enum LeadStatus {
  NEW = 'new',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Lead {
  @Prop({ enum: LeadType, required: true })
  type: LeadType;

  @Prop({ enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  // Shared
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  // Facility-specific
  @Prop({ trim: true })
  homeName: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true })
  beds: string;

  @Prop({ trim: true })
  availability: string;

  @Prop({ trim: true })
  situation: string;

  @Prop({ trim: true })
  referrals: string;

  // Partner-specific
  @Prop({ trim: true })
  companyName: string;

  @Prop({ trim: true })
  role: string;

  @Prop({ trim: true })
  serviceArea: string;

  @Prop({ trim: true })
  description: string;

  // Admin notes
  @Prop({ trim: true })
  adminNotes: string;

  // Linked user account (set after admin creates account)
  @Prop({ trim: true })
  linkedUserId: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
