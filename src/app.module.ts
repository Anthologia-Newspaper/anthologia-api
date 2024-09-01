import { Module } from '@nestjs/common';

import { AnthologiesModule } from './anthologies/anthologies.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TopicsModule } from './topics/topics.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    PrismaModule,
    AuthenticationModule,
    ArticlesModule,
    TopicsModule,
    AnthologiesModule,
    StatisticsModule,
    IpfsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
