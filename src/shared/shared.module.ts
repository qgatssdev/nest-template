import { Module } from '@nestjs/common';
import { NodeMailer } from 'src/infra/email/node-mailer';
import { InjectionTokens } from 'src/libs/common/constants';
import { UserRepository } from 'src/modules/auth/repository/user.repository';
import { EmailService } from './services/email.service';
import { CurrentUserMiddleware } from 'src/libs/common/middlewares/current-user.middleware';

const infrastructure = [
  {
    provide: InjectionTokens.EMAIL_CLIENT,
    useClass: NodeMailer,
  },
];

@Module({
  controllers: [],
  providers: [
    ...infrastructure,
    EmailService,
    UserRepository,
    CurrentUserMiddleware,
  ],
  exports: [
    ...infrastructure,
    EmailService,
    UserRepository,
  ],
})
export class SharedModule {}
