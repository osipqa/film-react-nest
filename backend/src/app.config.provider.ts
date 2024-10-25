import { ConfigService } from '@nestjs/config';

export const getConfig = (configService: ConfigService) => {
  const driver = configService.get<string>('DATABASE_DRIVER') || 'mongodb';
  const url =
    configService.get<string>('DATABASE_URL') ||
    'mongodb://localhost:27017/prac';
  return { driver, url };
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
