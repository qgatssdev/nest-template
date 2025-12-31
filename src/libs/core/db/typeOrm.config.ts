import * as typeorm from 'typeorm';
import * as path from 'path';
import { Config } from 'src/config';

export default new typeorm.DataSource({
  type: 'postgres',
  host: Config.DATABASE_HOST,
  port: Config.DATABASE_PORT,
  username: Config.DATABASE_USER,
  password: Config.DATABASE_PASSWORD,
  database: Config.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  logging: false,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
