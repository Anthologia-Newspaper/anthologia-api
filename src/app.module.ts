import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [PrismaModule, AuthenticationModule, ArticlesModule, TopicsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
