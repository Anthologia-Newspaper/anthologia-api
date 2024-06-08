import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    await this.prisma.user.create({
      data: {
        email: 'john@eip.com',
        username: 'john',
        password: '123456',
      },
    });

    await this.prisma.user.create({
      data: {
        email: 'joe@eip.com',
        username: 'joe',
        password: '123456',
      },
    });

    await this.prisma.user.create({
      data: {
        email: 'daniel@eip.com',
        username: 'daniel',
        password: '123456',
      },
    });

    await this.prisma.user.create({
      data: {
        email: 'robert@eip.com',
        username: 'robert',
        password: '123456',
      },
    });

    await this.prisma.user.create({
      data: {
        email: 'sophie@eip.com',
        username: 'sophie',
        password: '123456',
      },
    });
  }
}
