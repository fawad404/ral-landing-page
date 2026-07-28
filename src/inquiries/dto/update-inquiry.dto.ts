import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateInquiryDto } from './create-inquiry.dto';
import { InquiryStatus } from '../schemas/inquiry.schema';

export class UpdateInquiryDto extends PartialType(CreateInquiryDto) {
  @ApiPropertyOptional({ enum: InquiryStatus })
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
