import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class SubmitResponseDto {
  @IsNotEmpty() @IsString() responseType: string;
}

export class SubmitInterestedDto {
  @IsNotEmpty() @IsString() facilityName: string;
  @IsNotEmpty() @IsString() contactName: string;
  @IsNotEmpty() @IsString() phone: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsOptional() @IsInt() @Min(0) availableBedCount?: number;
  @IsOptional() @IsString() notes?: string;
}
