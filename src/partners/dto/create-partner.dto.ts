import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ContactInfoDto {
  @ApiPropertyOptional() @IsOptional() @IsEmail()  email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
}

export class CreatePartnerDto {
  @ApiProperty({ example: 'ABC Home Health' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'home-health' })
  @IsString()
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: ContactInfoDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;
}
