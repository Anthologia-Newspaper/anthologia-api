import { Injectable } from '@nestjs/common';
import { CreateAnthologyDto } from './dto/create-anthology.dto';
import { UpdateAnthologyDto } from './dto/update-anthology.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnthologiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    newAnthology: CreateAnthologyDto,
    userId: number,
    articles?: { id: number }[],
  ) {
    return await this.prisma.anthology.create({
      data: {
        name: newAnthology.name,
        description: newAnthology.description,
        isPublic: newAnthology.isPublic,
        articles: {
          connect: articles,
        },
        compiler: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(author?: number, q?: string) {
    // TODO: Don't return private anthologies if the user is not the author
    return await this.prisma.anthology.findMany({
      where: {
        compiler: {
          id: author,
        },
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { compiler: { username: { contains: q } } },
        ],
      },
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} anthology`;
  }

  async update(
    id: number,
    anthologyUpdate: UpdateAnthologyDto,
    addArticles: { id: number }[],
    removeArticles: { id: number }[],
  ) {
    return await this.prisma.anthology.update({
      where: { id },
      data: {
        name: anthologyUpdate.name,
        description: anthologyUpdate.description,
        isPublic: anthologyUpdate.isPublic,
        articles: {
          connect: addArticles,
          disconnect: removeArticles,
        },
      },
    });
  }

  async remove(id: number) {
    // TODO: Disconnect articles before deleting anthology
    return await this.prisma.anthology.delete({
      where: { id },
    });
  }
}
