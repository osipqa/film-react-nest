import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getAllFilms() {
    const films = await this.filmsRepository.findAll();
    return {
      total: films.length,
      items: films,
    };
  }

  async getFilmSchedule(id: string) {
    const film = await this.filmsRepository.findOne(id);

    if (!film) {
      throw new Error('Фильм не найден');
    }

    const scheduleData = 'schedule' in film ? film.schedule : film.schedules;

    const formattedSchedule = scheduleData.map((schedule) => {
      return {
        id: schedule.id,
        daytime: schedule.daytime,
        hall: schedule.hall,
        rows: schedule.rows,
        seats: schedule.seats,
        price: schedule.price,
        taken: schedule.taken,
        film: id,
        day: new Date(schedule.daytime).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
        }),
        time: new Date(schedule.daytime).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    });

    return {
      items: formattedSchedule,
    };
  }
}
