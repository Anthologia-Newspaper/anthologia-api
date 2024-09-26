import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseBoolPipe,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { JwtPayload } from 'src/authentication/contracts/JwtPayload.interface';
import { User } from 'src/decorators/user.decorator';
import { TopicEntity } from 'src/topics/entities/Topic.entity';
import { UserEntity } from 'src/user/entities/User.entity';
import { handleErrors } from 'src/utils/handle-errors';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesQueryParamsDto } from './dto/get-articles-query-params.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity, ArticlesEntity } from './entities/Article.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPFSService } from 'src/ipfs/ipfs.service';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly ipfsService: IPFSService,
  ) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      const newArticle = await this.articlesService.create(
        user.sub,
        createArticleDto,
      );
      return new ArticleEntity(newArticle);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  @Patch(':id/banner')
  async updateBanner(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '[image/png,image.jpeg,image.jpg]',
          }),
        ],
      }),
    )
    banner: Express.Multer.File,
  ) {
    try {
      const cid = await this.ipfsService.uploadImage(banner);
      return await this.articlesService.updateBanner(+id, cid);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() query: GetArticlesQueryParamsDto) {
    try {
      const { authorId, topicId, anthologyId, q, items, page } = query;
      const articles = await this.articlesService.findAll({
        authorId,
        topicId,
        anthologyId,
        q,
        draft: false,
        items,
        page,
      });

      return articles;
      // return new ArticlesEntity({ articles });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  async findAllMyArticles(
    @User() user: JwtPayload,
    @Query() query: GetArticlesQueryParamsDto,
  ) {
    try {
      const { draft, topicId, anthologyId, q, items, page } = query;
      const articles = await this.articlesService.findAll({
        authorId: user.sub,
        draft,
        topicId,
        anthologyId,
        q,
        items,
        page,
      });

      return new ArticlesEntity({ articles });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('drafts/:id')
  async findOneDraft(@User() user: JwtPayload, @Param('id') id: string) {
    try {
      const draft = await this.articlesService.findOne(+id, user.sub);
      return new ArticleEntity({
        ...draft,
        author: new UserEntity(draft.author),
        topic: new TopicEntity(draft.topic),
      });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('liked')
  async findAllLiked(
    @User() user: JwtPayload,
    @Query() query: GetArticlesQueryParamsDto,
  ) {
    try {
      const articles = await this.articlesService.findAll({
        authorId: user.sub,
        isLiked: true,
        topicId: query.topicId,
        anthologyId: query.anthologyId,
        q: query.q,
        items: query.items,
        page: query.page,
      });

      return new ArticlesEntity({ articles });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const article = await this.articlesService.findOne(+id);

      return new ArticleEntity({
        ...article,
        author: new UserEntity(article.author),
        topic: new TopicEntity(article.topic),
      });
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      return new ArticleEntity(
        await this.articlesService.update(+id, updateArticleDto),
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ArticleEntity(await this.articlesService.remove(+id));
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
