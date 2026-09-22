import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ComplianceTaskDocument = ComplianceTask & Document;

export enum TaskCategory {
  DOCUMENTATION = 'documentation',
  STAFFING = 'staffing',
  MEDICATION = 'medication',
  SAFETY = 'safety',
  TRAINING = 'training',
  SURVEY_PREP = 'survey_prep',
  INFECTION_CONTROL = 'infection_control',
  RESIDENT_CARE = 'resident_care',
  OTHER = 'other',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TaskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

@Schema({ timestamps: true })
export class ComplianceTask {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Facility', required: true, index: true })
  facilityId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ enum: TaskCategory, default: TaskCategory.OTHER })
  category: TaskCategory;

  @Prop({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @Prop()
  dueDate: Date;

  @Prop({ trim: true })
  assignedTo: string;

  @Prop({ default: false })
  isRecurring: boolean;

  @Prop({ enum: RecurringFrequency })
  recurringFrequency: RecurringFrequency;

  @Prop()
  completedAt: Date;

  @Prop({ trim: true })
  completedBy: string;

  @Prop({ trim: true })
  notes: string;
}

export const ComplianceTaskSchema = SchemaFactory.createForClass(ComplianceTask);
