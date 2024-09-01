import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IpfsModule } from 'src/ipfs/ipfs.module';
import { IPFSService } from 'src/ipfs/ipfs.service';

@Module({
  imports: [PrismaModule, IpfsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, IPFSService],
})
export class ArticlesModule {}
