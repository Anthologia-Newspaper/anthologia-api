import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { handleErrors } from 'src/utils/handle-errors';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    try {
      return this.topicsService.create(createTopicDto);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get()
  async findAll() {
    try {
      return this.topicsService.findAll();
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return this.topicsService.remove(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
