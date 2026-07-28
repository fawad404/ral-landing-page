import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CaregiverStatus } from '../schemas/caregiver.schema';

export class CreateCaregiverDto {
  @ApiProperty({ example: 'Maria' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Gonzalez' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ default: 'AZ' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ type: [String], example: ['Phoenix', 'Glendale'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workAreas?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Morning', 'Weekdays'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availability?: string[];

  @ApiPropertyOptional({ type: [String], example: ['CPR', 'CNA'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  experienceYears?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  availableNow?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ enum: CaregiverStatus })
  @IsOptional()
  @IsEnum(CaregiverStatus)
  status?: CaregiverStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  // When true and email already exists: update existing record instead of throwing conflict
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  confirmUpdate?: boolean;
}
