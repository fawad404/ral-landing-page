import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SourcePriority, SourceType, TrustLevel } from '../schemas/source.schema';

export class CreateSourceDto {
  @ApiProperty({ example: "McKnight's Senior Living" })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://www.mcknightsseniorliving.com/feed/' })
  @IsString()
  rssUrl: string;

  @ApiPropertyOptional({ example: 'https://www.mcknightsseniorliving.com' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ enum: SourceType, default: SourceType.RSS })
  @IsOptional()
  @IsEnum(SourceType)
  type?: SourceType;

  @ApiPropertyOptional({ example: 'Assisted Living', default: 'Assisted Living' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Compliance & Regulatory', 'Staffing & Caregiver News'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    example: 2,
    default: 2,
    description: 'How often (in hours) this source should be scanned',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  scanFrequencyHours?: number;

  @ApiPropertyOptional({ enum: SourcePriority, default: SourcePriority.MEDIUM })
  @IsOptional()
  @IsEnum(SourcePriority)
  priority?: SourcePriority;

  @ApiPropertyOptional({ enum: TrustLevel, default: TrustLevel.MEDIUM })
  @IsOptional()
  @IsEnum(TrustLevel)
  trustLevel?: TrustLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
