import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(newTopic: CreateTopicDto) {
    return await this.prisma.topic.create({ data: newTopic });
  }

  async findAll() {
    return await this.prisma.topic.findMany();
  }

  async update(id: number, topicUpdate: UpdateTopicDto) {
    return await this.prisma.topic.update({
      where: { id },
      data: topicUpdate,
    });
  }

  async remove(id: number) {
    return await this.prisma.topic.delete({ where: { id } });
  }
}
