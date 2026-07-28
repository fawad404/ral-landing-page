import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from '../schemas/compliance-incident.schema';

export class CreateIncidentDto {
  @ApiProperty()
  @IsString()
  facilityId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: IncidentType })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty({ enum: IncidentSeverity })
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiProperty()
  @IsDateString()
  incidentDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  reportedDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  residentsInvolved?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  staffInvolved?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  witnessNames?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  immediateActions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  followUpNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reportedToAdhs?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  adhsReportDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adhsReportNumber?: string;

  @ApiPropertyOptional({ enum: IncidentStatus })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;
}
