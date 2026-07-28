import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SourceDocument = Source & Document;

export enum SourceType {
  RSS = 'rss',
  SCRAPE = 'scrape',
  MANUAL = 'manual',
}

export enum SourceTier {
  TIER1 = 'tier1',
  TIER2 = 'tier2',
  TIER3 = 'tier3',
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

  @Prop({ required: true, enum: SourceTier, default: SourceTier.TIER1 })
  tier: SourceTier;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: Date, default: null })
  lastFetchedAt: Date | null;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
