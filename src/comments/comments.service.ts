import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, createCommentDto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        article: {
          connect: { id: createCommentDto.articleId },
        },
        author: {
          connect: { id: authorId },
        },
      },
    });
  }

  async findByArticleId(articleId: number) {
    return await this.prisma.comment.findMany({ where: { articleId } });
  }

  async remove(id: number) {
    return await this.prisma.comment.delete({
      where: { id },
    });
  }
}
