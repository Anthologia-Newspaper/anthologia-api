/*
| Developed by Alexandre Schaffner
| Filename : authentication.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from 'src/decorators/user.decorator';

import { InvalidCredentials } from '../errors/InvalidCredentials';
import { handleErrors } from '../utils/handle-errors';
import { AuthGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { JwtPayload } from './contracts/JwtPayload.interface';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from 'src/user/entities/User.entity';

// ─────────────────────────────────────────────────────────────────────────────

@ApiTags('Auth')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-up')
  async signUp(
    @Body() body: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, tokens } = await this.authService.signUp(body);

      // Setting access and refresh tokens as cookies
      //--------------------------------------------------------------------------
      res
        .cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === 'prod' ||
            process.env.NODE_ENV === 'staging',
          path: '/authentication/refresh-token',
          sameSite: 'none',
        })
        .cookie('jwt', tokens.accessToken, {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === 'prod' ||
            process.env.NODE_ENV === 'staging',
          path: '/',
          sameSite: 'none',
        });

      return new UserEntity(user);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, tokens } = await this.authService.signIn(body);

      // Setting access and refresh tokens as cookies
      //--------------------------------------------------------------------------
      res.cookie('jwt', tokens.accessToken, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging',
        path: '/',
        sameSite: 'none',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging',
        path: '/authentication/refresh-token',
        sameSite: 'none',
      });

      return new UserEntity(user);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!req.cookies['refreshToken']) throw new InvalidCredentials();

      res.cookie(
        'jwt',
        (await this.authService.refreshTokens(req.cookies['refreshToken']))
          .accessToken,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === 'prod' ||
            process.env.NODE_ENV === 'staging',
          path: '/',
          sameSite: 'none',
        },
      );

      return;
    } catch (err: unknown) {
      if (err instanceof InvalidCredentials) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken', {
          path: '/authentication/refresh-token',
        });
      }

      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete('revoke-token')
  async revokeToken(
    @User() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      res.clearCookie('jwt');
      res.clearCookie('refreshToken', {
        path: '/authentication/refresh-token',
      });

      return [
        await this.authService.revokeToken(user.jti),
        user.refreshJti
          ? await this.authService.revokeToken(user.refreshJti)
          : null,
      ];
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('password')
  async updatePassword(
    @User() user: JwtPayload,
    @Body() body: UpdatePasswordDto,
  ) {
    try {
      await this.authService.updatePassword(
        user.sub,
        body.oldPassword,
        body.newPassword,
      );

      return { success: true, message: 'Password updated successfully.' };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('email')
  async updateEmail(@User() user: JwtPayload, @Body() body: UpdateEmailDto) {
    try {
      await this.authService.updateEmail(user.sub, body.newEmail);

      return { success: true, message: 'Email updated successfully.' };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
