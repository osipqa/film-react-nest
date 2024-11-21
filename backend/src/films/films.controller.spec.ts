import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { NotFoundException } from '@nestjs/common';

const mockFilmsService = {
  getAllFilms: jest.fn(),
  getFilmSchedule: jest.fn(),
};

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('Должен определен быть', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('Должен возвращать список фильмов', async () => {
      const result = {
        total: 2,
        items: [
          { id: '1', title: 'Film 1' },
          { id: '2', title: 'Film 2' },
        ],
      };
      mockFilmsService.getAllFilms.mockResolvedValue(result);

      expect(await controller.getFilms()).toBe(result);
      expect(mockFilmsService.getAllFilms).toHaveBeenCalled();
    });
  });

  describe('getFilmSchedule', () => {
    it('Должен возвращать расписание', async () => {
      const filmId = '1';
      const schedule = [
        {
          id: 'session1',
          daytime: '2024-11-22T15:00:00',
          hall: 1,
          rows: 10,
          seats: 100,
          price: 500,
          taken: ['1:1'],
        },
      ];
      const result = { items: schedule };
      mockFilmsService.getFilmSchedule.mockResolvedValue(result);

      expect(await controller.getFilmSchedule(filmId)).toBe(result);
      expect(mockFilmsService.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });

    it('Должен выбрасывать NotFoundException если фиьм не найден', async () => {
      const filmId = 'nonexistent-film';
      mockFilmsService.getFilmSchedule.mockRejectedValue(
        new NotFoundException('Фильм не найден'),
      );

      await expect(controller.getFilmSchedule(filmId)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockFilmsService.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
