import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiPropertyOptional() @IsOptional() @IsString() street?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() state?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() zipCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
}

export class PricingDto {
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) min?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) max?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
}

export class PoliciesDto {
  @ApiPropertyOptional() @IsOptional() @IsString() admission?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() discharge?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visitor?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() medication?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() privacy?: string;
}

export class SocialMediaDto {
  @ApiPropertyOptional() @IsOptional() @IsString() facebook?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instagram?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedin?: string;
}

export class CreateFacilityDto {
  @ApiProperty({ example: 'Sunrise Memory Care' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availabilityCount?: number;

  @ApiPropertyOptional({ type: [String], example: ['Memory Care', 'Assisted Living'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fax?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: PricingDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ type: SocialMediaDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licenseType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  genderPreference?: string;

  @ApiPropertyOptional({ type: PoliciesDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PoliciesDto)
  policies?: PoliciesDto;
}
