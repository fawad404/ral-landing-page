import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type AvailabilityResponseDocument = AvailabilityResponse & Document;

export enum ResponseType {
  INTERESTED = 'interested',
  MORE_INFO = 'more_info',
  NOT_INTERESTED = 'not_interested',
}

@Schema({ timestamps: true })
export class AvailabilityResponse {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AvailabilityRequest', required: true })
  requestId: Types.ObjectId;

  @Prop({ enum: ResponseType, required: true })
  responseType: string;

  @Prop({ trim: true })
  facilityName: string;

  @Prop({ trim: true })
  contactName: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true, lowercase: true })
  email: string;

  @Prop({ type: Number })
  availableBedCount: number;

  @Prop({ trim: true })
  notes: string;
}

export const AvailabilityResponseSchema = SchemaFactory.createForClass(AvailabilityResponse);
