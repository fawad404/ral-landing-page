import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ example: 'Our new garden patio is open! Come visit us.' })
  @IsString()
  @IsNotEmpty()
  caption: string;

  @ApiProperty({ example: 'Facility Update' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Facebook' })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiPropertyOptional({ description: 'URL of the uploaded file (set by server after upload)' })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}
