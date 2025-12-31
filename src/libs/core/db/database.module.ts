import { Global, Module } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces';
import * as path from 'path';
import * as typeorm from 'typeorm';
import { Config } from 'src/config';

function onModuleDestroy<T extends object>(
  thing: T,
  callback: (thing: T) => Promise<void>,
): T {
  return new Proxy<T>(thing, {
    get(target: T, property: PropertyKey) {
      if (property === 'onModuleDestroy') {
        return () => callback(thing);
      }
      return target[property as keyof T];
    },
  });
}

const databaseProvider = {
  provide: typeorm.Connection,
  useFactory: async () => {
    const conn = await new typeorm.DataSource({
      type: 'postgres',
      host: Config.DATABASE_HOST,
      port: Config.DATABASE_PORT,
      username: Config.DATABASE_USER,
      password: Config.DATABASE_PASSWORD,
      database: Config.DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
      logging: false,
      synchronize: Config.DATABASE_SYNC,
      ssl: {
        rejectUnauthorized: Config.DATABASE_SSL_REJECT_UNAUTHORIZED,
        ca: Config.DATABASE_SSL_CA_CERT,
      },
    });
    return onModuleDestroy(conn, (c) => c.destroy());
  },
};

const entityManagerProvider: FactoryProvider = {
  provide: typeorm.EntityManager,
  useFactory: async (cxn: typeorm.Connection) => {
    if (!cxn.isInitialized) {
      await cxn.initialize();
    }
    const manager = cxn.createEntityManager();
    return onModuleDestroy(manager, (m) => m.release());
  },
  inject: [typeorm.Connection],
};

@Global()
@Module({
  providers: [databaseProvider, entityManagerProvider],
  exports: [databaseProvider, entityManagerProvider],
})
export class DatabaseModule {}
