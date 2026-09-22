import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type SocialBoostDocument = SocialBoost & Document;

export enum SocialBoostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  POSTED = 'posted',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class SocialBoost {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Facility', required: true })
  facilityId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  facilityName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  submittedBy: Types.ObjectId;

  @Prop({ required: true })
  caption: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, trim: true })
  channel: string;

  @Prop()
  fileUrl: string;

  @Prop({ enum: SocialBoostStatus, default: SocialBoostStatus.PENDING })
  status: SocialBoostStatus;

  @Prop()
  reviewNotes: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop({ type: Date })
  reviewedAt: Date;
}

export const SocialBoostSchema = SchemaFactory.createForClass(SocialBoost);
