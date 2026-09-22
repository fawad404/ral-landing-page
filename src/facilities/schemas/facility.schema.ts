import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type FacilityDocument = Facility & Document;

export enum FacilityStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ _id: false })
class Address {
  @Prop({ trim: true })
  street: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true })
  state: string;

  @Prop({ trim: true })
  zipCode: string;

  @Prop({ trim: true, default: 'USA' })
  country: string;
}

@Schema({ _id: false })
class Pricing {
  @Prop({ default: 0 })
  min: number;

  @Prop({ default: 0 })
  max: number;

  @Prop({ default: 'USD' })
  currency: string;
}

@Schema({ _id: false })
export class FacilityPhoto {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop()
  label: string;

  @Prop({ type: Date, default: Date.now })
  uploadedAt: Date;
}

@Schema({ _id: false })
class SocialMedia {
  @Prop({ trim: true, default: '' })
  facebook: string;

  @Prop({ trim: true, default: '' })
  instagram: string;

  @Prop({ trim: true, default: '' })
  linkedin: string;
}

@Schema({ _id: false })
class FacilityPolicies {
  @Prop({ default: '' })
  admission: string;

  @Prop({ default: '' })
  discharge: string;

  @Prop({ default: '' })
  visitor: string;

  @Prop({ default: '' })
  medication: string;

  @Prop({ default: '' })
  emergency: string;

  @Prop({ default: '' })
  privacy: string;
}

@Schema({ timestamps: true })
export class Facility {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ default: 0, min: 0 })
  capacity: number;

  @Prop({ default: 0, min: 0 })
  availabilityCount: number;

  @Prop({ enum: FacilityStatus, default: FacilityStatus.PENDING })
  status: FacilityStatus;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date;

  @Prop({ default: false })
  isFlagged: boolean;

  @Prop()
  description: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  secondaryPhone: string;

  @Prop({ trim: true })
  fax: string;

  @Prop({ trim: true, lowercase: true })
  email: string;

  @Prop({ type: Pricing })
  pricing: Pricing;

  @Prop()
  website: string;

  @Prop({ type: SocialMedia })
  socialMedia: SocialMedia;

  @Prop({ trim: true })
  adminName: string;

  @Prop({ trim: true })
  licenseType: string;

  @Prop({ trim: true, default: 'None' })
  genderPreference: string;

  @Prop({ type: [FacilityPhoto], default: [] })
  photos: FacilityPhoto[];

  @Prop({ type: FacilityPolicies })
  policies: FacilityPolicies;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
