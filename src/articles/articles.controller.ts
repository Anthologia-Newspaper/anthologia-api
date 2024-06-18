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

@ApiTags('Articles')
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

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

  @Get()
  async findAll(@Req() req: Request, @Query() query: GetArticlesQueryParams) {
    try {
      let { author } = query;
      const { topic, anthologyId, draft, isLiked, q } = query;

      if (author === 'me' || (draft === true && author === undefined)) {
        author = req.user.sub;
      }

      // Due to custom validator, auto-transformation is not made on this property
      typeof author === 'string' && (author = +author);

      if (draft && author !== undefined && author !== req.user.sub)
        throw new UnauthorizedException('Cannot view drafts of other users.');

      return await this.articlesService.findAll(
        author,
        topic,
        anthologyId,
        draft,
        isLiked,
        q,
      );
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

  @Get('/anthology/:id')
  async findAllInAnthology(@Param('id') id: number) {
    try {
      return await this.articlesService.findAllInAnthology(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.articlesService.remove(+id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
