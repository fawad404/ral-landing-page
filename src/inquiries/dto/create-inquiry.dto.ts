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

export class FamilyDataDto {
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

export class BudgetDto {
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

export class RequirementsDto {
  @ApiPropertyOptional({ example: '90210' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ type: [String], example: ['Memory Care', 'Assisted Living'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({ type: BudgetDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BudgetDto)
  budget?: BudgetDto;

  @ApiPropertyOptional({ example: 'Private' })
  @IsOptional()
  @IsString()
  roomType?: string;

  @ApiPropertyOptional({ example: 'Within 30 days' })
  @IsOptional()
  @IsString()
  urgency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateInquiryDto {
  @ApiProperty({ type: FamilyDataDto })
  @IsObject()
  @ValidateNested()
  @Type(() => FamilyDataDto)
  familyData: FamilyDataDto;

  @ApiPropertyOptional({ type: RequirementsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RequirementsDto)
  requirements?: RequirementsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
