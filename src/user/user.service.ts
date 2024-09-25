import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: number) {
    return await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
  }

  async getUser(userId: number) {
    return await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
  }

  async updateProfilePic(userId: number, profilePicCid: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { profilePicCid },
    });
  }

  async updateUsername(userId: number, newUsername: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });
  }
}
