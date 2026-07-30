import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentItemDocument = ContentItem & Document;

export enum ContentStatus {
  // ── Internal AI pipeline states ───────────────────────────────────────────
  PENDING = 'pending',         // legacy: kept for existing DB records
  PROCESSING = 'processing',   // AI is actively running on the item
  PROCESSED = 'processed',     // legacy: kept for existing DB records
  // ── Newsletter workflow states (matches brief exactly) ────────────────────
  NEW = 'new',                 // item just imported, awaiting AI processing
  PENDING_REVIEW = 'pending_review', // AI done, awaiting admin review
  APPROVED = 'approved',       // admin approved the content
  REJECTED = 'rejected',       // admin rejected the content
  SCHEDULED = 'scheduled',     // queued for the next newsletter
  PUBLISHED = 'published',     // content went out in a newsletter
  ARCHIVED = 'archived',       // done, moved to archive
}

export enum PriorityLevel {
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// What kind of event this article represents — determined by AI (Module 3:
// Change Detection). Distinct from "category", which is the topic (e.g.
// Staffing) rather than the type of change (e.g. Executive Appointment).
export enum ChangeType {
  NEW_REGULATION = 'new_regulation',
  UPDATED_REGULATION = 'updated_regulation',
  DEADLINE_CHANGED = 'deadline_changed',
  FUNDING_OPPORTUNITY = 'funding_opportunity',
  TECHNOLOGY_RELEASE = 'technology_release',
  SURVEY_GUIDANCE = 'survey_guidance',
  INDUSTRY_TREND = 'industry_trend',
  OWNERSHIP_CHANGE = 'ownership_change',
  EXECUTIVE_APPOINTMENT = 'executive_appointment',
  PARTNERSHIP_ANNOUNCEMENT = 'partnership_announcement',
  OTHER = 'other',
}

// Module 4 — AI Intelligence Processing
export enum UrgencyLevel {
  IMMEDIATE = 'immediate',   // act today
  THIS_WEEK = 'this_week',   // act within the week
  MONITOR = 'monitor',       // keep an eye on it, no action yet
  NO_ACTION = 'no_action',   // informational only
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum OpportunityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema({ timestamps: true })
export class ContentItem {
  // Raw / imported fields
  @Prop({ required: true, trim: true })
  sourceName: string;

  @Prop({ trim: true })
  sourceUrl: string;

  @Prop({ required: true, unique: true, trim: true })
  articleUrl: string;

  @Prop({ required: true, trim: true })
  originalTitle: string;

  @Prop()
  originalExcerpt: string;

  @Prop()
  originalContent: string;

  @Prop({ type: Date })
  originalPublishDate: Date;

  @Prop({ type: Date, default: Date.now })
  importedAt: Date;

  @Prop({ trim: true })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, enum: ContentStatus, default: ContentStatus.PENDING })
  status: ContentStatus;

  // AI-generated fields
  @Prop({ trim: true })
  aiHeadline: string;

  @Prop()
  aiSummary: string;

  @Prop()
  aiWhatThisMeans: string;

  @Prop()
  aiOperatorTakeaway: string;

  @Prop()
  aiFacebookPost: string;

  @Prop()
  aiEmailBlurb: string;

  @Prop({ type: Number, min: 1, max: 10 })
  aiRelevanceScore: number;

  // AI's classification of what kind of change this article represents
  // (Module 3 — Change Detection).
  @Prop({ enum: ChangeType, default: ChangeType.OTHER })
  changeType: ChangeType;

  // Module 4 — AI Intelligence Processing
  @Prop({ trim: true })
  aiWhoIsAffected: string;

  @Prop({ enum: UrgencyLevel, default: UrgencyLevel.MONITOR })
  urgency: UrgencyLevel;

  @Prop({ enum: RiskLevel, default: RiskLevel.LOW })
  riskLevel: RiskLevel;

  @Prop({ enum: OpportunityLevel, default: OpportunityLevel.LOW })
  opportunityLevel: OpportunityLevel;

  // Admin fields
  @Prop({ default: false })
  reviewed: boolean;

  @Prop({ default: false })
  approved: boolean;

  @Prop({ required: true, enum: PriorityLevel, default: PriorityLevel.NORMAL })
  priority: PriorityLevel;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: false })
  readyToPost: boolean;

  @Prop({ trim: true })
  notes: string;

  @Prop({ trim: true })
  editedBy: string;

  @Prop({ type: Date })
  editedAt: Date;

  @Prop({ type: Date })
  scheduledFor: Date;

  @Prop({ type: Date })
  publishedAt: Date;

  @Prop({ default: false })
  isArizonaSpecific: boolean;

  // Hash of title+excerpt at last import/update — used to detect when the
  // source has modified an article we already have (Source Monitoring).
  @Prop({ trim: true })
  contentHash: string;

  @Prop({ default: false })
  contentUpdated: boolean;

  @Prop({ type: Date })
  contentUpdatedAt: Date;
}

export const ContentItemSchema = SchemaFactory.createForClass(ContentItem);

ContentItemSchema.index(
  { originalTitle: 'text', aiHeadline: 'text', aiSummary: 'text', originalExcerpt: 'text' },
);
ContentItemSchema.index({ status: 1 });
ContentItemSchema.index({ category: 1 });
ContentItemSchema.index({ approved: 1 });
ContentItemSchema.index({ priority: 1 });
ContentItemSchema.index({ changeType: 1 });
ContentItemSchema.index({ urgency: 1 });
ContentItemSchema.index({ riskLevel: 1 });
ContentItemSchema.index({ importedAt: -1 });
