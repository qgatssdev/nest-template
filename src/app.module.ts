import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './libs/core/core.module';
import { DomainModule } from './modules/domain.module';
import { SharedModule } from './shared/shared.module';
import { CurrentUserMiddleware } from './libs/common/middlewares/current-user.middleware';

@Module({
  imports: [CoreModule, DomainModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('v1');
  }
}
