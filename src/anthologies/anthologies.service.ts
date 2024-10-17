/*
| Developed by Alexandre Schaffner
| Filename : anthologies.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@epitech.eu)
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateAnthologyDto } from './dto/create-anthology.dto';
import { UpdateAnthologyDto } from './dto/update-anthology.dto';

@Injectable()
export class AnthologiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    newAnthology: CreateAnthologyDto,
    isPublic: boolean,
    userId: number,
  ) {
    return await this.prisma.anthology.create({
      data: {
        name: newAnthology.name,
        description: newAnthology.description,
        isPublic,
        articles: {
          connect: newAnthology.articles
            ? newAnthology.articles.map((id) => ({ id }))
            : [],
        },
        compiler: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        articles: true,
      },
    });
  }

  async findAll(owner: boolean, author?: number, q?: string) {
    // Only return public anthologies unless the user is the owner
    if (!owner) {
      return await this.prisma.anthology.findMany({
        where: {
          isPublic: true,
          compiler: { id: author },
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { compiler: { username: { contains: q } } },
          ],
        },
        include: {
          articles: true,
        },
      });
    }

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
      include: {
        articles: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.anthology.findUniqueOrThrow({
      where: { id },
      include: { articles: true },
    });
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
      include: {
        articles: true,
      },
    });
  }

  async remove(id: number) {
    const anthology = await this.prisma.anthology.findUniqueOrThrow({
      where: { id },
      include: { articles: true },
    });

    await this.prisma.anthology.update({
      where: { id },
      data: {
        articles: {
          disconnect: anthology.articles.map((article) => ({
            id: article.id,
          })),
        },
      },
    });

    return await this.prisma.anthology.delete({
      where: { id },
      include: { articles: true },
    });
  }
}
