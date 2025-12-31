import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/libs/common/validators/trim.validator';

export class UpdateUserDto {
  @IsString()
  @Trim()
  @IsOptional()
  firstName?: string;

  @IsString()
  @Trim()
  @IsOptional()
  lastName?: string;

  @IsString()
  @Trim()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @Trim()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsBoolean()
  @IsOptional()
  isOnboardingCompleted?: boolean;
}
