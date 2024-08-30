/*
| Developed by Alexandre Schaffner
| Filename : comments.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@epitech.eu)
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { JwtPayload } from 'src/authentication/contracts/JwtPayload.interface';
import { User } from 'src/decorators/user.decorator';
import { handleErrors } from 'src/utils/handle-errors';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      return await this.commentsService.create(user.sub, createCommentDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get('article/:articleId')
  async findAll(@Param('articleId') articleId: number) {
    try {
      return await this.commentsService.findByArticleId(articleId);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@User() user: JwtPayload, @Param('id') id: number) {
    try {
      return await this.commentsService.remove(id, user.sub);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
