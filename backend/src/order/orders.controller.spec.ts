import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('Должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('Должен вызывать OrderService.createOrder с корректными данными', async () => {
      const orderDto: OrderDto = {
        email: 'test@example.com',
        phone: '1234567890',
        tickets: [
          {
            film: 'film1',
            session: 'session1',
            daytime: '10:00',
            row: 1,
            seat: 2,
            price: 500,
          },
        ],
      };

      const expectedResponse = {
        items: [...orderDto.tickets],
      };

      jest.spyOn(service, 'createOrder').mockResolvedValue(expectedResponse);

      const result = await controller.createOrder(orderDto);
      expect(service.createOrder).toHaveBeenCalledWith(orderDto);
      expect(result).toEqual(expectedResponse);
    });

    it('Должен выбрасывать BadRequestException если тикет некорретный', async () => {
      const invalidOrderDto: OrderDto = {
        email: 'test@example.com',
        phone: '1234567890',
        tickets: 'invalid' as unknown as any[],
      };

      jest.spyOn(service, 'createOrder').mockImplementation(() => {
        throw new BadRequestException('tickets должен быть массивом');
      });

      await expect(controller.createOrder(invalidOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.createOrder).toHaveBeenCalledWith(invalidOrderDto);
    });

    it('Должен выбрасываться NotFoundException если фильм не существует', async () => {
      const orderDto: OrderDto = {
        email: 'test@example.com',
        phone: '1234567890',
        tickets: [
          {
            film: 'nonexistentFilm',
            session: 'session1',
            daytime: '10:00',
            row: 1,
            seat: 2,
            price: 500,
          },
        ],
      };

      jest.spyOn(service, 'createOrder').mockImplementation(() => {
        throw new NotFoundException(`Фильм с ID nonexistentFilm не найден`);
      });

      await expect(controller.createOrder(orderDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.createOrder).toHaveBeenCalledWith(orderDto);
    });
  });
});
