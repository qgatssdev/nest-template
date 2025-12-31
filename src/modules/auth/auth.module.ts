import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { OtpRepository } from './repository/otp.repository';

@Module({
  imports: [SharedModule],
  controllers: [AuthController, UserController],
  providers: [
    UserRepository,
    AuthService,
    UserService,
    OtpRepository,
  ],
})
export class AuthModule {}
