import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaregiverDocument = Caregiver & Document;

export enum CaregiverStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Caregiver {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true, default: 'AZ' })
  state: string;

  @Prop({ trim: true })
  zipCode: string;

  // Multi-select preferred work areas (Phoenix, Glendale, Peoria, etc.)
  @Prop({ type: [String], default: [] })
  workAreas: string[];

  // Shift types: Morning, Afternoon, Evening, Overnight, Weekdays, Weekends, PRN, Live-In
  @Prop({ type: [String], default: [] })
  availability: string[];

  // Credentials: CPR, Fingerprint Card, Caregiver Certificate, Med Tech, CNA, Dementia Experience, Hospice Experience
  @Prop({ type: [String], default: [] })
  certifications: string[];

  @Prop({ type: [String], default: [] })
  specializations: string[];

  @Prop({ default: 0, min: 0 })
  experienceYears: number;

  @Prop({ default: false })
  availableNow: boolean;

  @Prop({ default: '' })
  bio: string;

  @Prop({ enum: CaregiverStatus, default: CaregiverStatus.PENDING })
  status: CaregiverStatus;

  @Prop({ default: true })
  isVisible: boolean;
}

export const CaregiverSchema = SchemaFactory.createForClass(Caregiver);
