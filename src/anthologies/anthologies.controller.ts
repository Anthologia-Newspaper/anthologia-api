/*
| Developed by Alexandre Schaffner
| Filename : anthologies.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@epitech.eu)
*/

import {
  Body,
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

@ApiTags('Anthologies')
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('anthologies')
export class AnthologiesController {
  constructor(private readonly anthologiesService: AnthologiesService) {}

  @Post()
  async create(
    @User() user: JwtPayload,
    @Body('isPublic', new DefaultValuePipe(false), ParseBoolPipe)
    isPublic: boolean,
    @Body() newAnthology: CreateAnthologyDto,
  ) {
    try {
      const articles = newAnthology.articles.map((id) => ({ id }));

      return await this.anthologiesService.create(
        newAnthology,
        isPublic,
        user.sub,
        articles,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

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

      return await this.anthologiesService.findAll(
        author === user.sub,
        author,
        q,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get(':id/articles')
  async findOne(@Param('id') id: number) {
    try {
      return await this.anthologiesService.findOne(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

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

      return await this.anthologiesService.update(
        id,
        updateAnthologyDto,
        addArticles,
        removeArticles,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.anthologiesService.remove(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
