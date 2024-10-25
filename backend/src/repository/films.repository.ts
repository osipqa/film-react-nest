import { Injectable } from '@nestjs/common';
import { Film } from './films.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/order/order.schema';
import { OrderDto } from 'src/order/dto/order.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private filmModel: Model<Film>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().lean();
  }

  async findOne(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id });
  }

  async findOneOrder(id: string) {
    return await this.filmModel.findOne({ id: id });
  }

  async createOrder(orderDto: OrderDto): Promise<Order> {
    const newOrder = new this.orderModel(orderDto);
    return newOrder.save();
  }
}
