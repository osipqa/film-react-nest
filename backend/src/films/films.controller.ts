import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('/films/')
export class FilmsController {
  constructor(private filmsService: FilmsService) {}

  @Get()
  async getFilms() {
    return await this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    return await this.filmsService.getFilmSchedule(id);
  }
}
