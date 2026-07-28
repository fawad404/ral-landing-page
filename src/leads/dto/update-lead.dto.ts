import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus } from '../schemas/lead.schema';

export class UpdateLeadDto {
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
