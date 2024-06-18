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
        anthology: article.anthology
          ? { connect: { id: article.anthology } }
          : undefined,
      },
    });
  }

  async findAll(
    authorId?: number,
    topicId?: number,
    anthologyId?: number,
    draft?: boolean,
    isLiked?: boolean,
    q?: string,
  ) {
    return await this.prisma.article.findMany({
      where: {
        authorId,
        topicId,
        anthology: anthologyId ? { some: { id: anthologyId } } : undefined,
        draft,
        likes: isLiked === true ? { some: { id: authorId } } : undefined,
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
        anthology: articleUpdate.anthology
          ? { connect: { id: articleUpdate.anthology } }
          : undefined,
      },
    });
  }

  // TODO: create a LIKE/UNLIKE Event in the database and link/unlink the article with the user
  async updateLike(id: number, userId: number, isLiked: boolean) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { id },
      include: { likes: { where: { id: userId } } },
    });

    if (isLiked && article.likes.length)
      throw new ConflictException('Already liked');
    else if (!isLiked && !article.likes.length)
      throw new ConflictException('Not liked yet');

    // TODO: Check if this really works properly
    if (isLiked) {
      await this.prisma.article.update({
        where: { id },
        data: {
          likes: { connect: { id: userId } },
        },
      });

      return await this.prisma.event.create({
        data: {
          article: { connect: { id } },
          type: EventType.LIKE,
        },
      });
    }

    // TODO: Check if this really works properly
    await this.prisma.article.update({
      where: { id },
      data: {
        likes: { disconnect: { id: userId } },
      },
    });

    // If the user has already liked the article, we create an UNLIKE event
    return await this.prisma.event.create({
      data: {
        article: { connect: { id } },
        type: EventType.UNLIKE,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.article.delete({
      where: { id },
    });
  }
}
