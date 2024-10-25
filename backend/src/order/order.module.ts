import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ReposModule } from 'src/repository/films.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [ReposModule],
})
export class OrderModule {}
