import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadType } from '../schemas/lead.schema';

export class CreateLeadDto {
  @IsEnum(LeadType)
  type: LeadType;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Facility fields
  @IsOptional()
  @IsString()
  homeName?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  beds?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  situation?: string;

  @IsOptional()
  @IsString()
  referrals?: string;

  // Partner fields
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  serviceArea?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
