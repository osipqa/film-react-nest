import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDto } from 'src/order/dto/order.dto';
import { Film } from '../enities/film.entity';
import { Schedules } from '../enities/schedule.entity';

export interface IFilmsRepository {
  findAll(): Promise<Film[]>;
  findOne(id: string): Promise<Film | null>;
  createOrder(orderDto: OrderDto): Promise<void>;
  save(film: Film): Promise<Film>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film) private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedules) private readonly scheduleRepository: Repository<Schedules>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find({ relations: ['schedules'] });
  }

  async findOne(id: string): Promise<Film | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
  }

  async createOrder(orderDto: OrderDto): Promise<void> {
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
        throw new Error(`Сессия с ID ${ticket.session} не найдена для фильма ${film.title}`);
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

  async save(film: Film): Promise<Film> {
    return this.filmRepository.save(film);
  }
}
