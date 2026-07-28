import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateMatchingWeightsDto } from '../../matching/dto/match-config.dto';

export class UpdateAdminConfigDto {
  @ApiPropertyOptional({
    description: 'Max partners per category. Key = category name, value = limit.',
    example: { 'home-health': 5, 'pharmacy': 3 },
  })
  @IsOptional()
  @IsObject()
  categoryLimits?: Record<string, number>;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  defaultCategoryLimit?: number;

  @ApiPropertyOptional({ type: UpdateMatchingWeightsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateMatchingWeightsDto)
  matchingWeights?: UpdateMatchingWeightsDto;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxMatchResults?: number;
}
