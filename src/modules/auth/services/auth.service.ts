import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as jwt from 'jsonwebtoken';
import { Config } from 'src/config';
import { PasswordEncoder } from 'src/infra/password-encoder/password-encoder';
import {
  DEFAULT_OTP_DEV,
  Events,
  NotificationType,
  OtpType,
} from 'src/libs/common/constants';
import { generateOTP, handleErrorCatch } from 'src/libs/common/helpers/utils';
import { MoreThan } from 'typeorm';
import { LoginRequestDto } from '../dto/login-request.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { SignUpDto } from '../dto/signup.dto';
import { User } from '../entity/user.entity';
import { OtpRepository } from '../repository/otp.repository';
import { UserRepository } from '../repository/user.repository';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { EmailService } from 'src/shared/services/email.service';
import { ResendOtpDto } from '../dto/resend-otp.dto';

@Injectable()
export class AuthService {
  private logger: Logger;
  private readonly OTP_VALIDITY_MINUTES = 10;
  constructor() {
    this.logger = new Logger();
  }

  @Inject()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly otpRepository: OtpRepository;

  @Inject()
  private readonly eventEmitter: EventEmitter2;

  @Inject()
  private readonly emailService: EmailService;

  public async signUp({ email, password }: SignUpDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email },
      });
      if (userExists) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await PasswordEncoder.hash(password);

      const user = this.userRepository.create({
        password: hashedPassword,
        email,
      });

      await this.userRepository.save(user);

      return {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async verifyOtp(data: { email: string; otp: string }) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isDev = Config.NODE_ENV === 'development';

      if (isDev && data.otp === DEFAULT_OTP_DEV) {
        this.logger.warn(
          `Development mode: Bypassing OTP verification for user ${user.email}`
        );
      } else {
        const validOtp = await this.otpRepository.findOne({
          where: {
            user: { id: user.id },
            code: data.otp,
            type: OtpType.SIGNUP,
            expiresAt: MoreThan(new Date()),
          },
        });

        if (!validOtp) {
          throw new BadRequestException('Invalid OTP');
        }

        this.otpRepository.remove(validOtp);
      }

      await this.userRepository.findOneAndUpdate(
        { email: data.email },
        { emailVerified: true }
      );

      return {
        message: 'User verified successfully',
        token: this.signToken(user),
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  private async generateAndSaveOtp(userId: string, otpType: OtpType) {
    const existingOtps = await this.otpRepository.findAll({
      where: {
        user: { id: userId },
        type: otpType,
      },
    });

    if (existingOtps.length > 0) {
      existingOtps.forEach((otp) => this.otpRepository.remove(otp));
    }

    const otp = generateOTP();
    const otpRecord = this.otpRepository.create({
      user: { id: userId },
      code: otp,
      type: otpType,
      expiresAt: new Date(Date.now() + this.OTP_VALIDITY_MINUTES * 60 * 1000),
    });

    return await this.otpRepository.save(otpRecord);
  }

  async resendOtp({  email, type }: ResendOtpDto) {
    try {
      let user: User | null = null;

      if (email) {
        user = await this.userRepository.findOne({
          where: { email },
        });
      }

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (type === OtpType.SIGNUP && user.emailVerified) {
        throw new BadRequestException('Phone Number already verified');
      }

      await this.generateAndSaveOtp(user.id, type);

      return {
        message: 'OTP sent successfully',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  private signToken(user: User) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      Config.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );
  }

  async login({ email, password }: LoginRequestDto) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where(
          { email },
        )
        .getOne();

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const passwordMatch = await PasswordEncoder.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        throw new BadRequestException('Invalid credentials');
      }

      const token = this.signToken(user);
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const otp = await this.generateAndSaveOtp(
        user.id,
        OtpType.RESET_PASSWORD
      );

      await this.emailService.sendForgotPasswordEmail({
        email: user.email,
        otp: otp.code,
        otpExpiresAt: otp.expiresAt,
      });

      return {
        message: 'Password reset token sent',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async resetPassword({ otp, password, email }: ResetPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isDev = Config.NODE_ENV === 'development';

      if (isDev && otp === DEFAULT_OTP_DEV) {
        this.logger.warn(
          `Development mode: Bypassing OTP verification for user ${user.email}`
        );
      } else {
        const validOtp = await this.otpRepository.findOne({
          where: {
            user: { id: user.id },
            code: otp,
            type: OtpType.RESET_PASSWORD,
            expiresAt: MoreThan(new Date()),
          },
        });

        if (!validOtp) {
          throw new BadRequestException('Invalid or expired OTP');
        }
        this.otpRepository.remove(validOtp);
      }
      const hashedPassword = await PasswordEncoder.hash(password);
      user.password = hashedPassword;
      await this.userRepository.save(user);

      this.eventEmitter.emit(
        Events.NOTIFICATIONS[NotificationType.RESET_PASSWORD],
        {
          user,
        }
      );

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      handleErrorCatch(error);
    }
  }
}
