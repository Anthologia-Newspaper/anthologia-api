import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [PrismaModule],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
