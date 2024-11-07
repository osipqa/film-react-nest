import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedules } from './schedule.entity';

@Entity({ name: 'films' })
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('double precision')
  rating: number;

  @Column()
  director: string;

  @Column('text')
  tags: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedules, (schedule) => schedule.film, { cascade: true })
  schedules: Schedules[];
}