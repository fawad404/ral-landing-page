import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateMatchingWeightsDto {
  @ApiPropertyOptional({ example: 0.4, description: 'Weight for distance/location match (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  distance?: number;

  @ApiPropertyOptional({ example: 0.4, description: 'Weight for services match (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  services?: number;

  @ApiPropertyOptional({ example: 0.2, description: 'Weight for budget match (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  budget?: number;
}
