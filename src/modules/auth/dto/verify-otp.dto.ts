import { IsString } from 'class-validator';
import { PhoneValidationDto } from './phone-validation.dto';

export class VerifyOtpDto extends PhoneValidationDto {
  @IsString()
  otp: string;
}
