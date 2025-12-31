import { IsEmail } from 'class-validator';

export class EmailValidationDto {
  @IsEmail()
  email: string;
}
