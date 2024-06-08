import { Module } from '@nestjs/common';

import { AnthologiesModule } from './anthologies/anthologies.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';
import { TopicsModule } from './topics/topics.module';
import { SeederService } from './seeder/seeder.service';

@Module({
  imports: [
    PrismaModule,
    AuthenticationModule,
    ArticlesModule,
    TopicsModule,
    AnthologiesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
