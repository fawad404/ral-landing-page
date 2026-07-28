import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StaffCredentialDocument = StaffCredential & Document;

export enum CredentialType {
  FINGERPRINT_CLEARANCE = 'fingerprint_clearance',
  CPR_FIRST_AID = 'cpr_first_aid',
  TB_TEST = 'tb_test',
  FOOD_HANDLER = 'food_handler',
  ALZHEIMERS_TRAINING = 'alzheimers_training',
  MANAGER_CERTIFICATION = 'manager_certification',
  CNA = 'cna',
  MEDICATION_AIDE = 'medication_aide',
  DIRECT_CARE_WORKER = 'direct_care_worker',
  OTHER = 'other',
}

export enum CredentialStatus {
  VALID = 'valid',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class StaffCredential {
  @Prop({ type: Types.ObjectId, ref: 'Facility', required: true, index: true })
  facilityId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  staffName: string;

  @Prop({ required: true, trim: true })
  role: string;

  @Prop({ enum: CredentialType, required: true })
  credentialType: CredentialType;

  @Prop({ trim: true })
  credentialName: string;

  @Prop()
  issueDate: Date;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ enum: CredentialStatus, default: CredentialStatus.VALID })
  status: CredentialStatus;

  @Prop({ trim: true })
  notes: string;
}

export const StaffCredentialSchema = SchemaFactory.createForClass(StaffCredential);
