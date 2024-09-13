import { Module } from '@nestjs/common';
import { IPFSModule } from 'src/ipfs/ipfs.module';
import { IPFSService } from 'src/ipfs/ipfs.service';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [PrismaModule, IPFSModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, IPFSService],
})
export class ArticlesModule {}
