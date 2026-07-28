import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, enum: Role, default: Role.FACILITY })
  role: Role;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLogin: Date | null;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ trim: true })
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
});
