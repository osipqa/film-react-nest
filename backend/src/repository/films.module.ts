import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsRepository } from './films.repository';
import { Film, FilmSchema } from './films.schema';
import { Order, ScheduleSchema } from 'src/order/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: ScheduleSchema }]),
  ],
  providers: [FilmsRepository],
  exports: [FilmsRepository],
})
export class ReposModule {}
