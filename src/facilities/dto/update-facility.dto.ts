import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { CreateFacilityDto } from './create-facility.dto';

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {}

export class UpdateAvailabilityDto {
  @ApiPropertyOptional({ example: 10, description: 'Number of available beds/rooms' })
  @IsNumber()
  @Min(0)
  availabilityCount: number;
}
