import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Film } from './enities/film.entity';
import { Schedules } from './enities/schedule.entity';

export const getConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseDriver = configService.get<string>('DATABASE_DRIVER');

  if (!databaseDriver) {
    throw new Error('DB_DRIVER не найден');
  }

  if (databaseDriver === 'postgres') {
    return {
      type: 'postgres',
      host: configService.get<string>('DATABASE_HOST', 'localhost'),
      port: configService.get<number>('DATABASE_PORT', 5433),
      username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: configService.get<string>('DATABASE_PASSWORD', 'password'),
      database: configService.get<string>('DATABASE_NAME', 'prac'),
      entities: [Film, Schedules],
      synchronize: true,
      logging: true,
    };
  }

  if (databaseDriver === 'mongodb') {
    const url =
      configService.get<string>('DATABASE_URL') || 'mongodb://localhost:27017/prac';
    return {
      type: 'mongodb',
      url,
    };
  }

  throw new Error(`ДБ ${databaseDriver} не поддерживает`);
};
