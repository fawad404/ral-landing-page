import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DealRoomListingDocument = DealRoomListing & Document;

export enum ListingType {
  EQUIPMENT = 'equipment',
  REAL_ESTATE = 'real-estate',
  SUPPLIES = 'supplies',
  OTHER = 'other',
}

export enum ListingCondition {
  NEW = 'new',
  USED = 'used',
  AS_IS = 'as-is',
}

@Schema({ timestamps: true })
export class DealRoomListing {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ enum: ListingType, required: true })
  type: ListingType;

  @Prop({ enum: ListingCondition, default: ListingCondition.USED })
  condition: ListingCondition;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: false })
  priceNegotiable: boolean;

  @Prop()
  imageUrl: string;

  @Prop()
  imagePublicId: string;

  @Prop({ type: Types.ObjectId, ref: 'Facility', required: true })
  facilityId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  facilityName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ trim: true })
  contactEmail: string;

  @Prop({ trim: true })
  contactPhone: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const DealRoomListingSchema = SchemaFactory.createForClass(DealRoomListing);
