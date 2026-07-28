import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SocialBoostStatus } from '../schemas/social-boost.schema';

export class UpdateStatusDto {
  @ApiProperty({ enum: SocialBoostStatus })
  @IsEnum(SocialBoostStatus)
  status: SocialBoostStatus;

  @ApiPropertyOptional({ example: 'Great content! Will post tomorrow.' })
  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
