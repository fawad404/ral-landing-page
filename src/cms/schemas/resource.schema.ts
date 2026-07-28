import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResourceDocument = Resource & Document;

export enum ResourceType {
  BLOG = 'blog',
  GUIDANCE = 'guidance',
  DIRECTORY = 'directory',
}

@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ResourceType, required: true })
  type: ResourceType;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  authorId: Types.ObjectId | null;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  excerpt: string;

  @Prop()
  featuredImage: string;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
