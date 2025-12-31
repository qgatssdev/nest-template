import { IsNotEmpty, IsString } from 'class-validator';
import { IsDifferentFrom } from 'src/libs/common/validators/is-different-from.validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsDifferentFrom('oldPassword', {
    message: 'New password must be different from old password',
  })
  newPassword: string;
}
