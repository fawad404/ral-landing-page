import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  ChangeType,
  ContentStatus,
  OpportunityLevel,
  PriorityLevel,
  RiskLevel,
  UrgencyLevel,
} from '../schemas/content-item.schema';

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

  @ApiPropertyOptional({ enum: ChangeType, description: 'What kind of change this article represents' })
  @IsOptional()
  @IsEnum(ChangeType)
  changeType?: ChangeType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiWhoIsAffected?: string;

  @ApiPropertyOptional({ enum: UrgencyLevel })
  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgency?: UrgencyLevel;

  @ApiPropertyOptional({ enum: RiskLevel })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ enum: OpportunityLevel })
  @IsOptional()
  @IsEnum(OpportunityLevel)
  opportunityLevel?: OpportunityLevel;

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
