import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';

import { handleErrors } from '../utils/handle-errors';
import { StatisticsService } from './statistics.service';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('articles/:id')
  async getArticleStatistics(@Param('id') id: number) {
    try {
      return await this.statisticsService.getArticleStatistics(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Get('users/:id')
  async getUserStatistics(@Param('id') id: number) {
    try {
      return await this.statisticsService.getUserStatistics(id);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
