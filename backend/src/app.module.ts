import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { FilmsModule } from './films/films.module';
import { DatabaseModule } from './repository/db.module';
import { OrderModule } from './order/order.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
