import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    EventEmitterModule.forRoot(),
  ],
})
export class CoreModule {}
