import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: number) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        createdAt: true,
        email: true,
        username: true,
      },
    });
  }

  async updateProfilePic(userId: number, profilePicCid: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { profilePic: profilePicCid },
    });
  }

  async updateUsername(userId: number, newUsername: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });
  }
}
