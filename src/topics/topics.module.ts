import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { IPFSModule } from 'src/ipfs/ipfs.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { IPFSService } from 'src/ipfs/ipfs.service';
import { ArticlesService } from 'src/articles/articles.service';

@Module({
  imports: [PrismaModule, IPFSModule, ArticlesModule],
  controllers: [TopicsController],
  providers: [TopicsService, IPFSService, ArticlesService],
})
export class TopicsModule {}
