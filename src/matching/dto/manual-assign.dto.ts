import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class ManualAssignDto {
  @ApiProperty({ description: 'Facility MongoDB ObjectId' })
  @IsMongoId()
  facilityId: string;

  @ApiPropertyOptional({ description: 'Reason for manual assignment' })
  @IsOptional()
  @IsString()
  reason?: string;
}
