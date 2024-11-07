import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(orderDto: OrderDto) {
    this.logger.log(
      'Полученные данные для заказа: ' + JSON.stringify(orderDto),
    );

    const { tickets } = orderDto;

    if (!Array.isArray(tickets)) {
      this.logger.error('tikets не является массивом или отсутствует');
      throw new BadRequestException('tikets должен быть массивом');
    }

    for (const ticket of tickets) {
      const { film, session, row, seat } = ticket;

      this.logger.log(
        `Обработка заказа для фильма: ${film}, сессия: ${session}, место: ${row}:${seat}`,
      );

      const document = await this.filmsRepository.findOneOrder(film);
      if (!document) {
        this.logger.error(`Фильм с ID ${film} не найден`);
        throw new NotFoundException(`Фильм с ID ${film} не найден`);
      }

      const selectedSession = document.schedule.find((i) => i.id === session);
      if (!selectedSession) {
        this.logger.error(
          `Сессия с ID ${session} не найдена для фильма ${film}`,
        );
        throw new NotFoundException(
          `Сессия с ID ${session} не найдена для фильма ${film}`,
        );
      }

      const seatIdentifier = `${row}:${seat}`;
      if (selectedSession.taken.includes(seatIdentifier)) {
        this.logger.warn(`Место ${seatIdentifier} уже занято`);
        throw new BadRequestException(`Место ${seatIdentifier} уже занято`);
      }

      selectedSession.taken.push(seatIdentifier);
      await document.save();
      this.logger.log(`Место ${seatIdentifier} успешно забронировано`);
    }

    this.logger.log('Заказ успешно создан');
    return {
      items: tickets.map((ticket) => ({ ...ticket })),
    };
  }
}
