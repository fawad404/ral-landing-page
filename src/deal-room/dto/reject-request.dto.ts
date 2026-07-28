import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectRequestDto {
  @ApiPropertyOptional({ example: 'Facility does not meet current deal room requirements.' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
