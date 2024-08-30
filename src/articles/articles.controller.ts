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
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { handleErrors } from 'src/utils/handle-errors';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesQueryParams } from './dto/get-articles-query-params.dto.ts';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/authentication/contracts/JwtPayload.interface';

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
    @User() user: JwtPayload,
    @Query() query: GetArticlesQueryParams,
  ) {
    try {
      let { author } = query;
      const { topicId, anthologyId, isLiked, q } = query;

      if (author === 'me') author = user.sub;

      // Due to custom validator, auto-transformation is not made on this property
      typeof author === 'string' && (author = +author);

      return await this.articlesService.findAll(
        author,
        topicId,
        anthologyId,
        isLiked,
        q,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('drafts')
  async findAllDraft(
    @User() user: JwtPayload,
    @Query() query: GetArticlesQueryParams,
  ) {
    try {
      const { topicId, anthologyId, isLiked, q } = query;

      return await this.articlesService.findAllDrafts(
        user.sub,
        topicId,
        anthologyId,
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
