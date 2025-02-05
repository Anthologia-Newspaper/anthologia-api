import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { InvalidCredentials } from 'src/errors/InvalidCredentials';
import { v4 as uuid } from 'uuid';

import { InvalidTokenType } from '../errors/InvalidTokenType';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './contracts/JwtPayload.interface';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtType } from './enums/JwtType.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(sub: number) {
    const refreshJti = uuid();

    const tokens = {
      accessToken: await this.jwtService.signAsync(
        {
          type: JwtType.ACCESS,
          refreshJti,
          sub,
        },
        {
          jwtid: uuid(),
          expiresIn: '2h',
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        {
          type: JwtType.REFRESH,
          expiresIn: '20d',
          sub,
        },
        {
          jwtid: refreshJti,
        },
      ),
    };

    return tokens;
  }

  async signUp(newUser: SignUpDto) {
    newUser.password = await bcrypt.hash(newUser.password, 10);

    const user = await this.prisma.user.create({ data: newUser });

    const tokens = await this.generateTokens(user.id);

    return { user, tokens };
  }

  async signIn(credentials: SignInDto) {
    const { email, password } = credentials;

    const user = await this.prisma.user.findUniqueOrThrow({ where: { email } });

    if (!(await bcrypt.compare(password, user.password))) {
      throw new InvalidCredentials();
    }

    const tokens = await this.generateTokens(user.id);

    return { user, tokens };
  }

  // TODO: also refresh refresh token
  async refreshTokens(refreshToken: string) {
    const { sub, type, jti } = (await this.jwtService.decode(
      refreshToken,
    )) as JwtPayload;

    await this.prisma.user.findUniqueOrThrow({ where: { id: sub } });

    if (await this.prisma.revokedToken.findFirst({ where: { jti } }))
      throw new InvalidCredentials();

    if (type !== JwtType.REFRESH) throw new InvalidTokenType();

    await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    return await this.generateTokens(sub);
  }

  async revokeToken(jti: string): Promise<RevokedToken> {
    return await this.prisma.revokedToken.create({
      data: { jti },
    });
  }

  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new InvalidCredentials();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateEmail(userId: number, newEmail: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }
}
