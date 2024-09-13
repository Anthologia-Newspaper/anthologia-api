import { Module } from '@nestjs/common';
import { IPFSModule } from 'src/ipfs/ipfs.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, IPFSModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
