import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ComplianceIncidentDocument = ComplianceIncident & Document;

export enum IncidentType {
  FALL = 'fall',
  MEDICATION_ERROR = 'medication_error',
  ELOPEMENT = 'elopement',
  ABUSE_NEGLECT = 'abuse_neglect',
  INJURY = 'injury',
  ILLNESS_OUTBREAK = 'illness_outbreak',
  PROPERTY_DAMAGE = 'property_damage',
  BEHAVIORAL = 'behavioral',
  OTHER = 'other',
}

export enum IncidentSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
}

export enum IncidentStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  REPORTED_TO_ADHS = 'reported_to_adhs',
}

@Schema({ timestamps: true })
export class ComplianceIncident {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Facility', required: true, index: true })
  facilityId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ enum: IncidentType, required: true })
  type: IncidentType;

  @Prop({ enum: IncidentSeverity, required: true })
  severity: IncidentSeverity;

  @Prop({ required: true })
  incidentDate: Date;

  @Prop()
  reportedDate: Date;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: [String], default: [] })
  residentsInvolved: string[];

  @Prop({ type: [String], default: [] })
  staffInvolved: string[];

  @Prop({ type: [String], default: [] })
  witnessNames: string[];

  @Prop({ trim: true })
  immediateActions: string;

  @Prop({ default: false })
  followUpRequired: boolean;

  @Prop()
  followUpDate: Date;

  @Prop({ trim: true })
  followUpNotes: string;

  @Prop({ default: false })
  reportedToAdhs: boolean;

  @Prop()
  adhsReportDate: Date;

  @Prop({ trim: true })
  adhsReportNumber: string;

  @Prop({ enum: IncidentStatus, default: IncidentStatus.OPEN })
  status: IncidentStatus;

  @Prop()
  resolvedAt: Date;
}

export const ComplianceIncidentSchema = SchemaFactory.createForClass(ComplianceIncident);
