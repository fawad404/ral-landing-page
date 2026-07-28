import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentStatus, PriorityLevel } from '../schemas/content-item.schema';

export class UpdateContentItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiHeadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiSummary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiWhatThisMeans?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiOperatorTakeaway?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiFacebookPost?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiEmailBlurb?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @ApiPropertyOptional({ enum: PriorityLevel })
  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readyToPost?: boolean;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'ISO date string for when this item is scheduled to go out in the newsletter' })
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;
}
