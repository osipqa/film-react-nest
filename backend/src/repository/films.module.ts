import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../enities/film.entity';
import { Schedules } from '../enities/schedule.entity';
import { FilmsRepository } from './films.repository';
import { OrderService } from 'src/order/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Film as FilmMongo, FilmSchema } from './films.schema';
import { Order as OrderMongo, OrderSchema} from '../order/order.schema'

@Module({
  imports: [    
    TypeOrmModule.forFeature([Film, Schedules]),
    MongooseModule.forFeature([{ name: FilmMongo.name, schema: FilmSchema }]),
    MongooseModule.forFeature([{ name: OrderMongo.name, schema: OrderSchema }]),
  ],
  providers: [FilmsRepository, OrderService],
  exports: [FilmsRepository],
})
export class ReposModule {}
