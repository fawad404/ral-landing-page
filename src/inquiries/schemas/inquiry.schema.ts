import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type InquiryDocument = Inquiry & Document;

export enum InquiryStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  PLACED = 'placed',
  CLOSED = 'closed',
}

@Schema({ _id: false })
class FamilyData {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  relationship: string;
}

@Schema({ _id: false })
class Budget {
  @Prop({ default: 0 })
  min: number;

  @Prop({ default: 0 })
  max: number;
}

@Schema({ _id: false })
class Requirements {
  @Prop({ trim: true })
  zipCode: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ type: Budget })
  budget: Budget;

  @Prop({ trim: true })
  roomType: string;

  @Prop({ trim: true })
  urgency: string;

  @Prop()
  notes: string;
}

@Schema({ _id: false })
class MatchHistoryEntry {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Facility' })
  facilityId: Types.ObjectId;

  @Prop()
  reason: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ type: Date, default: Date.now })
  assignedAt: Date;

  @Prop({ default: false })
  isManualOverride: boolean;
}

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ type: FamilyData, required: true })
  familyData: FamilyData;

  @Prop({ type: Requirements })
  requirements: Requirements;

  @Prop({ enum: InquiryStatus, default: InquiryStatus.NEW })
  status: InquiryStatus;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Facility' }], default: [] })
  assignedFacilityIds: Types.ObjectId[];

  @Prop({ default: '' })
  matchReason: string;

  @Prop()
  notes: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  assignedTo: Types.ObjectId | null;

  @Prop({ type: [MatchHistoryEntry], default: [] })
  matchHistory: MatchHistoryEntry[];
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
