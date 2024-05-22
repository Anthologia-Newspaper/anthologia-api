import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AnthologiesController } from './anthologies.controller';
import { AnthologiesService } from './anthologies.service';

@Module({
  imports: [PrismaModule],
  controllers: [AnthologiesController],
  providers: [AnthologiesService],
})
export class AnthologiesModule {}
