import { Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(author: number, article: CreateArticleDto) {
    return await this.prisma.article.create({
      data: {
        author: { connect: { id: author } },
        draft: article.draft,
        topic: { connect: { id: article.topic } },
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        anthology: { connect: { id: article.anthology } },
      },
    });
  }

  async findAll() {
    return await this.prisma.article.findMany();
  }

  async findOne(id: number) {
    await this.prisma.event.create({
      data: {
        article: { connect: { id } },
        type: EventType.VIEW,
      },
    });

    return await this.prisma.article.findUnique({
      where: { id },
    });
  }

  async update(id: number, articleUpdate: UpdateArticleDto) {
    return await this.prisma.article.update({
      where: { id },
      data: {
        draft: articleUpdate.draft,
        topic: { connect: { id: articleUpdate.topic } },
        title: articleUpdate.title,
        subtitle: articleUpdate.subtitle,
        content: articleUpdate.content,
        anthology: { connect: { id: articleUpdate.anthology } },
      },
    });
  }

  async updateLike(id: number, user: number, isLiked: boolean) {
    if (isLiked) {
      await this.prisma.event;
      return await this.prisma.article.update({
        where: { id },
        data: {
          likes: { connect: { id: user } },
        },
      });
    }

    return await this.prisma.article.update({
      where: { id },
      data: {
        likes: { disconnect: { id: user } },
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.article.delete({
      where: { id },
    });
  }
}
