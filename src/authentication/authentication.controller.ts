/*
| Developed by Alexandre Schaffner
| Filename : authentication.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { InvalidCredentials } from '../errors/InvalidCredentials';
import { handleErrors } from '../utils/handle-errors';
import { AuthGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';

// ─────────────────────────────────────────────────────────────────────────────

@ApiTags('Auth')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Get('me')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  async me(@Req() req: Request) {
    try {
      return await this.authService.me(req.user.sub);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

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
          domain:
            process.env.NODE_ENV === 'dev'
              ? 'localhost'
              : process.env.DOMAIN_NAME,
          path: '/authentication/refresh-token',
        })
        .cookie('jwt', tokens.accessToken, {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === 'prod' ||
            process.env.NODE_ENV === 'staging',
          domain:
            process.env.NODE_ENV === 'dev'
              ? 'localhost'
              : process.env.DOMAIN_NAME,
          path: '/',
        });

      return { user };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

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
        domain:
          process.env.NODE_ENV === 'dev'
            ? 'localhost'
            : process.env.DOMAIN_NAME,
        path: '/',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging',
        domain:
          process.env.NODE_ENV === 'dev'
            ? 'localhost'
            : process.env.DOMAIN_NAME,
        path: '/authentication/refresh-token',
      });

      return { user };
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
      res.cookie(
        'jwt',
        await this.authService.refreshTokens(req.cookies['refreshToken']),
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === 'prod' ||
            process.env.NODE_ENV === 'staging',
          domain:
            process.env.NODE_ENV === 'dev'
              ? 'localhost'
              : process.env.DOMAIN_NAME,
          path: '/',
        },
      );
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
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      res.clearCookie('jwt');
      res.clearCookie('refreshToken', {
        path: '/authentication/refresh-token',
      });

      return [
        await this.authService.revokeToken(req.user.jti),
        await this.authService.revokeToken(req.user.refreshJti),
      ];
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('password')
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    try {
      return await this.authService.updatePassword(
        req.user.id,
        body.oldPassword,
        body.newPassword,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('email')
  async updateEmail(@Req() req: Request, @Body() body: UpdateEmailDto) {
    try {
      return await this.authService.updateEmail(req.user.id, body.newEmail);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('username')
  async updateUsername(@Req() req: Request, @Body() body: UpdateUsernameDto) {
    try {
      return await this.authService.updateUsername(
        req.user.id,
        body.newUsername,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
