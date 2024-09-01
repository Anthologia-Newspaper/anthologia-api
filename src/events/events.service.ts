import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(newEvent: CreateEventDto) {
    return await this.prisma.event.create({ data: newEvent });
  }

  async findAll() {
    return await this.prisma.event.findMany();
  }

  async update(id: number, eventUpdate: UpdateEventDto) {
    return await this.prisma.event.update({
      where: { id },
      data: eventUpdate,
    });
  }

  async remove(id: number) {
    return await this.prisma.event.delete({ where: { id } });
  }
}
