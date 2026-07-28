import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ResetPasswordDto {
  @ApiPropertyOptional({ description: 'New password (min 8 chars). If omitted a random password is generated.' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}
