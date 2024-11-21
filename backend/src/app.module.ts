import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { FilmsModule } from './films/films.module';
import { DatabaseModule } from './repository/db.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './app.config.provider';

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
    DatabaseModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => getConfig(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
