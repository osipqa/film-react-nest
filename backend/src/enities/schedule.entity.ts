import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Film } from './film.entity';
  
  @Entity({ name: 'schedules' })
  export class Schedules {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    daytime: string;
  
    @Column()
    hall: number;
  
    @Column()
    rows: number;
  
    @Column()
    seats: number;
  
    @Column('double precision', { nullable: true })
    price: number;
  
    @Column('text', { array: true, default: [] })
    taken: string[];
  
    @ManyToOne(() => Film, (film) => film.schedules)
    @JoinColumn({ name: 'filmId' })
    film: Film;
  }