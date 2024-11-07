import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { ReposModule } from 'src/repository/films.module';

@Module({
  imports: [ReposModule],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
