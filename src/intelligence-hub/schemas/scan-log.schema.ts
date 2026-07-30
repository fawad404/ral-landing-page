import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScanLogDocument = ScanLog & Document;

export enum ScanOutcome {
  SUCCESS = 'success',
  FAILED = 'failed',
}

// One record per source per scan attempt — the persistent history that lets
// an admin see which sources were scanned, which failed, and which produced
// new intelligence (Module 2 — Source Monitoring).
@Schema({ timestamps: true })
export class ScanLog {
  @Prop({ type: Types.ObjectId, ref: 'Source', required: true })
  sourceId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  sourceName: string;

  @Prop({ required: true, type: Date })
  scannedAt: Date;

  @Prop({ required: true, enum: ScanOutcome })
  outcome: ScanOutcome;

  @Prop({ default: 0 })
  imported: number;

  @Prop({ default: 0 })
  modified: number;

  @Prop({ default: 0 })
  alreadyExists: number;

  @Prop({ default: 0 })
  notRelevant: number;

  @Prop({ trim: true })
  errorMessage: string;

  @Prop({ default: false })
  triggeredManually: boolean;
}

export const ScanLogSchema = SchemaFactory.createForClass(ScanLog);
ScanLogSchema.index({ scannedAt: -1 });
ScanLogSchema.index({ sourceId: 1, scannedAt: -1 });
ScanLogSchema.index({ outcome: 1 });
