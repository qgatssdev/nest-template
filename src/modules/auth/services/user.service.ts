import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { handleErrorCatch } from 'src/libs/common/helpers/utils';
import { User } from '../entity/user.entity';
import { UpdateUserDto } from '../dto/update-user-dto';
import { EmailService } from 'src/shared/services/email.service';
import { PasswordEncoder } from 'src/infra/password-encoder/password-encoder';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  @Inject()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly emailService: EmailService;

  async getAuthenticatedUser(user: User) {
    try {
      const authenticatedUser = await this.userRepository.findOne({
        where: { id: user.id },
        select: ['id', 'email', 'firstName', 'lastName', 'emailVerified'],
      });

      return authenticatedUser;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async changePassword(
    { oldPassword, newPassword }: ChangePasswordDto,
    user: User
  ) {
    try {
      user = await this.userRepository.findOne({
        where: { id: user.id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await PasswordEncoder.compare(
        oldPassword,
        user.password
      );

      if (!passwordMatch) {
        throw new BadRequestException('Invalid old password');
      }

      const hashedPassword = await PasswordEncoder.hash(newPassword);

      await this.userRepository.findOneAndUpdate(
        { id: user.id },
        { password: hashedPassword }
      );

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async updateUser(data: UpdateUserDto, user: User) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { id: user.id },
      });

      if (data.email && !existingUser.email) {
        const existingEmailUser = await this.userRepository.findOne({
          where: { email: data.email },
        });

        if (existingEmailUser) {
          throw new BadRequestException('Email already in use');
        }
      }

      const updatedUser = await this.userRepository.findOneAndUpdate(
        { id: user.id },
        data,
        true
      );

      // if (!existingUser.email && data.email) {
      //   console.log('Sending account creation email...');
      //   this.emailService.sendAccountCreationEmail({
      //     email: data.email,
      //     user: updatedUser,
      //   });
      // }

      return {
        id: updatedUser?.id,
        email: updatedUser?.email,
        firstName: updatedUser?.firstName,
        lastName: updatedUser?.lastName,
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }
}
