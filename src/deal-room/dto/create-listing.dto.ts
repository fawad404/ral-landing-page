import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ListingCondition, ListingType } from '../schemas/deal-room-listing.schema';

export class CreateListingDto {
  @ApiProperty({ example: 'Hospital Bed – Electric Adjustable' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Lightly used, fully functional, 2 years old.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ListingType })
  @IsEnum(ListingType)
  type: ListingType;

  @ApiPropertyOptional({ enum: ListingCondition })
  @IsOptional()
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  priceNegotiable?: boolean;

  @ApiPropertyOptional({ example: 'owner@facility.com' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '602-555-0100' })
  @IsOptional()
  @IsString()
  contactPhone?: string;
}
