import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Film } from '../enities/film.entity';
import { Schedules } from '../enities/schedule.entity';
import { OrderDto } from '../order/dto/order.dto';
import { Film as MongoFilm } from './films.schema';
import { Order } from '../order/order.schema';

export interface IFilmsRepository {
  findAll(): Promise<Film[] | MongoFilm[]>;
  findOne(id: string): Promise<Film | MongoFilm | null>;
  createOrder(orderDto: OrderDto): Promise<void>;
  save(film: Film | MongoFilm): Promise<Film | MongoFilm>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  private isMongoDb: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Film) private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
    @InjectModel(Film.name) private filmModel: Model<MongoFilm>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {
    
    const databaseDriver = this.configService.get<string>('DATABASE_DRIVER');
    this.isMongoDb = databaseDriver === 'mongodb';
  }

  async findAll(): Promise<Film[] | MongoFilm[]> {
    if (this.isMongoDb) {
      return this.filmModel.find().lean();
    } else {
      return this.filmRepository.find({ relations: ['schedules'] });
    }
  }

  async findOne(id: string): Promise<Film | MongoFilm | null> {
    if (this.isMongoDb) {
      return this.filmModel.findOne({ id });
    } else {
      return this.filmRepository.findOne({
        where: { id },
        relations: ['schedules'],
      });
    }
  }

  async createOrder(orderDto: OrderDto): Promise<void> {
    if (this.isMongoDb) {

      const newOrder = new this.orderModel(orderDto);
      await newOrder.save();
    } else {

      const film = await this.filmRepository.findOne({
        where: { id: orderDto.tickets[0]?.film },
        relations: ['schedules'],
      });

      if (!film) {
        throw new Error('Фильм не найден');
      }

      const sessionData = orderDto.tickets.map((ticket) => {
        const session = film.schedules.find((s) => s.id === ticket.session);
        if (!session) {
          throw new Error(
            `Сессия с ID ${ticket.session} не найдена для фильма ${film.title}`,
          );
        }

        const seatIdentifier = `${ticket.row}:${ticket.seat}`;
        if (session.taken.includes(seatIdentifier)) {
          throw new Error(`Место ${seatIdentifier} уже занято`);
        }

        session.taken.push(seatIdentifier);
        return session;
      });

      await this.scheduleRepository.save(sessionData);
    }
  }

  async save(film: Film | MongoFilm): Promise<Film | MongoFilm> {
    if (this.isMongoDb) {
      const newFilm = new this.filmModel(film);
      return newFilm.save();
    } else {
      return this.filmRepository.save(film as Film);
    }
  }
}
