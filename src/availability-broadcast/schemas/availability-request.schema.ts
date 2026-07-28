import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvailabilityRequestDocument = AvailabilityRequest & Document;

@Schema({ timestamps: true })
export class AvailabilityRequest {
  @Prop({ required: true, trim: true })
  contactName: string;

  @Prop({ required: true, trim: true })
  organization: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  preferredArea: string;

  @Prop({ type: [String], required: true })
  careTypes: string[];

  @Prop({ required: true })
  paymentType: string;

  @Prop({ required: true })
  moveTimeline: string;

  @Prop({ trim: true, default: '' })
  notes: string;

  @Prop({ default: 'broadcasted' })
  status: string;

  @Prop({ type: Date })
  broadcastedAt: Date;
}

export const AvailabilityRequestSchema = SchemaFactory.createForClass(AvailabilityRequest);
