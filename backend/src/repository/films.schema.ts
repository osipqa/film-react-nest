import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schedule } from 'src/films/film.schema';
import { ScheduleSchema } from 'src/order/order.schema';

export type FilmDocument = Film & Document;

@Schema({ _id: false })
export class Film {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [ScheduleSchema], required: true })
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
