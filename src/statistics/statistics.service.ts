import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getArticleStatistics(id: number) {
    return {
      likes: await this.prisma.event.findMany({
        where: { articleId: id, type: 'LIKE' },
      }),
      views: await this.prisma.event.findMany({
        where: { articleId: id, type: 'VIEW' },
      }),
    };
  }
}
