import { ConflictException, Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IPFSService } from 'src/ipfs/ipfs.service';

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
        anthology: article.anthology
          ? { connect: { id: article.anthology } }
          : undefined,
      },
    });

    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging') {
      const cid = await this.ipfs.pin(
        article.content,
        createdArticle.subtitle ?? '',
        createdArticle.id,
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

  async findAll(
    authorId?: number,
    topicId?: number,
    anthologyId?: number,
    state?: string,
    isLiked?: boolean,
    q?: string,
  ) {
    const draftStates = state === 'draft' ? true : state === 'both' ? undefined : false;

  // Build query conditions dynamically to avoid repetition
  const where: any = {
    authorId,
    topicId,
    anthology: anthologyId ? { some: { id: anthologyId } } : undefined,
    draft: draftStates,  // Automatically handles undefined for 'both'
    likes: isLiked ? { some: { id: authorId } } : undefined,
    OR: q ? [
      { title: { contains: q } },
      { subtitle: { contains: q } },
      { content: { contains: q } },
      { author: { username: { contains: q } } }
    ] : undefined,
  };

  // Filter out undefined fields from the `where` condition
  Object.keys(where).forEach((key) => where[key] === undefined && delete where[key]);

  return this.prisma.article.findMany({
    where,
  });
  }

  async findOne(id: number, requesterId?: number) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { id },
      include: {
        anthology: true,
        author: true,
        topic: true,
      },
    });

    if (article.draft && article.authorId !== requesterId)
      throw new ConflictException('Cannot view drafts of other users.');

    if (requesterId === undefined) return article;
    await this.prisma.event.create({
      data: {
        article: { connect: { id } },
        type: EventType.VIEW,
        createdBy: { connect: { id: requesterId } },
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

  async update(id: number, articleUpdate: UpdateArticleDto) {
    // if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging') {
      const article = await this.prisma.article.findFirstOrThrow({
        where: { id },
      });

      let newCid = article.cid;

      if (article.cid) {
        console.log('there')
        newCid = await this.ipfs.update(
          articleUpdate.content ?? article.content,
          articleUpdate.subtitle ?? article.subtitle ?? '',
          article.cid,
          id,
        );
      } else if (article.draft && !articleUpdate.draft) { // case if we go from a draft article to a published one
        newCid = await this.ipfs.pin(
          articleUpdate.content ?? article.content,
          articleUpdate.subtitle ?? article.subtitle ?? '',
          id,
        )
      }

      return await this.prisma.article.update({
        where: { id },
        data: {
          draft: articleUpdate.draft,
          topic: { connect: { id: articleUpdate.topic ?? article.topicId } },
          title: articleUpdate.title,
          subtitle: articleUpdate.subtitle,
          content: articleUpdate.content,
          cid: newCid,
          anthology: articleUpdate.anthology
            ? { connect: { id: articleUpdate.anthology } }
            : undefined,
        },
      });
    // }

    // return await this.prisma.article.update({
    //   where: { id },
    //   data: {
    //     draft: articleUpdate.draft,
    //     topic: { connect: { id: articleUpdate.topic } },
    //     title: articleUpdate.title,
    //     subtitle: articleUpdate.subtitle,
    //     content: articleUpdate.content,
    //     anthology: articleUpdate.anthology
    //       ? { connect: { id: articleUpdate.anthology } }
    //       : undefined,
    //   },
    // });
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
