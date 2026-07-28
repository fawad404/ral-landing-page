import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { DemoInquiryType } from '../schemas/demo-inquiry.schema';

export class CreateDemoInquiryDto {
  @IsEnum(DemoInquiryType)
  type: DemoInquiryType;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Discharge-planner fields
  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  role?: string;

  // Preferred-partner fields
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  serviceCategory?: string;

  // Facility fields
  @IsOptional()
  @IsString()
  facilityName?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  beds?: string;

  @IsOptional()
  @IsString()
  availability?: string;
}
