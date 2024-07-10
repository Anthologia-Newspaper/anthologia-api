import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { handleErrors } from 'src/utils/handle-errors';

import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topics.service';
import { ApiKeyOrAuthGuard } from 'src/utils/apikeyorauth.guard';

@ApiTags('Topics')
@ApiCookieAuth()
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    try {
      return this.topicsService.create(createTopicDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseGuards(ApiKeyOrAuthGuard)
  @Get()
  async findAll() {
    try {
      return this.topicsService.findAll();
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    try {
      return this.topicsService.update(id, updateTopicDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return this.topicsService.remove(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
