import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getConfig } from 'src/app.config.provider';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { url } = getConfig(configService);
        return {
          uri: url,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
