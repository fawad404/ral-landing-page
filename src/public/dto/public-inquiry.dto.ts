import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PublicFamilyDataDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1-555-000-0000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Daughter' })
  @IsOptional()
  @IsString()
  relationship?: string;
}

export class PublicBudgetDto {
  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max?: number;
}

export class PublicRequirementsDto {
  @ApiPropertyOptional({ example: '90210' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ type: [String], example: ['Memory Care', 'Assisted Living'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({ type: PublicBudgetDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PublicBudgetDto)
  budget?: PublicBudgetDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urgency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PublicInquiryDto {
  @ApiProperty({ type: PublicFamilyDataDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PublicFamilyDataDto)
  familyData: PublicFamilyDataDto;

  @ApiPropertyOptional({ type: PublicRequirementsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PublicRequirementsDto)
  requirements?: PublicRequirementsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
