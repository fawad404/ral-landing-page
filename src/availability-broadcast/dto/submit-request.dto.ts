import { IsUsPhone } from '../../common/validators/us-phone';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubmitRequestDto {
  @IsNotEmpty() @IsString() contactName: string;
  @IsNotEmpty() @IsString() organization: string;
  @IsNotEmpty() @IsUsPhone() phone: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() @IsString() preferredArea: string;
  @IsArray() @IsString({ each: true }) careTypes: string[];
  @IsNotEmpty() @IsString() paymentType: string;
  @IsNotEmpty() @IsString() moveTimeline: string;
  @IsOptional() @IsString() notes?: string;
}
