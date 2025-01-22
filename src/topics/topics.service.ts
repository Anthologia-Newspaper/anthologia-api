import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { IPFSService } from 'src/ipfs/ipfs.service';
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class TopicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ipfsService: IPFSService,
    private readonly articleService: ArticlesService
  ) {}

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
    const articles = await this.prisma.article.findMany({ where: { topicId: id } });

    for (const article of articles) {
      await this.articleService.remove(article.id);
    }

    return await this.prisma.topic.delete({ where: { id } });
  }
}
