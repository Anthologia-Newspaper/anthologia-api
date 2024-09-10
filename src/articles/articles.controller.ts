import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { JwtPayload } from 'src/authentication/contracts/JwtPayload.interface';
import { User } from 'src/decorators/user.decorator';
import { handleErrors } from 'src/utils/handle-errors';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesQueryParamsDto } from './dto/get-articles-query-params.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      return await this.articlesService.create(user.sub, createArticleDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get()
  async findAll(
    @Query() query: GetArticlesQueryParamsDto,
    @Res() res: Response,
  ) {
    try {
      const { authorId, topicId, anthologyId, q } = query;

      return res.send(
        await this.articlesService.findAll({
          authorId,
          topicId,
          anthologyId,
          q,
          draft: false,
        }),
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  async findAllMyArticles(
    @User() user: JwtPayload,
    query: GetArticlesQueryParamsDto,
  ) {
    try {
      const { draft, topicId, anthologyId, q } = query;

      return await this.articlesService.findAll({
        authorId: user.sub,
        draft,
        topicId,
        anthologyId,
        q,
      });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('me/drafts')
  async findAllDrafts(
    @User() user: JwtPayload,
    @Query() query: GetArticlesQueryParamsDto,
  ) {
    try {
      return await this.articlesService.findAll({
        ...query,
        authorId: user.sub,
        draft: true,
      });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('me/drafts/:id')
  async findOneDraft(@User() user: JwtPayload, @Param('id') id: string) {
    try {
      return await this.articlesService.findOne(+id, user.sub);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('liked')
  async findAllLiked(
    @User() user: JwtPayload,
    @Query() query: GetArticlesQueryParamsDto,
  ) {
    try {
      return await this.articlesService.findAll({
        authorId: user.sub,
        isLiked: true,
        topicId: query.topicId,
        anthologyId: query.anthologyId,
        q: query.q,
      });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.articlesService.findOne(+id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('/:id/like')
  async updateLike(
    @User() user: JwtPayload,
    @Param('id', new ParseIntPipe()) id: number,
    @Body('isLiked', new ParseBoolPipe()) isLiked: boolean,
  ) {
    try {
      return await this.articlesService.updateLike(id, user.sub, isLiked);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      return this.articlesService.update(+id, updateArticleDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.articlesService.remove(+id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
