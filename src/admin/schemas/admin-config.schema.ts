import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminConfigDocument = AdminConfig & Document;

@Schema({ _id: false })
class MatchingWeights {
  @Prop({ default: 0.4 })
  distance: number;

  @Prop({ default: 0.4 })
  services: number;

  @Prop({ default: 0.2 })
  budget: number;
}

@Schema({ timestamps: true })
export class AdminConfig {
  @Prop({ unique: true, default: 'default' })
  configKey: string;

  @Prop({ type: Object, default: {} })
  categoryLimits: Record<string, number>;

  @Prop({ default: 5 })
  defaultCategoryLimit: number;

  @Prop({ type: MatchingWeights })
  matchingWeights: MatchingWeights;

  @Prop({ default: 10 })
  maxMatchResults: number;
}

export const AdminConfigSchema = SchemaFactory.createForClass(AdminConfig);
