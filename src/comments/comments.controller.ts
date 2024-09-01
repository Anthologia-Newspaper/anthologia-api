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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { handleErrors } from 'src/utils/handle-errors';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      return await this.commentsService.create(req.user.sub, createCommentDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get('/article/:articleId')
  findAll(@Param('articleId') articleId: number) {
    return this.commentsService.findByArticleId(articleId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
