/*
| Developed by Alexandre Schaffner
| Filename : anthologies.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@epitech.eu)
*/

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { JwtPayload } from 'src/authentication/contracts/JwtPayload.interface';
import { User } from 'src/decorators/user.decorator';
import { handleErrors } from 'src/utils/handle-errors';

import { AnthologiesService } from './anthologies.service';
import { CreateAnthologyDto } from './dto/create-anthology.dto';
import { GetAnthologiesQueryParams } from './dto/get-anthologies-query-params.dto';
import { UpdateAnthologyDto } from './dto/update-anthology.dto';
import { AnthologyEntity } from './entities/Anthology.entity';
import { ArticleEntity } from 'src/articles/entities/Article.entity';

@ApiTags('Anthologies')
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('anthologies')
export class AnthologiesController {
  constructor(private readonly anthologiesService: AnthologiesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @User() user: JwtPayload,
    @Body('isPublic', new DefaultValuePipe(false), ParseBoolPipe)
    isPublic: boolean,
    @Body() newAnthology: CreateAnthologyDto,
  ) {
    try {
      const anthology = await this.anthologiesService.create(
        newAnthology,
        isPublic,
        user.sub,
      );

      return new AnthologyEntity(anthology);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @User() user: JwtPayload,
    @Query() query: GetAnthologiesQueryParams,
  ) {
    try {
      let { author } = query;
      const { q } = query;

      if (author === 'me') author = user.sub;

      // Due to custom validator, auto-transformation is not made on this property
      typeof author === 'string' && (author = +author);

      const anthologies = await this.anthologiesService.findAll(
        author === user.sub,
        author,
        q,
      );

      return anthologies.map((anthology) => {
        const articles = anthology.articles.map(
          (article) => new ArticleEntity(article),
        );
        return new AnthologyEntity({ ...anthology, articles });
      });
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return new AnthologyEntity(await this.anthologiesService.findOne(id));
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAnthologyDto: UpdateAnthologyDto,
  ) {
    try {
      const addArticles = updateAnthologyDto.addArticles.map((id) => ({ id }));
      const removeArticles = updateAnthologyDto.removeArticles.map((id) => ({
        id,
      }));

      return new AnthologyEntity(
        await this.anthologiesService.update(
          id,
          updateAnthologyDto,
          addArticles,
          removeArticles,
        ),
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return new AnthologyEntity(await this.anthologiesService.remove(id));
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
