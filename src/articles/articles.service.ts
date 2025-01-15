import { ConflictException, Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { IPFSService } from 'src/ipfs/ipfs.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesQueryParamsDto } from './dto/get-articles-query-params.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ipfs: IPFSService,
  ) {}

  async create(author: number, article: CreateArticleDto) {
    const createdArticle = await this.prisma.article.create({
      data: {
        author: { connect: { id: author } },
        draft: article.draft,
        topic: { connect: { id: article.topic } },
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        rawContent: article.rawContent,
        anthology: article.anthology
          ? { connect: { id: article.anthology } }
          : undefined,
      },
    });

    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging') {
      const cid = await this.ipfs.pin(
        article.content,
        createdArticle.title,
        createdArticle.subtitle ?? '',
        createdArticle.id,
        createdArticle.rawContent,
      );

      const articleWithCID = await this.prisma.article.update({
        where: { id: createdArticle.id },
        data: {
          cid,
        },
      });

      return articleWithCID;
    }

    return createdArticle;
  }

  async updateBanner(articleId: number, bannerCid: string) {
    await this.prisma.article.update({
      where: { id: articleId },
      data: { bannerCid },
    });
  }

  // ─── Find Many Articles ──────────────────────────────────────────────

  async findAll(query: GetArticlesQueryParamsDto) {
    const items = query.items ? query.items : 20;
    const page = query.page ? query.page * items : 0;

    return await this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: items,
      skip: page,
      where: {
        authorId: query.authorId,
        topicId: query.topicId,
        anthology: query.anthologyId
          ? { some: { id: query.anthologyId } }
          : undefined,
        draft: query.draft,
        likes:
          query.isLiked === true ? { some: { id: query.authorId } } : undefined,
        OR: [
          { title: { contains: query.q } },
          { subtitle: { contains: query.q } },
          { content: { contains: query.q } },
          { author: { username: { contains: query.q } } },
        ],
      },
      include: {
        author: true,
        topic: true,
      },
    });
  }

  // ─── Find One Article ────────────────────────────────────────────────

  async findOne(id: number, authorId?: number) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { id, authorId, draft: authorId ? true : false },
      include: {
        anthology: true,
        author: true,
        topic: true,
        comments: true,
      },
    });

    if (article.draft) return article;

    await this.prisma.event.create({
      data: {
        article: { connect: { id } },
        type: EventType.VIEW,
      },
    });

    await this.prisma.article.update({
      where: { id },
      data: {
        viewCounter: { increment: 1 },
      },
    });

    return article;
  }

  // ─── Update An Article ───────────────────────────────────────────────

  async update(id: number, articleUpdate: UpdateArticleDto) {
    const article = await this.prisma.article.findFirstOrThrow({
      where: { id },
    });
  
    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging') {

      if (article.draft === false) {
        throw new ConflictException('Published articles cannot be modified.');
      }

      let newCid: string = '';

      // * If the article is being published
      if (articleUpdate.draft === false && article.draft === true) {
        newCid = await this.ipfs.pin(
          articleUpdate.content ?? article.content,
          articleUpdate.title ?? article.title,
          articleUpdate.subtitle ?? article.subtitle ?? '',
          article.id,
          articleUpdate.rawContent ?? article.rawContent,
        );
      }

      return await this.prisma.article.update({
        where: { id },
        data: {
          draft: articleUpdate.draft,
          topic: { connect: { id: articleUpdate.topic ?? article.topicId} },
          title: articleUpdate.title,
          subtitle: articleUpdate.subtitle,
          content: articleUpdate.content,
          rawContent: articleUpdate.rawContent,
          cid: newCid ?? article.cid,
          anthology: articleUpdate.anthology
            ? { connect: { id: articleUpdate.anthology } }
            : undefined,
        },
      });
    }

    return await this.prisma.article.update({
      where: { id },
      data: {
        draft: articleUpdate.draft,
        topic: { connect: { id: articleUpdate.topic ?? article.topicId} },
        title: articleUpdate.title,
        subtitle: articleUpdate.subtitle,
        content: articleUpdate.content,
        rawContent: articleUpdate.rawContent,
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

    if (isLiked) {
      await this.prisma.article.update({
        where: { id },
        data: {
          likeCounter: { increment: 1 },
          likes: { connect: { id: userId } },
        },
      });

      return await this.prisma.event.create({
        data: {
          article: { connect: { id } },
          type: EventType.LIKE,
          createdBy: { connect: { id: userId } },
        },
      });
    }

    // TODO: Check if this really works properly
    await this.prisma.article.update({
      where: { id },
      data: {
        likeCounter: { decrement: 1 },
        likes: { disconnect: { id: userId } },
      },
    });

    // If the user has already liked the article, we create an UNLIKE event
    return await this.prisma.event.create({
      data: {
        article: { connect: { id } },
        type: EventType.UNLIKE,
        createdBy: { connect: { id: userId } },
      },
    });
  }

  async remove(id: number) {
    const article = await this.prisma.article.findFirstOrThrow({
      where: { id },
    });

    await this.prisma.event.deleteMany({
      where: { articleId: id },
    });

    if (
      article.cid !== null &&
      (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging')
    ) {
      await this.ipfs.delete(article.cid);
    }

    return await this.prisma.article.delete({
      where: { id },
    });
  }
}
