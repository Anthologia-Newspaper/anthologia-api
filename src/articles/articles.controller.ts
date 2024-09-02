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
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { handleErrors } from 'src/utils/handle-errors';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesQueryParams } from './dto/get-articles-query-params.dto.ts';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiKeyOrAuthGuard } from 'src/utils/apiKeyOrAuth.guard';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      return await this.articlesService.create(req.user.sub, createArticleDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseGuards(ApiKeyOrAuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Query() query: GetArticlesQueryParams) {
    try {
      let { author } = query;
      const { topic, anthologyId, state, isLiked, q } = query;
      const isLikedBoolean = isLiked === 'true' ? true : isLiked === 'false' ? false : undefined;

      if (author === 'me' || author === undefined) {
        author = req.user.sub;
      }

      // Due to custom validator, auto-transformation is not made on this property
      typeof author === 'string' && (author = +author);

      if (author !== undefined && author !== req.user.sub)
        throw new UnauthorizedException('Cannot view drafts of other users.');

      return await this.articlesService.findAll(
        author,
        topic,
        anthologyId,
        state,
        isLikedBoolean,
        q,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    try {
      return await this.articlesService.findOne(+id, req.user.sub);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('/:id/like')
  async updateLike(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
    @Body('isLiked', new ParseBoolPipe()) isLiked: boolean,
  ) {
    try {
      return await this.articlesService.updateLike(id, req.user.sub, isLiked);
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
