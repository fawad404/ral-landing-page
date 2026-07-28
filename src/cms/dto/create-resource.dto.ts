import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ResourceType } from '../schemas/resource.schema';

export class CreateResourceDto {
  @ApiProperty({ example: 'Guide to Memory Care Facilities' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Full article content here...' })
  @IsString()
  content: string;

  @ApiProperty({ enum: ResourceType })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({ example: 'guide-to-memory-care', description: 'URL-friendly slug (auto-generated if omitted)' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ type: [String], example: ['memory-care', 'seniors'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  featuredImage?: string;
}
