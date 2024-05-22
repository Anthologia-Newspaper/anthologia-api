import { ConflictException, Injectable } from '@nestjs/common';
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

  async findAll(
    authorId?: number,
    topicId?: number,
    draft?: boolean,
    q?: string,
  ) {
    return await this.prisma.article.findMany({
      where: {
        authorId,
        topicId,
        draft,
        OR: [
          { title: { contains: q } },
          { subtitle: { contains: q } },
          { content: { contains: q } },
          { author: { username: { contains: q } } },
        ],
      },
    });
  }

  async findAllInAnthology(anthologyId: number) {
    return await this.prisma.article.findMany({
      where: { anthology: { every: { id: anthologyId } }, draft: false },
    });
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

  async findDrafts(authorId: number) {
    return await this.prisma.article.findMany({
      where: { AND: { authorId, draft: { equals: true } } },
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
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { likes: { where: { id: user } } },
    });

    if (isLiked && !article) {
      await this.prisma.event;
      return await this.prisma.article.update({
        where: { id },
        data: {
          likes: { connect: { id: user } },
        },
      });
    }

    if (!isLiked && article) {
      return await this.prisma.article.update({
        where: { id },
        data: {
          likes: { disconnect: { id: user } },
        },
      });
    }

    throw new ConflictException();
  }

  async remove(id: number) {
    return await this.prisma.article.delete({
      where: { id },
    });
  }
}
