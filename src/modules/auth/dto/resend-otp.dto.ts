import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { OptionalPhoneValidationDto } from './phone-validation.dto';
import { OtpType } from 'src/libs/common/constants';

export class ResendOtpDto extends OptionalPhoneValidationDto {
  @IsEnum(OtpType)
  type: OtpType;

  @IsEmail()
  @IsOptional()
  email?: string;
}
