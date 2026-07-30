import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SourceDocument = Source & Document;

export enum SourceType {
  RSS = 'rss',
  SCRAPE = 'scrape',
  MANUAL = 'manual',
}

export enum SourcePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TrustLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  FAILING = 'failing',
}

@Schema({ timestamps: true })
export class Source {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  rssUrl: string;

  @Prop({ trim: true })
  websiteUrl: string;

  @Prop({ required: true, enum: SourceType, default: SourceType.RSS })
  type: SourceType;

  @Prop({ trim: true, default: 'Assisted Living' })
  industry: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: Number, default: 2, min: 0.5 })
  scanFrequencyHours: number;

  @Prop({ required: true, enum: SourcePriority, default: SourcePriority.MEDIUM })
  priority: SourcePriority;

  @Prop({ required: true, enum: TrustLevel, default: TrustLevel.MEDIUM })
  trustLevel: TrustLevel;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ trim: true })
  description: string;

  // Updated on every scan attempt, success or failure
  @Prop({ type: Date, default: null })
  lastScanAt: Date | null;

  // Updated only when a scan successfully fetches the feed
  @Prop({ type: Date, default: null })
  lastSuccessfulScanAt: Date | null;

  @Prop({ required: true, enum: HealthStatus, default: HealthStatus.HEALTHY })
  healthStatus: HealthStatus;

  @Prop({ type: Number, default: 0 })
  consecutiveFailures: number;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
