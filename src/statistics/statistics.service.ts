/*
| Developed by Alexandre Schaffner
| Filename : statistics.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@epitech.eu)
*/

import { Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { IDailyStats } from './contracts/IDailyStats';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  getDailyStats(dates: string[], events: Event[]): IDailyStats[] {
    const dailyStats: IDailyStats[] = [];

    let totalCount = 0;
    let count = 0;
    for (const date of dates) {
      count = 0;
      for (const event of events) {
        if (event.createdAt.toDateString() === date) {
          count++;
        }
      }
      totalCount += count;
      dailyStats.push({ date, count, toDate: totalCount });
    }

    return dailyStats;
  }

  async getArticleStatistics(id: number) {
    const { createdAt, likeCounter, viewCounter } =
      await this.prisma.article.findUniqueOrThrow({
        where: { id },
        select: { createdAt: true, likeCounter: true, viewCounter: true },
      });

    const likes: Event[] = await this.prisma.event.findMany({
      where: { articleId: id, type: 'LIKE' },
      orderBy: { createdAt: 'asc' },
    });
    const views: Event[] = await this.prisma.event.findMany({
      where: { articleId: id, type: 'VIEW' },
      orderBy: { createdAt: 'asc' },
    });

    // Create an array of dates from the article's creation date to today
    //--------------------------------------------------------------------------
    const dates = [];
    for (
      const date = new Date(createdAt);
      date.toDateString() !== new Date().toDateString();
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(date.toDateString());
    }

    dates.push(new Date().toDateString());

    // Count the number of likes and views for each day
    //--------------------------------------------------------------------------
    const dailyLikes = this.getDailyStats(dates, likes);
    const dailyViews = this.getDailyStats(dates, views);

    return {
      likeCounter,
      viewCounter,
      dailyLikes,
      dailyViews,
    };
  }

  async getUserStatistics(id: number) {
    const { createdAt } = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { createdAt: true },
    });

    const articleIds = (
      await this.prisma.article.findMany({
        where: { authorId: id },
        select: { id: true },
      })
    ).map((article) => article.id);

    const likeCounter = await this.prisma.event.count({
      where: { articleId: { in: articleIds }, type: 'LIKE' },
    });
    const viewCounter = await this.prisma.event.count({
      where: { articleId: { in: articleIds }, type: 'VIEW' },
    });

    const viewEvents: Event[] = await this.prisma.event.findMany({
      where: {
        articleId: { in: articleIds },
        type: 'VIEW',
      },
      orderBy: { createdAt: 'asc' },
    });

    const likeEvents: Event[] = await this.prisma.event.findMany({
      where: {
        articleId: { in: articleIds },
        type: 'LIKE',
      },
      orderBy: { createdAt: 'asc' },
    });

    // Create an array of dates from the user's creation date to today
    //--------------------------------------------------------------------------
    const dates = [];
    for (
      const date = new Date(createdAt);
      date.toDateString() !== new Date().toDateString();
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(date.toDateString());
    }

    dates.push(new Date().toDateString());

    // Count the number of events for each day
    //--------------------------------------------------------------------------
    const dailyViews = this.getDailyStats(dates, viewEvents);
    const dailyLikes = this.getDailyStats(dates, likeEvents);

    return {
      viewCounter,
      likeCounter,
      dailyViews,
      dailyLikes,
    };
  }
}
