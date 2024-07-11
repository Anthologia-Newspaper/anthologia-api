import { Module } from '@nestjs/common';
import { IPFSService } from './ipfs.service';

@Module({})
export class IpfsModule {
    providers: [IPFSService]
}
