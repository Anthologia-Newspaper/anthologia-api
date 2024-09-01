import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../authentication/authentication.guard';
import { handleErrors } from '../utils/handle-errors';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    try {
      return this.eventsService.create(createEventDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get()
  async findAll() {
    try {
      return this.eventsService.findAll();
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      return this.eventsService.update(id, updateEventDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return this.eventsService.remove(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
