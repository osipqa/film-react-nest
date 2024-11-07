import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import { ConfigService } from '@nestjs/config';
import { Film as FilmMongo } from '../films/film.schema'

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly configService: ConfigService,
  ) {}

  async createOrder(orderDto: OrderDto) {
    this.logger.log('Полученные данные для заказа: ' + JSON.stringify(orderDto));

    const { tickets } = orderDto;

    if (!Array.isArray(tickets)) {
      this.logger.error('tickets не является массивом или отсутствует');
      throw new BadRequestException('tickets должен быть массивом');
    }

    const isMongoDb = this.configService.get('DATABASE_DRIVER') === 'mongodb';

    for (const ticket of tickets) {
      const { film, session, row, seat } = ticket;

      this.logger.log(
        `Обработка заказа для фильма: ${film}, сессия: ${session}, место: ${row}:${seat}`,
      );

      const document = await this.filmsRepository.findOne(film);

      if (!document) {
        this.logger.error(`Фильм с ID ${film} не найден`);
        throw new NotFoundException(`Фильм с ID ${film} не найден`);
      }

      if (isMongoDb) {
        const mongoDocument = document as FilmMongo & Document;

        if ('schedule' in mongoDocument) {
          const selectedSession = mongoDocument.schedule.find((i) => i.id === session);

          if (!selectedSession) {
            this.logger.error(`Сессия с ID ${session} не найдена для фильма ${film}`);
            throw new NotFoundException(`Сессия с ID ${session} не найдена для фильма ${film}`);
          }

          const seatIdentifier = `${row}:${seat}`;
          if (selectedSession.taken.includes(seatIdentifier)) {
            this.logger.warn(`Место ${seatIdentifier} уже занято`);
            throw new BadRequestException(`Место ${seatIdentifier} уже занято`);
          }

          selectedSession.taken.push(seatIdentifier);
          mongoDocument.schedule[mongoDocument.schedule.findIndex((session) => session.id === selectedSession.id)] = selectedSession;
          await mongoDocument.save();
        } else {
          this.logger.error('schedule не найден в MongoDB документе');
          throw new BadRequestException('Невозможно обработать заказ: отсутствие поля schedule');
        }
      } else {
        if ('schedules' in document) {
          const selectedSession = document.schedules.find((i) => i.id === session);

          if (!selectedSession) {
            this.logger.error(`Сессия с ID ${session} не найдена для фильма ${film}`);
            throw new NotFoundException(`Сессия с ID ${session} не найдена для фильма ${film}`);
          }

          const seatIdentifier = `${row}:${seat}`;
          if (selectedSession.taken.includes(seatIdentifier)) {
            this.logger.warn(`Место ${seatIdentifier} уже занято`);
            throw new BadRequestException(`Место ${seatIdentifier} уже занято`);
          }

          selectedSession.taken.push(seatIdentifier);
          await this.filmsRepository.save(document);
        } else {
          this.logger.error('schedules не найдено в PostgreSQL документе');
          throw new BadRequestException('Невозможно обработать заказ: отсутствие поля schedules');
        }
      }

      this.logger.log(`Место ${row}:${seat} успешно забронировано`);
    }

    this.logger.log('Заказ успешно создан');
    return {
      items: tickets.map((ticket) => ({ ...ticket })),
    };
  }
}
