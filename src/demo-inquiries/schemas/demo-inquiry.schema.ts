import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DemoInquiryDocument = DemoInquiry & Document;

export enum DemoInquiryType {
  DISCHARGE_PLANNER = 'discharge-planner',
  FACILITY = 'facility',
  PREFERRED_PARTNER = 'preferred-partner',
}

export enum DemoInquiryStatus {
  NEW = 'new',
  REVIEWED = 'reviewed',
}

@Schema({ timestamps: true, collection: 'demo_inquiries' })
export class DemoInquiry {
  @Prop({ enum: DemoInquiryType, required: true })
  type: DemoInquiryType;

  @Prop({ enum: DemoInquiryStatus, default: DemoInquiryStatus.NEW })
  status: DemoInquiryStatus;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  // Discharge-planner fields
  @Prop({ trim: true })
  organization: string;

  @Prop({ trim: true })
  role: string;

  // Facility fields
  @Prop({ trim: true })
  facilityName: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true })
  beds: string;

  @Prop({ trim: true })
  availability: string;

  // Preferred-partner fields
  @Prop({ trim: true })
  company: string;

  @Prop({ trim: true })
  serviceCategory: string;

  @Prop({ trim: true })
  adminNotes: string;
}

export const DemoInquirySchema = SchemaFactory.createForClass(DemoInquiry);
