import { Logger } from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { config } from 'dotenv';

config();

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsInt()
  readonly PORT = Number(process.env.PORT) || 3000;

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST;

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string;

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string;

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string;

  @IsOptional()
  @IsString()
  readonly DATABASE_SSL_CA_CERT = process.env.DATABASE_SSL_CA_CERT as string;

  @IsBoolean()
  readonly DATABASE_SSL_ENABLED = process.env.DATABASE_SSL_ENABLED === 'true';

  @IsBoolean()
  readonly DATABASE_SSL_REJECT_UNAUTHORIZED =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true';

  @IsBoolean()
  readonly DATABASE_SYNC = (process.env.DATABASE_SYNC ?? 'true') === 'true';

  @IsString()
  readonly EMAIL_HOST = process.env.EMAIL_HOST as string;

  @IsInt()
  readonly EMAIL_PORT = Number(process.env.EMAIL_PORT);

  @IsString()
  readonly EMAIL_USER = process.env.EMAIL_USER as string;

  @IsString()
  readonly EMAIL_NAME = process.env.EMAIL_NAME as string;

  @IsString()
  readonly EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

  @IsString()
  readonly FRONTEND_URL = process.env.FRONTEND_URL as string;

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET as string;

  @IsString()
  readonly NODE_ENV = process.env.NODE_ENV || 'development';

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error[0])}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
