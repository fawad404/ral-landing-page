import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DemoInquiryStatus } from '../schemas/demo-inquiry.schema';

export class UpdateDemoInquiryDto {
  @IsOptional()
  @IsEnum(DemoInquiryStatus)
  status?: DemoInquiryStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
