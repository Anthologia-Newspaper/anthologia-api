import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, createCommentDto: CreateCommentDto) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { id: createCommentDto.articleId },
      select: { draft: true },
    });

    if (article.draft)
      throw new ConflictException('You cannot comment on a draft article');

    return await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        article: { connect: { id: createCommentDto.articleId } },
        author: { connect: { id: authorId } },
      },
    });
  }

  async findByArticleId(articleId: number) {
    return await this.prisma.comment.findMany({ where: { articleId } });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: { id },
      select: { authorId: true },
    });

    if (comment.authorId !== userId)
      throw new ConflictException('You are not the author of this comment');

    return await this.prisma.comment.delete({ where: { id } });
  }
}
