import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../enities/film.entity';
import { Schedules } from '../enities/schedule.entity';
import { FilmsRepository } from './films.repository';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedules])],
  providers: [FilmsRepository, OrderService],
  exports: [FilmsRepository],
})

export class ReposModule {}