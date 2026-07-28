import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DealRoomRequestDocument = DealRoomRequest & Document;

export enum DealRoomStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class DealRoomRequest {
  @Prop({ type: Types.ObjectId, ref: 'Facility', required: true })
  facilityId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  facilityName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ enum: DealRoomStatus, default: DealRoomStatus.PENDING })
  status: DealRoomStatus;

  @Prop()
  rejectionReason: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop({ type: Date })
  reviewedAt: Date;
}

export const DealRoomRequestSchema = SchemaFactory.createForClass(DealRoomRequest);
