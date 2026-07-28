import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SourceTier, SourceType } from '../schemas/source.schema';

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

  @ApiPropertyOptional({ enum: SourceTier, default: SourceTier.TIER1 })
  @IsOptional()
  @IsEnum(SourceTier)
  tier?: SourceTier;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
