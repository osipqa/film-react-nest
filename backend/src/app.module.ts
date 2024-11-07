import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './app.config.provider';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/content/afisha'),
      serveRoot: '/content/afisha',
    }),
    FilmsModule,
    OrderModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => getConfig(configService),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL') || 'mongodb://localhost:27017/prac';
        return { uri: url };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}