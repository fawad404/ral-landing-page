import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CredentialType } from '../schemas/staff-credential.schema';

export class CreateCredentialDto {
  @ApiProperty()
  @IsString()
  facilityId: string;

  @ApiProperty()
  @IsString()
  staffName: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty({ enum: CredentialType })
  @IsEnum(CredentialType)
  credentialType: CredentialType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  credentialName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiProperty()
  @IsDateString()
  expirationDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
